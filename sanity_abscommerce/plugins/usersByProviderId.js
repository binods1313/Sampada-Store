import { definePlugin } from 'sanity';
import UsersByProviderId from '../components/UsersByProviderId.jsx'; // Correct path

export const usersByProviderIdTool = definePlugin({
  name: 'users-by-provider-id',
  tools: [
    {
      title: 'Users by Provider ID', // Navbar title
      name: 'users-by-provider-id', // URL slug
      component: UsersByProviderId // Our component
    }
  ]
})