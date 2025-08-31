// pages/api/webhooks/stripe.js
import Stripe from 'stripe';
import { buffer } from 'micro';
import { writeClient } from '../../../lib/client'; // Use writeClient

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: { bodyParser: false }, // Stripe needs the raw body
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    // --- Webhook Verification ---
    if (!webhookSecret) {
      console.error('⚠️ Stripe webhook secret is not configured.');
      return res.status(500).send('Webhook secret not configured.');
    }
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
      console.log(`✅ Stripe Webhook Event Received: ${event.type}`);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // --- Handle checkout.session.completed ---
    if (event.type === 'checkout.session.completed') {
      const sessionFromEvent = event.data.object;
      console.log('🛒 Checkout Session Completed! Session ID:', sessionFromEvent.id);

      if (sessionFromEvent.payment_status === 'paid') {
        try {
          // IDEMPOTENCY CHECK
          const existingOrder = await writeClient.fetch(
            `*[_type == "order" && _id == $sessionId][0]`,
            { sessionId: sessionFromEvent.id }
          );
          if (existingOrder) {
            console.log(`Order ${sessionFromEvent.id} already exists. Skipping creation/update.`);
            return res.status(200).json({ received: true, message: 'Order already processed.' });
          }
          console.log(`No existing order found for ${sessionFromEvent.id}. Proceeding to create.`);

          // RETRIEVE EXPANDED SESSION
          const expandedSession = await stripe.checkout.sessions.retrieve(
            sessionFromEvent.id,
            {
              expand: ['customer', 'shipping', 'shipping_details', 'customer_details']
            }
          );

          // GET LINE ITEMS
          const lineItems = await stripe.checkout.sessions.listLineItems(
            sessionFromEvent.id,
            { expand: ['data.price.product'] }
          );
          if (!lineItems?.data || lineItems.data.length === 0) {
            throw new Error(`Could not retrieve valid line items for session ${sessionFromEvent.id}`);
          }

          // PROCESS LINE ITEMS & PREPARE PATCHES
          const processedOrderItems = [];
          const patchOperations = [];

          await Promise.all(
            lineItems.data.map(async (item) => {
              const stripeProductId = item.price?.product?.id;
              const quantity = item.quantity;
              const pricePerItem = item.price?.unit_amount / 100;
              const lineItemId = item.id;
              const productName = item.price?.product?.name; // The full name from Stripe line item (e.g., "SculptTee (Light Orange / M)")
              const productImages = item.price?.product?.images; // Images array from Stripe product

              if (!stripeProductId || !quantity || pricePerItem === undefined) {
                console.warn(`Skipping line item ${lineItemId} due to missing data.`);
                return;
              }

              let sanityProductId = item.price?.product?.metadata?.sanity_id;

              // Fallback lookup by base name if metadata missing
              if (!sanityProductId) {
                // Extract base product name by removing variant info in parentheses
                const baseProductName = productName?.split('(')[0].trim();
                console.warn(
                  `Missing 'sanity_id' in metadata for Stripe product ${stripeProductId} (${productName}). Attempting fallback by base name: '${baseProductName}'.`
                );
                try {
                  const fallbackProduct = await writeClient.fetch(
                    `*[_type == "product" && name == $name][0]`, // Use exact match for fallback
                    { name: baseProductName }
                  );
                  if (fallbackProduct?._id) {
                    sanityProductId = fallbackProduct._id;
                    console.log(`   - Fallback successful. Using Sanity ID: ${sanityProductId}`);
                  } else {
                    console.warn(`   - Fallback found no match for base name '${baseProductName}'. Skipping item.`);
                    return;
                  }
                } catch (fallbackError) {
                  console.error(`   - Error during fallback lookup for '${baseProductName}':`, fallbackError);
                  return;
                }
              } else {
                console.log(`   - Found metadata. Mapping Stripe product ${stripeProductId} to Sanity ID ${sanityProductId}`);
              }

              // --- Extract variant details from Stripe product name ---
              let variantColorName = null;
              let variantSize = null;
              let variantKey = null; // Assuming variantKey might be in metadata if implemented
              let variantImageSanityRef = null; // To store Sanity image reference

              // Example for parsing: "SculptTee (Light Orange / M)"
              const variantMatch = productName.match(/\((.*?)\)/);
              if (variantMatch && variantMatch[1]) {
                const parts = variantMatch[1].split(' / ').map(p => p.trim());
                if (parts.length === 2) {
                  variantColorName = parts[0];
                  variantSize = parts[1];
                } else if (parts.length === 1) {
                   // If only one part, assume it's color
                   variantColorName = parts[0];
                }
              }

              // If the product has a variant image URL in Stripe,
              // we can try to find its corresponding Sanity asset ID.
              // This is complex and usually requires mapping Stripe image URLs to Sanity asset IDs
              // (e.g., storing Sanity asset IDs in Stripe product/image metadata during sync).
              // For simplicity now, we'll try to find a variant image from the Sanity product itself.
              // This might involve another Sanity lookup if `variantKey` isn't available.
              // A more robust approach would be to pass the variant's Sanity image asset _id
              // as metadata on the Stripe Product when you sync products.

              // For now, let's keep it simple: if variant exists, fetch its image info from Sanity.
              // This will require an additional Sanity fetch within the loop, which can be slow.
              // For a production system, consider pre-populating metadata or using a queue.
              if (sanityProductId && (variantColorName || variantSize)) {
                try {
                    const sanityProductWithVariants = await writeClient.fetch(`*[_id == $id][0]{variants[]{_key, colorName, size, variantImage{asset->{_id,url}}}}`, { id: sanityProductId });
                    if (sanityProductWithVariants && sanityProductWithVariants.variants) {
                        const matchedVariant = sanityProductWithVariants.variants.find(v => 
                            (v.colorName === variantColorName || !variantColorName) &&
                            (v.size === variantSize || !variantSize)
                        );
                        if (matchedVariant?.variantImage?.asset?._id) {
                            variantImageSanityRef = {
                                _type: 'image',
                                asset: { _type: 'reference', _ref: matchedVariant.variantImage.asset._id }
                            };
                            variantKey = matchedVariant._key; // Also capture variant _key here
                        }
                    }
                } catch (imgFetchError) {
                    console.error(`Error fetching variant image/key for ${productName}:`, imgFetchError);
                }
              }


              // Add to list for Sanity order item array
              processedOrderItems.push({
                _key: lineItemId, // Using Stripe line item ID as _key for uniqueness in Sanity array
                _type: 'object',
                product: { _type: 'reference', _ref: sanityProductId },
                quantity: quantity,
                pricePerItem: pricePerItem,
                ...(variantColorName && { variantColorName: variantColorName }),
                ...(variantSize && { variantSize: variantSize }),
                ...(variantKey && { variantKey: variantKey }),
                ...(variantImageSanityRef && { variantImage: variantImageSanityRef }),
              });

              // --- Inventory Decrement Logic (Critical for Variants) ---
              // This part needs to be aware of whether it's a simple product or a variant.
              // If it's a variant, you MUST target the `variantStock` field.
              // To do this reliably, you need the Sanity variant's `_key` or `_id`
              // passed from the frontend to Stripe metadata, and then to the webhook.
              // For this solution, we fetched `variantKey` in the previous step.

              if (sanityProductId && variantKey) {
                  // This is a variant product, decrement its specific variantStock
                  console.log(` - Patching variant product ${sanityProductId} (key: ${variantKey}), decrementing variantStock by ${quantity}`);
                  patchOperations.push(
                    writeClient
                      .patch(sanityProductId)
                      .dec({ [`variants[_key=="${variantKey}"].variantStock`]: quantity }) // Target specific variant's stock
                      .commit({ visibility: 'async' })
                      .then((updatedDoc) =>
                        console.log(`   - Variant stock updated for ${sanityProductId} (${variantKey}). New count: ${updatedDoc?.variants?.find(v => v._key === variantKey)?.variantStock ?? 'N/A'}`)
                      )
                      .catch((error) =>
                        console.error(`   - FAILED to update variant stock for ${sanityProductId} (${variantKey}):`, error)
                      )
                  );
              } else if (sanityProductId) {
                  // This is a simple (non-variant) product, decrement its main inventory
                  console.log(` - Patching non-variant product ${sanityProductId}, decrementing inventory by ${quantity}`);
                  patchOperations.push(
                    writeClient
                      .patch(sanityProductId)
                      .setIfMissing({ inventory: 0 })
                      .dec({ inventory: quantity })
                      .commit({ visibility: 'async' })
                      .then((updatedDoc) =>
                        console.log(`   - Inventory updated for ${sanityProductId}. New count: ${updatedDoc?.inventory ?? 'N/A'}`)
                      )
                      .catch((error) =>
                        console.error(`   - FAILED to update inventory for ${sanityProductId}:`, error)
                      )
                  );
              }
            })
          );

          // 4. VALIDATE PROCESSED ITEMS
          if (processedOrderItems.length === 0) {
            throw new Error(
              `Failed to process/link any line items for session ${sessionFromEvent.id}. Order not created.`
            );
          }

          // 5. FIND OR CREATE USER BASED ON EMAIL
          const customerEmail = expandedSession.customer_details?.email ||
                               (expandedSession.customer ? expandedSession.customer.email : null);

          let userReference = null;

          if (customerEmail) {
            const existingUser = await writeClient.fetch(
              `*[_type == "user" && email == $email][0]`,
              { email: customerEmail }
            );

            if (existingUser) {
              userReference = { _type: 'reference', _ref: existingUser._id };
            } else {
              const userData = {
                _type: 'user',
                name: expandedSession.shipping?.name || expandedSession.customer_details?.name || 'Customer',
                email: customerEmail,
                createdAt: new Date().toISOString()
              };
              try {
                const newUser = await writeClient.create(userData);
                userReference = { _type: 'reference', _ref: newUser._id };
              } catch (userError) {
                console.error(`Failed to create user document for ${customerEmail}:`, userError);
              }
            }
          }

          // 6. PREPARE FINAL ORDER DATA
          const shippingAddress = {
            _type: 'object',
            line1: expandedSession.shipping?.address?.line1 || expandedSession.shipping_details?.address?.line1 || expandedSession.customer_details?.address?.line1 || '',
            line2: expandedSession.shipping?.address?.line2 || expandedSession.shipping_details?.address?.line2 || expandedSession.customer_details?.address?.line2 || '',
            city: expandedSession.shipping?.address?.city || expandedSession.shipping_details?.address?.city || expandedSession.customer_details?.address?.city || '',
            state: expandedSession.shipping?.address?.state || expandedSession.shipping_details?.address?.state || expandedSession.customer_details?.address?.state || '',
            postal_code: expandedSession.shipping?.address?.postal_code || expandedSession.shipping_details?.address?.postal_code || expandedSession.customer_details?.address?.postal_code || '',
            country: expandedSession.shipping?.address?.country || expandedSession.shipping_details?.address?.country || expandedSession.customer_details?.address?.country || '',
          };

          const orderData = {
            _type: 'order',
            _id: sessionFromEvent.id,
            stripeSessionId: sessionFromEvent.id,
            customerName: expandedSession.shipping?.name || expandedSession.customer_details?.name || 'N/A',
            customerEmail: customerEmail || 'N/A',
            shippingAddress,
            orderItems: processedOrderItems,
            totalAmount: sessionFromEvent.amount_total / 100,
            status: 'paid',
            paidAt: new Date(sessionFromEvent.created * 1000).toISOString(),
            ...(userReference && { user: userReference })
          };
          console.log('Prepared Sanity order document:', JSON.stringify(orderData, null, 2));

          // 7. CREATE ORDER in Sanity
          await writeClient.createOrReplace(orderData);
          console.log(`✅ Order ${sessionFromEvent.id} saved/updated in Sanity.`);

          // 8. EXECUTE INVENTORY DECREMENTS (collected in `patchOperations` array)
          console.log(`Executing inventory decrement patches for order ${sessionFromEvent.id}...`);
          await Promise.all(patchOperations); // Wait for all patch promises to resolve
          console.log(`Inventory decrement process complete for order ${sessionFromEvent.id}.`);

          // 9. SEND EMAIL (Placeholder)
          console.log(`TODO: Send confirmation email to ${orderData.customerEmail}`);

          console.log('--- Fulfillment Logic Complete ---');
        } catch (fulfillmentError) {
          console.error(`❌ Error during fulfillment for session ${sessionFromEvent.id}:`, fulfillmentError);
        }
      } else {
        console.warn(
          `Checkout session ${sessionFromEvent.id} completed but payment status is ${sessionFromEvent.payment_status}. No fulfillment action taken.`
        );
      }
    }
    // --- Handle other event types if needed ---
    else {
      console.warn(`🤷‍♀️ Unhandled event type ${event.type}`);
    }

    // Return 200 OK to Stripe
    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;