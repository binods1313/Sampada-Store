// pages/admin/users.jsx
import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import { client } from '../../lib/client'
import EmptyState from '@/components/admin/EmptyState'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import { Search, Download, ChevronLeft, ChevronRight, X } from 'lucide-react'

const USERS_QUERY = `*[_type == "user"] | order(emailVerified desc) {
  _id,
  name,
  email,
  image,
  providerId,
  emailVerified,
  _createdAt
}`;

const ORDERS_BY_EMAIL_QUERY = (email) => `*[_type == "order" && customerEmail == $email] | order(_createdAt desc) {
  _id,
  customerName,
  customerEmail,
  totalAmount,
  status,
  _createdAt,
  paidAt
}`;

export async function getServerSideProps() {
  let users = [];
  try {
    users = await client.fetch(USERS_QUERY);
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  return {
    props: {
      users: users || [],
    },
  };
}

const safeValue = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') {
    return val.name || val.email || val.title || val.amount || val._ref || fallback;
  }
  return String(val);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

export default function UsersPage({ users }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const itemsPerPage = 20;

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setUserOrders([]);
    setLoadingOrders(true);
    try {
      const orders = await client.fetch(ORDERS_BY_EMAIL_QUERY(user.email));
      setUserOrders(orders || []);
    } catch {
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Provider ID', 'Joined', 'Orders Count'];
    const rows = filteredUsers.map((u) => [
      u.name || '',
      u.email || '',
      u.providerId || '',
      formatDate(u.emailVerified || u._createdAt),
      '—',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users', current: true },
  ];

  return (
    <AdminLayout title="Users">
      <Head>
        <title>Users — Sampada Admin</title>
      </Head>

      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--admin-text-primary)',
                margin: 0,
              }}
            >
              Users
            </h1>
            <span
              style={{
                background: 'rgba(201,168,76,0.15)',
                color: '#C9A84C',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '12px',
                padding: '2px 10px',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}
            >
              {users.length}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-tertiary)',
                }}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '8px 12px 8px 32px',
                  border: '1px solid var(--admin-border-subtle)',
                  borderRadius: 'var(--admin-radius-md)',
                  fontSize: '0.875rem',
                  background: 'var(--admin-surface-1)',
                  color: 'var(--admin-text-primary)',
                  outline: 'none',
                  width: '260px',
                }}
              />
            </div>

            {/* Export */}
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'transparent',
                border: '1px solid var(--admin-border-subtle)',
                borderRadius: 'var(--admin-radius-md)',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--admin-text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {[
            { label: 'Total Users', value: users.length, color: '#C9A84C' },
            {
              label: 'With Email',
              value: users.filter((u) => u.email).length,
              color: '#4ade80',
            },
            {
              label: 'Total Orders',
              value: '—',
              color: '#60a5fa',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'var(--admin-surface-1)',
                border: '1px solid var(--admin-border-subtle)',
                borderRadius: 'var(--admin-radius-lg)',
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: stat.color,
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--admin-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          style={{
            background: 'var(--admin-surface-1)',
            border: '1px solid var(--admin-border-subtle)',
            borderRadius: 'var(--admin-radius-lg)',
            overflow: 'hidden',
          }}
        >
          {paginatedUsers.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <EmptyState
                title="No users found"
                description={
                  search
                    ? 'Try a different search term.'
                    : 'No user accounts exist yet.'
                }
              />
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: 'var(--admin-surface-2)',
                        borderBottom:
                          '1px solid var(--admin-border-subtle)',
                      }}
                    >
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: 'var(--admin-text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Avatar
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: 'var(--admin-text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: 'var(--admin-text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: 'var(--admin-text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Provider
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: 'var(--admin-text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Joined
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: 'var(--admin-text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user, i) => (
                      <tr
                        key={user._id}
                        onClick={() => handleUserClick(user)}
                        style={{
                          cursor: 'pointer',
                          borderBottom: `1px solid var(--admin-border-subtle)`,
                          background:
                            selectedUser?._id === user._id
                              ? 'var(--admin-bg-selected)'
                              : i % 2 === 0
                              ? 'transparent'
                              : 'var(--admin-surface-1)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedUser?._id !== user._id) {
                            e.currentTarget.style.background =
                              'var(--admin-bg-hover)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedUser?._id !== user._id) {
                            e.currentTarget.style.background =
                              i % 2 === 0
                                ? 'transparent'
                                : 'var(--admin-surface-1)';
                          }
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || 'User'}
                              width={32}
                              height={32}
                              style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background:
                                  'linear-gradient(135deg, var(--admin-red), var(--admin-gold))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'white',
                              }}
                            >
                              {(user.name || user.email || '?')[0].toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            color: 'var(--admin-text-primary)',
                            fontWeight: '600',
                          }}
                        >
                          {user.name || '—'}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            color: 'var(--admin-text-secondary)',
                          }}
                        >
                          {user.email || '—'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              color: 'var(--admin-text-tertiary)',
                              background:
                                'rgba(201,168,76,0.1)',
                              border: '1px solid rgba(201,168,76,0.2)',
                              borderRadius: '6px',
                              padding: '2px 8px',
                            }}
                          >
                            {user.providerId ? 'OAuth' : '—'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            color: 'var(--admin-text-tertiary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          {formatDate(user.emailVerified || user._createdAt)}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            color: 'var(--admin-text-tertiary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Click to view
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderTop: '1px solid var(--admin-border-subtle)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--admin-text-tertiary)',
                    }}
                  >
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}{' '}
                    of {filteredUsers.length}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid var(--admin-border-subtle)',
                        borderRadius: 'var(--admin-radius-sm)',
                        background: 'transparent',
                        color:
                          currentPage === 1
                            ? 'var(--admin-text-tertiary)'
                            : 'var(--admin-text-primary)',
                        cursor:
                          currentPage === 1
                            ? 'not-allowed'
                            : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1,
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            padding: '6px 10px',
                            border:
                              currentPage === page
                                ? '1px solid var(--admin-gold)'
                                : '1px solid var(--admin-border-subtle)',
                            borderRadius: 'var(--admin-radius-sm)',
                            background:
                              currentPage === page
                                ? 'rgba(201,168,76,0.15)'
                                : 'transparent',
                            color:
                              currentPage === page
                                ? 'var(--admin-gold)'
                                : 'var(--admin-text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight:
                              currentPage === page ? '700' : '400',
                            cursor: 'pointer',
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid var(--admin-border-subtle)',
                        borderRadius: 'var(--admin-radius-sm)',
                        background: 'transparent',
                        color:
                          currentPage === totalPages
                            ? 'var(--admin-text-tertiary)'
                            : 'var(--admin-text-primary)',
                        cursor:
                          currentPage === totalPages
                            ? 'not-allowed'
                            : 'pointer',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                      }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Detail Slide-out Panel */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
          }}
        >
          <div
            onClick={() => setSelectedUser(null)}
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(2px)',
            }}
          />
          <div
            style={{
              width: '420px',
              maxWidth: '90vw',
              background: 'var(--admin-surface-1)',
              borderLeft: '1px solid var(--admin-border-subtle)',
              height: '100vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid var(--admin-border-subtle)',
              }}
            >
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: 'var(--admin-text-primary)',
                  margin: 0,
                }}
              >
                User Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--admin-text-tertiary)',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* User Info */}
            <div style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                {selectedUser.image ? (
                  <Image
                    src={selectedUser.image}
                    alt={selectedUser.name || 'User'}
                    width={56}
                    height={56}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, var(--admin-red), var(--admin-gold))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {(selectedUser.name || selectedUser.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontWeight: '700',
                      color: 'var(--admin-text-primary)',
                      marginBottom: '2px',
                    }}
                  >
                    {selectedUser.name || '—'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-secondary)',
                    }}
                  >
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                {[
                  { label: 'Provider', value: selectedUser.providerId ? 'OAuth' : '—' },
                  { label: 'Joined', value: formatDate(selectedUser.emailVerified || selectedUser._createdAt) },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: 'var(--admin-surface-2)',
                      border: '1px solid var(--admin-border-subtle)',
                      borderRadius: 'var(--admin-radius-md)',
                      padding: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--admin-text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'var(--admin-text-primary)',
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Orders Section */}
              <h3
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: 'var(--admin-text-primary)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Order History
              </h3>
              {loadingOrders ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--admin-text-tertiary)',
                    fontSize: '0.875rem',
                  }}
                >
                  Loading orders...
                </div>
              ) : userOrders.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--admin-text-tertiary)',
                    fontSize: '0.875rem',
                    background: 'var(--admin-surface-2)',
                    borderRadius: 'var(--admin-radius-md)',
                    border: '1px dashed var(--admin-border-subtle)',
                  }}
                >
                  No orders found for this user.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {userOrders.map((order) => (
                    <div
                      key={order._id}
                      style={{
                        background: 'var(--admin-surface-2)',
                        border: '1px solid var(--admin-border-subtle)',
                        borderRadius: 'var(--admin-radius-md)',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'var(--admin-text-primary)',
                            marginBottom: '2px',
                          }}
                        >
                          {order._id.slice(0, 12)}...
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--admin-text-tertiary)',
                          }}
                        >
                          {formatDate(order.paidAt || order._createdAt)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: 'var(--admin-text-primary)',
                          }}
                        >
                          ₹{safeValue(order.totalAmount, '0')}
                        </div>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: '600',
                            color:
                              order.status === 'paid' ? '#4ade80' : '#C9A84C',
                            background:
                              order.status === 'paid'
                                ? 'rgba(74,222,128,0.1)'
                                : 'rgba(201,168,76,0.1)',
                            borderRadius: '6px',
                            padding: '2px 6px',
                          }}
                        >
                          {safeValue(order.status, 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}