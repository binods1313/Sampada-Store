// pages/account.js - Improved handling for order history with adaptive image containers
import React, { useState, useEffect } from 'react';
import { useSession, getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { authenticatedClient, writeClient, urlFor } from '../lib/client';
import navStyles from '../components/NavbarStyles.module.css';
import { LoadingFallback, NetworkErrorFallback, EmptyStateFallback } from '../components';

// Simple Button component
const Button = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md font-medium transition ${className}`}
    style={{ border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f0f0f0', ...props.style }}
  >
    {children}
  </button>
);

// Smart Image Container Component
const ProductImage = ({ src, alt, productName }) => {
  return (
    <div className="order-product-image-container">      <Image
      src={src}
      alt={alt || 'Product Image'}
      width={800}
      height={800}
      style={{
        objectFit: 'contain',
        width: 'auto',
        height: 'auto',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChECCwkICRAFBAcQEAwABgcBBANTBQcUDgcJBQ0IEhMKFBcPGRESFBIFDhcWGBwYFBgRGA=="
    />      <style jsx>{`
        .order-product-image-container {
          width: 140px;
          height: 180px;
          flex-shrink: 0;
          margin-right: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
          background: white;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .order-product-image-container img {
          max-width: 100%;
          max-height: 100%;
          width: auto !important;
          height: auto !important;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

// Enhanced Order Item Component
const OrderItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <React.Fragment>
      <tr key={order._id} style={pageStyles.tableRow}>
        <td style={pageStyles.tableCell}>
          <span title={order._id} style={{ cursor: 'help', color: '#2563eb' }}>
            #{order._id.substring(order._id.length - 8)}
          </span>
        </td>
        <td style={pageStyles.tableCell}>
          {order.paidAt ? format(new Date(order.paidAt), 'PPP') : 'N/A'}
        </td>
        <td style={pageStyles.tableCell}>
          <span style={{
            ...(pageStyles.status.default),
            ...(pageStyles.status[order.status] || {})
          }}>
            {order.status || 'N/A'}
          </span>
        </td>
        <td style={pageStyles.tableCell}>${order.totalAmount?.toFixed(2) || '0.00'}</td>
        <td style={pageStyles.tableCell}>
          {order.orderItems?.length || 0}
          {order.orderItems?.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={pageStyles.detailToggle}
              aria-label={isExpanded ? "Hide order details" : "Show order details"}
            >
              {isExpanded ? '▼' : '►'}
            </button>
          )}
        </td>
      </tr>
      {isExpanded && order.orderItems?.length > 0 && (
        <tr>
          <td colSpan={5} style={pageStyles.detailsCell}>
            <div style={pageStyles.orderDetails}>
              <h4 style={pageStyles.detailsHeading}>Order Items</h4>
              <div style={pageStyles.itemsGrid}>                {order.orderItems.map((item) => {
                // Determine image source for display: variantImage first, then product's main image, then placeholder
                const itemImageSrc = item.variantImage?.asset?.url
                  ? urlFor(item.variantImage).width(800).url()
                  : item.product?.image?.[0]
                    ? urlFor(item.product.image[0]).width(800).url()
                    : '/asset/placeholder-image.jpg';

                return (
                  <div key={item._key} style={pageStyles.orderItemCard}>
                    <div className="order-product-image-container">                        <Image
                      src={itemImageSrc}
                      alt={item.product?.name || 'Product'}
                      width={800}
                      height={800}
                      style={{
                        objectFit: 'contain',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                      priority={false}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChECCwkICRAFBAcQEAwABgcBBANTBQcUDgcJBQ0IEhMKFBcPGRESFBIFDhcWGBwYFBgRGA=="
                    />
                      <style jsx>{`                          .order-product-image-container {
                            width: 140px;
                            height: 180px;
                            flex-shrink: 0;
                            margin-right: 1rem;
                            border-radius: 0.5rem;
                            overflow: hidden;
                            background: white;
                            border: 1px solid #e5e7eb;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                          }
                        `}</style>
                    </div>
                    <div style={pageStyles.itemInfo}>
                      <h5 style={pageStyles.itemName}>
                        {item.product?.name || 'Product'}
                      </h5>
                      {/* Display variant details if available */}
                      {(item.variantColorName || item.variantSize) && (
                        <p style={pageStyles.variantDetails}>
                          {item.variantColorName && (
                            <span style={pageStyles.variantBadge}>
                              {item.variantColorName}
                            </span>
                          )}
                          {item.variantSize && (
                            <span style={pageStyles.variantBadge}>
                              {item.variantSize}
                            </span>
                          )}
                        </p>
                      )}
                      <div style={pageStyles.itemPricing}>
                        <span style={pageStyles.itemQuantity}>
                          Qty: {item.quantity || 1}
                        </span>
                        {item.pricePerItem !== undefined && (
                          <span style={pageStyles.itemPrice}>
                            ${(item.pricePerItem * (item.quantity || 1)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

// --- Main Account Page Component ---
const AccountPage = ({ user, orders: initialOrders, error: serverError }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for orders with client-side refresh capability
  const [orders, setOrders] = useState(initialOrders || []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  // Fix: Use state to track active tab, initialize from router.query
  const [activeTab, setActiveTab] = useState('profile');

  // Update tab when router.query changes
  useEffect(() => {
    if (router.query.tab === 'orders') {
      setActiveTab('orders');
    } else {
      setActiveTab('profile');
    }
  }, [router.query.tab]);

  // Handle tab clicks with URL updates
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    router.push({
      pathname: '/account',
      query: tab === 'profile' ? {} : { tab }
    }, undefined, { shallow: true });
  };

  // Function to refresh orders from client-side with improved error handling
  const refreshOrders = async () => {
    if (!session?.user?.id) return;

    setIsRefreshing(true);
    setRefreshError(null);
    setRefreshAttempts(prev => prev + 1);

    try {
      const response = await fetch('/api/user/orders');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to load orders (Status: ${response.status})`);
      }

      const data = await response.json();

      // Update orders regardless - if no orders exist, we should still update the state
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error refreshing orders:', error);
      // Set a user-friendly error message instead of showing raw error
      setRefreshError("Unable to refresh your order history. Please try again later.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh if we come from success page or have no orders
  useEffect(() => {
    const fromSuccess = router.query.from === 'success';

    if (fromSuccess && session?.user?.id) {
      // Success page needs multiple attempts with longer delays
      const attemptIntervals = [2000, 5000, 10000]; // Progressive delays

      // Set up sequential retries
      attemptIntervals.forEach((delay, index) => {
        setTimeout(() => {
          console.log(`Auto-refreshing orders (attempt ${index + 1}/${attemptIntervals.length})`);
          refreshOrders();
        }, delay);
      });
    }
    else if ((activeTab === 'orders' && orders.length === 0) && session?.user?.id) {
      // Regular refresh for non-success visits
      const timer = setTimeout(() => {
        refreshOrders();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [router.query.from, activeTab, session?.user?.id, orders.length]); // Added orders.length to dependency array

  // Loading state
  if (status === 'loading') {
    return (
      <main style={pageStyles.mainContainer}>
        <LoadingFallback
          message="Loading Your Account..."
          size="medium"
          details="Fetching account details and order history"
        />
      </main>
    );
  }

  // Unauthenticated state
  if (!session) {
    return (
      <main style={{ ...pageStyles.mainContainer, textAlign: 'center', marginTop: '5rem' }}>
        <Head><title>Sign In Required</title></Head>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ marginBottom: '1.5rem' }}>Please sign in to view your account.</p>
        <Button onClick={() => signIn('github')} className={navStyles.btnSignin}>
          Sign In with GitHub
        </Button>
      </main>
    );
  }

  // User data not available state
  if (!user) {
    return (
      <main style={pageStyles.mainContainer}>
        <Head><title>Account Error</title></Head>
        <h1 style={pageStyles.mainHeading}>My Account</h1>
        <NetworkErrorFallback
          message="Unable to load your profile information. Please try again later."
          onRetry={() => window.location.reload()}
          showHomeButton={true}
        />
      </main>
    );
  }

  // --- Render Authenticated View ---
  return (
    <>
      <Head>
        <title>My Account | Sampada</title>
        <meta name="description" content="Manage your Sampada account. Track orders, update details, and enjoy prosperity-driven shopping experiences." />
      </Head>

      <main style={pageStyles.mainContainer}>
        <h1 style={pageStyles.mainHeading}>My Account</h1>

        {/* Tabs */}
        <div style={pageStyles.tabContainer}>
          <button
            style={{ ...pageStyles.tabButton, ...(activeTab === 'profile' ? pageStyles.tabActive : {}) }}
            onClick={() => handleTabClick('profile')}
            aria-current={activeTab === 'profile'}
          >
            Profile
          </button>
          <button
            style={{ ...pageStyles.tabButton, ...(activeTab === 'orders' ? pageStyles.tabActive : {}) }}
            onClick={() => handleTabClick('orders')}
            aria-current={activeTab === 'orders'}
          >
            Order History
          </button>
        </div>

        {/* Display Server-Side Fetch Error */}
        {serverError && (
          <NetworkErrorFallback
            message={serverError}
            onRetry={() => window.location.reload()}
            showHomeButton={true}
          />
        )}

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <section style={pageStyles.contentBox} aria-labelledby="profile-heading">
            <h2 id="profile-heading" style={pageStyles.sectionHeading}>Profile Information</h2>
            <div style={pageStyles.profileLayout}>
              {user.image && (<div style={pageStyles.profileImageContainer}><img src={user.image} alt={user.name || 'User'} style={pageStyles.profileImage} /></div>)}
              <div style={pageStyles.profileDetails}>
                <div style={pageStyles.detailItem}><p style={pageStyles.detailLabel}>Name</p><p style={pageStyles.detailValue}>{user.name || '(Not provided)'}</p></div>
                <div style={pageStyles.detailItem}><p style={pageStyles.detailLabel}>Email</p><p style={pageStyles.detailValue}>{user.email || 'Not provided'}</p></div>
                <div style={pageStyles.detailItem}><p style={pageStyles.detailLabel}>User ID</p><p style={pageStyles.detailValueSmall}>{user.id || 'Not available'}</p></div>
              </div>
            </div>
          </section>
        )}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <section style={pageStyles.contentBox} aria-labelledby="order-history-heading">
            <h2 id="order-history-heading" style={pageStyles.sectionHeading}>
              Order History
              {isRefreshing ? (
                <span style={pageStyles.refreshingText}> (refreshing...)</span>
              ) : (
                <button
                  onClick={refreshOrders}
                  style={pageStyles.refreshButton}
                  disabled={isRefreshing}
                  title="Refresh orders"
                >
                  ↻
                </button>
              )}
            </h2>

            {refreshError && <p style={pageStyles.errorText}>Error refreshing: {refreshError}</p>}

            {/* Coming from success message */}
            {router.query.from === 'success' && (
              <div style={pageStyles.successMessage}>
                <p>Thank you for your purchase! Your order is being processed.</p>
                {orders.length === 0 &&
                  <p style={pageStyles.waitingMessage}>
                    Please wait while we update your order history...
                    {isRefreshing && <span style={{ marginLeft: '5px' }}>refreshing...</span>}
                  </p>
                }
              </div>
            )}

            {orders && orders.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={pageStyles.orderTable}>
                  <thead>
                    <tr style={pageStyles.tableHeaderRow}>
                      <th style={pageStyles.tableHeader}>Order #</th>
                      <th style={pageStyles.tableHeader}>Date</th>
                      <th style={pageStyles.tableHeader}>Status</th>
                      <th style={pageStyles.tableHeader}>Total</th>
                      <th style={pageStyles.tableHeader}>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <OrderItem key={order._id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !serverError && !isRefreshing && router.query.from !== 'success' && (
                <EmptyStateFallback
                  title="No orders yet"
                  message="You haven't placed any orders yet. Start exploring our amazing products!"
                  actionLabel="Start Shopping"
                  onAction={() => router.push('/')}
                  icon="shopping"
                />
              )
            )}
          </section>
        )}
      </main>
    </>
  );
};

// --- Server-Side Props (With improved error handling) ---
export async function getServerSideProps(context) {
  const { getServerSession } = await import('next-auth/next');
  const { authOptions } = await import('./api/auth/[...nextauth]');
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.id) {
    return { redirect: { destination: '/', permanent: false } };
  }

  const userId = session.user.id;

  // Adjusted query to use user._ref correctly and explicitly fetch image array for product
  const ordersQuery = `*[
    _type == "order" && 
    (
      user._ref == $userRef || 
      userId == $userId ||    
      customerId == $userId   
    )
  ] | order(paidAt desc){ 
    _id, 
    paidAt, 
    totalAmount, 
    status, 
    orderItems[]{
      _key, 
      quantity, 
      pricePerItem, 
      variantColorName, 
      variantSize, 
      variantKey, 
      variantImage{
        asset->{
          _id, 
          url
        }
      },
      product->{ // Fetch base product details
        name, 
        price, 
        image[]{ // FIX: Explicitly fetch 'image' as an array of image objects
          asset->{
            _id,
            url
          }
        } 
      }
    } 
  }`;

  let orders = [];
  let error = null;

  try {
    let sanityUser = await authenticatedClient.fetch(`*[_type == "user" && providerId == $authUserId][0]`, { authUserId: userId });

    // If no user found in Sanity, create a minimal profile representation
    if (!sanityUser) {
      console.warn(`No Sanity user profile found for auth ID: ${userId}`);
      // We still need to try to fetch orders by other means
      orders = await authenticatedClient.fetch(ordersQuery, {
        userRef: `user.nonexistent`, // Will match no orders
        userId: userId,
        customerId: userId
      });
    } else {
      orders = await authenticatedClient.fetch(ordersQuery, {
        userRef: sanityUser._id,
        userId: userId,
        customerId: userId
      });
    }

    console.log(`Account page getServerSideProps: Fetched ${orders?.length || 0} orders.`);
  } catch (fetchError) {
    console.error("Account page getServerSideProps: Error fetching orders:", fetchError);
    error = "Failed to load order history. Please try again later.";
  }

  return {
    props: {
      user: session.user,
      orders: orders || [],
      error: error
    },
  };
}

// --- Styles (Updated for adaptive image containers) ---
const pageStyles = {
  accountLayout: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  mainContainer: { flexGrow: 1, maxWidth: '1000px', width: '90%', margin: '30px auto', padding: '0 15px' },
  mainHeading: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' },
  tabContainer: { display: 'flex', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0px' },
  tabButton: { padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderBottom: '3px solid transparent', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', color: '#6b7280', transition: 'all 0.2s ease', marginBottom: '-1px' },
  tabActive: { borderBottom: '3px solid #ef4444', color: '#111827', fontWeight: '600' },
  contentBox: { backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem' },
  sectionHeading: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937', display: 'flex', alignItems: 'center' },
  refreshButton: { marginLeft: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '50%', transition: 'all 0.2s ease' },
  refreshingText: { fontSize: '0.875rem', fontWeight: 'normal', fontStyle: 'italic', color: '#6b7280', marginLeft: '0.5rem' },
  profileLayout: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem', flexWrap: 'wrap' },
  profileImageContainer: { flexShrink: 0 },
  profileImage: { width: '6rem', height: '6rem', borderRadius: '50%', border: '2px solid #e5e7eb', objectFit: 'cover' },
  profileDetails: { flexGrow: 1 },
  detailItem: { marginBottom: '1rem' },
  detailLabel: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' },
  detailValue: { fontSize: '1rem', fontWeight: '500', color: '#1f2937' },
  detailValueSmall: { fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', wordBreak: 'break-all' },
  orderTable: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', tableLayout: 'auto' },
  tableHeaderRow: { backgroundColor: '#f9fafb' },
  tableHeader: { padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' },
  tableRow: { borderBottom: '1px solid #e5e7eb' },
  tableCell: { padding: '0.75rem 1rem', verticalAlign: 'middle', whiteSpace: 'nowrap' },
  status: {
    default: { fontWeight: '600', textTransform: 'capitalize', display: 'inline-block', padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '9999px', backgroundColor: '#f3f4f6', color: '#4b5563' },
    paid: { backgroundColor: '#dcfce7', color: '#166534' },
    shipped: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    delivered: { backgroundColor: '#e0e7ff', color: '#4338ca' },
    cancelled: { backgroundColor: '#fee2e2', color: '#991b1b' },
    refunded: { backgroundColor: '#feefc3', color: '#92400e' }
  },
  errorText: { color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '0.25rem', backgroundColor: '#fee2d2' },
  successMessage: { backgroundColor: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '0.25rem', marginBottom: '1.5rem' },
  waitingMessage: { fontSize: '0.875rem', fontStyle: 'italic', marginTop: '0.5rem' },
  detailToggle: { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '0.5rem', fontSize: '0.75rem', color: '#4b5563', padding: '0.25rem' },
  detailsCell: { padding: '0.5rem 1rem 1.5rem', backgroundColor: '#f9fafb' },
  orderDetails: { padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
  detailsHeading: { fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' },

  // IMPROVED GRID LAYOUT FOR ORDER ITEMS
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '1.25rem',
    marginTop: '0.5rem'
  },

  // REDESIGNED ORDER ITEM CARD WITH FLEXIBLE LAYOUT
  orderItemCard: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    padding: '1rem',
    gap: '1rem',
    minHeight: '140px',
    alignItems: 'flex-start',
    transition: 'all 0.2s ease'
  },

  // ITEM INFO SECTION - UPDATED TO WORK WITH ADAPTIVE IMAGES
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 0 // Allows text to wrap properly
  },

  itemName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
    lineHeight: '1.3',
    wordWrap: 'break-word'
  },

  // ENHANCED VARIANT DETAILS
  variantDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
    marginBottom: '0.75rem'
  },

  variantBadge: {
    fontSize: '0.75rem',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    fontWeight: '500'
  },

  // PRICING SECTION
  itemPricing: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },

  itemQuantity: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontWeight: '500'
  },

  itemPrice: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#059669'
  }
};

export default AccountPage;