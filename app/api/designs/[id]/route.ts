import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const design = await db.customDesign.findUnique({
            where: { id },
        });

        if (!design) {
            return NextResponse.json({ error: 'Design not found' }, { status: 404 });
        }

        // Check ownership
        const designUser = await db.designUser.findUnique({
            where: { id: design.userId },
        });

        if (!designUser || designUser.email !== session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json(design);
    } catch (error) {
        console.error('GET /api/designs/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch design' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const design = await db.customDesign.findUnique({
            where: { id },
        });

        if (!design) {
            return NextResponse.json({ error: 'Design not found' }, { status: 404 });
        }

        // Check ownership
        const designUser = await db.designUser.findUnique({
            where: { id: design.userId },
        });

        if (!designUser || designUser.email !== session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const updated = await db.customDesign.update({
            where: { id },
            data: {
                ...body,
                version: { increment: 1 },
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('PATCH /api/designs/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to update design' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const design = await db.customDesign.findUnique({
            where: { id },
        });

        if (!design) {
            return NextResponse.json({ error: 'Design not found' }, { status: 404 });
        }

        // Check ownership
        const designUser = await db.designUser.findUnique({
            where: { id: design.userId },
        });

        if (!designUser || designUser.email !== session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await db.customDesign.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/designs/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to delete design' },
            { status: 500 }
        );
    }
}
