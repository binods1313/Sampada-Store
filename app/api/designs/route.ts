import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { storage } from '@/lib/gcs';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/lib/nextAuthOptions';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get or create designer user
        let designUser = await db.designUser.findUnique({
            where: { email: session.user.email || '' },
        });

        if (!designUser) {
            return NextResponse.json({ designs: [] }, { status: 200 }); // No designs yet
        }

        const designs = await db.customDesign.findMany({
            where: { userId: designUser.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                thumbnail: true,
                status: true,
                tier: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ designs });
    } catch (error: any) {
        console.error('GET /api/designs error:', error);

        // If database is not configured or not reachable, return empty array gracefully
        if (
            error?.code === 'P1001' ||
            error?.name === 'PrismaClientInitializationError' ||
            error?.message?.includes('connect') ||
            error?.message?.includes('database server')
        ) {
            console.warn('Database not connected - returning empty designs');
            return NextResponse.json(
                { designs: [], dbConnected: false },
                { status: 200 } // Changed from unclear 500 to clean 200 with flag
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch designs', details: error?.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, canvasData, thumbnail } = body;

        // Get or create designer user
        let designUser = await db.designUser.findUnique({
            where: { email: session.user.email },
        });

        if (!designUser) {
            designUser = await db.designUser.create({
                data: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                },
            });
        }

        // Check design limit
        if (
            designUser.designLimit &&
            designUser.designsCreatedThisMonth >= designUser.designLimit
        ) {
            return NextResponse.json(
                { error: 'Design limit reached. Upgrade your plan.' },
                { status: 403 }
            );
        }

        // Upload thumbnail to Cloud Storage
        let thumbnailUrl: string | null = null;
        if (thumbnail) {
            try {
                const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);
                const fileName = `designs/${designUser.id}/${uuidv4()}.png`;
                const file = bucket.file(fileName);

                const base64Data = thumbnail.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');

                await file.save(buffer, { contentType: 'image/png' });
                thumbnailUrl = `gs://${process.env.GCS_BUCKET_NAME}/${fileName}`;
            } catch (error) {
                console.error('Thumbnail upload failed:', error);
                // Continue without thumbnail
            }
        }

        // Create design
        const design = await db.customDesign.create({
            data: {
                userId: designUser.id,
                name: name || `Design ${new Date().toLocaleDateString()}`,
                canvasData,
                thumbnail: thumbnailUrl,
                tier: designUser.designerTier,
            },
        });

        // Increment counter
        await db.designUser.update({
            where: { id: designUser.id },
            data: { designsCreatedThisMonth: { increment: 1 } },
        });

        // Log usage
        await db.designUsageLog.create({
            data: {
                userId: designUser.id,
                action: 'design_created',
                tier: designUser.designerTier,
            },
        });

        return NextResponse.json(design, { status: 201 });
    } catch (error) {
        console.error('POST /api/designs error:', error);
        return NextResponse.json(
            { error: 'Failed to create design' },
            { status: 500 }
        );
    }
}
