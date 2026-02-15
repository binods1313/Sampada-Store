import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import axios from 'axios';

const PRINTIFY_API = 'https://api.printify.com/v1';

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { designId } = await req.json();

    const design = await db.customDesign.findUnique({
        where: { id: designId },
        include: { user: true },
    });

    if (!design) {
        return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // Verify ownership
    if (design.user.email !== session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log(`🎨 Exporting design ${designId} to Printify...`);

    try {
        // Step 1: Upload image to Printify
        const imageRes = await axios.post(
            `${PRINTIFY_API}/uploads/images.json`,
            {
                file_name: `design-${design.id}.png`,
                url: design.thumbnail,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const imageId = imageRes.data.id;
        console.log(`✅ Image uploaded, ID: ${imageId}`);

        // Step 2: Create product
        const productRes = await axios.post(
            `${PRINTIFY_API}/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`,
            {
                title: design.name,
                description: `Custom design by ${session.user.email}`,
                blueprint_id: 3, // T-shirt
                print_provider_id: 1,
                variants: [
                    { id: 17386, price: 2999, is_enabled: true }, // XS
                    { id: 17387, price: 2999, is_enabled: true }, // S
                    { id: 17388, price: 2999, is_enabled: true }, // M
                    { id: 17389, price: 2999, is_enabled: true }, // L
                    { id: 17390, price: 2999, is_enabled: true }, // XL
                    { id: 17391, price: 2999, is_enabled: true }, // 2XL
                ],
                print_areas: [
                    {
                        variant_ids: [17386, 17387, 17388, 17389, 17390, 17391],
                        placeholders: [
                            {
                                position: 'front',
                                images: [
                                    {
                                        id: imageId,
                                        x: 0.5,
                                        y: 0.5,
                                        scale: 1,
                                        angle: 0,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const productId = productRes.data.id;
        console.log(`✅ Product created, ID: ${productId}`);

        // Step 3: Publish
        await axios.post(
            `${PRINTIFY_API}/shops/${process.env.PRINTIFY_SHOP_ID}/products/${productId}/publish.json`,
            {
                title: true,
                description: true,
                images: true,
                variants: true,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
                },
            }
        );

        console.log(`✅ Product published`);

        // Step 4: Update design in DB
        await db.customDesign.update({
            where: { id: designId },
            data: {
                printifyProductId: productId,
                printifyProductUrl: `https://printify.com/products/${productId}`,
                status: 'live',
            },
        });

        // Log usage
        await db.designUsageLog.create({
            data: {
                userId: design.userId,
                action: 'export',
                tier: design.tier,
                metadata: {
                    printifyProductId: productId,
                    printifyImageId: imageId,
                },
            },
        });

        return NextResponse.json({
            success: true,
            productId,
            productUrl: `https://printify.com/products/${productId}`,
        });
    } catch (error) {
        console.error('❌ Printify export failed:', error);
        const errorMessage = (error as any)?.response?.data || error;
        return NextResponse.json(
            { error: `Failed to export to Printify: ${JSON.stringify(errorMessage)}` },
            { status: 500 }
        );
    }
}
