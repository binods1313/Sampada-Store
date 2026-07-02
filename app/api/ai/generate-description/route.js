import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { productName, category, price } = await request.json();
    
    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const prompt = `Write a compelling product description for an Indian heritage fashion brand called Sampada.

Product: ${productName}
Category: ${category || 'Clothing'}
Price: ${price ? '₹' + price : 'Premium'}

Write 2-3 sentences that:
- Highlights the premium quality and Indian heritage
- Appeals to modern consumers who value tradition and style
- Mentions the craftsmanship, comfort, and attention to detail
- Feels aspirational, luxury, and culturally rooted
- Uses evocative language that creates desire

Return ONLY the description text, no quotes, labels, or explanations. Keep it under 100 words.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        'X-Title': 'Sampada-Store AI Description Generator'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }
    
    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim();
    
    if (!description) {
      throw new Error('No description generated');
    }
    
    return NextResponse.json({ description });
  } catch (error) {
    console.error('Description generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
