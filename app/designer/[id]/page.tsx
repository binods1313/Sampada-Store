import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Canvas from '../../../components/designer/Canvas';

export default async function EditDesignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    return <Canvas designId={id} />;
}
