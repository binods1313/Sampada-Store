import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import axios from 'axios';
import { authOptions } from '@/lib/nextAuthOptions';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify Ultra tier
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
        const { prompt, style = 'modern' } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        console.log(`🎨 Generating image for: ${prompt}`);

        let imageUrl: string;
        let generationMethod = '';

        // ========== NANO BANANA IMAGE GENERATION ==========
        if (process.env.NANO_BANANA_API_KEY) {
            try {
                generationMethod = 'Nano Banana (Stable Diffusion XL)';

                const enhancedPrompt = `Professional t-shirt design graphic. Style: ${style}. ${prompt}. 
        High quality, suitable for screen printing and embroidery on apparel. 
        Clean, bold design with good contrast. PNG format, transparent background preferred.
        Design dimensions: 800x1000px. Professional print-ready quality.`;

                const response = await axios.post(
                    'https://api.nanobana.com/api/v1/predictions',
                    {
                        model_key: 'stable-diffusion-xl', // SDXL for better quality
                        prompt: enhancedPrompt,
                        negative_prompt: 'blurry, low quality, watermark, text, writing',
                        num_inference_steps: 50,
                        guidance_scale: 7.5,
                        height: 1000,
                        width: 800,
                        num_outputs: 1,
                        scheduler: 'DPMSolverMultistepScheduler',
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': process.env.NANO_BANANA_API_KEY
                        }
                    }
                );

                if (response.data && response.data.output && response.data.output.length > 0) {
                    imageUrl = response.data.output[0];
                } else {
                    throw new Error('No image output from Nano Banana');
                }

            } catch (nanoError) {
                console.warn('⚠️ Nano Banana generation failed, falling back...', nanoError);
                // Fallback logic could go here
                throw nanoError;
            }
        } else {
            // Mock generation for dev if no API key
            console.warn('⚠️ No NANO_BANANA_API_KEY, using placeholder');
            imageUrl = 'https://placehold.co/800x1000/png?text=AI+Generated+Image';
            generationMethod = 'Placeholder';
        }

        // Log usage
        await db.designUsageLog.create({
            data: {
                userId: designUser.id,
                action: 'ai_generation',
                tier: 'ultra',
                metadata: {
                    type: 'image_generation',
                    prompt,
                    method: generationMethod
                },
            },
        });

        return NextResponse.json({ imageUrl });

    } catch (error) {
        console.error('❌ AI image generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
