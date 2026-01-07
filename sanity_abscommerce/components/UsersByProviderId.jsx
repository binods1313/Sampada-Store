//sanity_abscommerce/components/UsersByProviderid.jsx
import React from 'react';
import { useClient } from 'sanity';
import { Card, Stack, Text } from '@sanity/ui';

export default function UsersByProviderId() {
  // Fixed: Added apiVersion to useClient()
  const client = useClient({apiVersion: '2024-05-18'})
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    client.fetch('*[_type == "user"]{_id, name, email, providerId}')
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      })
  }, [client])
  
  if (loading) return <Text>Loading users...</Text>
  
  return (
    <Card padding={4}>
      <Stack space={3}>
        {users.length === 0 && <Text>No users found</Text>}
        {users.map((user) => (
          <Card key={user._id} padding={3} border>
            <Text weight="bold">{user.name || 'Unnamed User'}</Text>
            <Text size={1}>Provider ID: {user.providerId || 'Not set'}</Text>
            <Text size={1}>Email: {user.email}</Text>
          </Card>
        ))}
      </Stack>
    </Card>
  )
}