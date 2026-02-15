import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authOptions } from '@/lib/nextAuthOptions';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get designer user and verify Ultra tier
        const designUser = await db.designUser.findUnique({
            where: { email: session.user.email },
        });

        if (!designUser || designUser.designerTier !== 'ultra') {
            return NextResponse.json(
                { error: 'This feature is only available for Ultra subscribers' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        console.log(`🤖 Generating design suggestions for: ${prompt}`);

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const message = `You are a professional t-shirt designer. Based on this design brief: "${prompt}"

Suggest 3 creative design concepts. For each concept, provide:
1. Concept name
2. Description (2-3 sentences)
3. Color palette (3-4 hex colors)
4. Layout suggestions (where to place elements)
5. Recommended typography style

Format your response as a JSON array with objects containing: name, description, colors, layout, typography.`;

        const result = await model.generateContent(message);
        const suggestions = result.response.text();

        // Parse JSON response
        let parsedSuggestions;
        try {
            const jsonMatch = suggestions.match(/\[[\s\S]*\]/);
            parsedSuggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : suggestions;
        } catch {
            parsedSuggestions = suggestions;
        }

        // Log usage
        await db.designUsageLog.create({
            data: {
                userId: designUser.id,
                action: 'ai_generation',
                tier: 'ultra',
                metadata: { type: 'design_suggestion', prompt },
            },
        });

        console.log(`✅ Generated ${Array.isArray(parsedSuggestions) ? parsedSuggestions.length : 1} suggestions`);

        return NextResponse.json({ suggestions: parsedSuggestions });
    } catch (error) {
        console.error('❌ AI suggestion error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestions' },
            { status: 500 }
        );
    }
}
