import NextAuth from 'next-auth';
import { authOptions } from '../../../lib/nextAuthOptions';

export { authOptions };
export default NextAuth(authOptions);