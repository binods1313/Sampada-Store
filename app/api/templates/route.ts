import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const where: any = { isPublic: true };
        if (category && category !== 'all') {
            where.category = category.toLowerCase();
        }

        const templates = await db.designTemplate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                category: true,
                thumbnail: true,
            },
        });

        return NextResponse.json({ templates });
    } catch (error) {
        console.error('GET /api/templates error:', error);
        return NextResponse.json({ templates: [] });
    }
}
