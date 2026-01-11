// pages/api/sampada/voice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Generate response with Gemini
        const response = await generateSampadaResponse(message, context);

        res.status(200).json(response);

    } catch (error) {
        console.error('Sampada voice processing error:', error);
        res.status(500).json({
            response: "I'm having a little trouble right now. Could you try again?",
            error: error.message
        });
    }
}

// Generate conversational response using Gemini
async function generateSampadaResponse(message, context) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
You are Sampada, a friendly and helpful AI shopping assistant for an Indian premium t-shirt e-commerce store called "Sampada".

About the store:
- We sell premium quality t-shirts for men and women
- Price range: ₹299 to ₹1299
- Free shipping above ₹999
- 7-day easy returns
- 100% premium cotton, pre-shrunk and breathable

Your personality:
- Warm, friendly, and enthusiastic
- Use conversational Indian English
- Keep responses under 50 words (for voice)
- Include occasional emojis 😊
- Sound natural and human-like
- Be helpful and proactive

Current context:
- User is on page: ${context?.currentPage || '/'}

Based on the user's message, respond naturally and helpfully. If they want to see products, navigate them. If they have questions, answer them warmly.

IMPORTANT: Respond in this exact JSON format:
{
  "text": "your conversational response here",
  "action": {
    "type": "NAVIGATE|SEARCH|null",
    "url": "/path/if/navigating",
    "query": "search query if searching"
  }
}

Navigation URLs available:
- Men's T-shirts: /collections/mens-tshirts
- Women's T-shirts: /collections/womens-tshirts
- New Arrivals: /collections/new-arrivals
- Bestsellers: /collections/bestsellers
- Sale: /collections/sale
- Cart: /cart
- Home: /

User message: "${message}"
`;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        // Try to parse JSON response
        try {
            // Clean up response - remove markdown code blocks if present
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    response: parsed.text,
                    text: parsed.text,
                    action: parsed.action && parsed.action.type !== 'null' ? parsed.action : null
                };
            }
        } catch (parseError) {
            console.log('JSON parse failed, using raw text');
        }

        // Fallback: return raw text if JSON parsing fails
        return {
            response: responseText.substring(0, 200),
            text: responseText.substring(0, 200),
            action: null
        };

    } catch (error) {
        console.error('Gemini API error:', error);

        // Provide helpful fallback responses based on keywords
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("men") && lowerMessage.includes("shirt")) {
            return {
                response: "I'd love to show you our men's collection! Let me take you there. 👔",
                action: { type: "NAVIGATE", url: "/collections/mens-tshirts" }
            };
        }

        if (lowerMessage.includes("women") && lowerMessage.includes("shirt")) {
            return {
                response: "Our women's collection is amazing! Let me show you. 👚",
                action: { type: "NAVIGATE", url: "/collections/womens-tshirts" }
            };
        }

        if (lowerMessage.includes("sale") || lowerMessage.includes("discount")) {
            return {
                response: "Great timing! We have some awesome deals. Let me show you! 🎉",
                action: { type: "NAVIGATE", url: "/collections/sale" }
            };
        }

        if (lowerMessage.includes("new") || lowerMessage.includes("arrival")) {
            return {
                response: "Check out our latest arrivals - fresh styles just for you! ✨",
                action: { type: "NAVIGATE", url: "/collections/new-arrivals" }
            };
        }

        if (lowerMessage.includes("cart") || lowerMessage.includes("checkout")) {
            return {
                response: "Let me take you to your cart! 🛒",
                action: { type: "NAVIGATE", url: "/cart" }
            };
        }

        if (lowerMessage.includes("track") || lowerMessage.includes("order")) {
            return {
                response: "To track your order, please check your email for the tracking link, or visit your account page. 📦",
                action: null
            };
        }

        if (lowerMessage.includes("size") || lowerMessage.includes("fit")) {
            return {
                response: "Our sizing: S(36), M(38), L(40), XL(42), XXL(44). Most customers find their regular size fits perfectly! 👍",
                action: null
            };
        }

        if (lowerMessage.includes("shipping") || lowerMessage.includes("delivery")) {
            return {
                response: "We offer free shipping on orders above ₹999! Standard delivery takes 3-5 business days. 🚚",
                action: null
            };
        }

        if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
            return {
                response: "Easy returns within 7 days! Just keep the tags on and we'll handle the rest. 😊",
                action: null
            };
        }

        // Default greeting response
        return {
            response: "Hi there! I'm Sampada, your shopping assistant. I can help you find the perfect t-shirt, check our collections, or answer any questions. What would you like to explore? 😊",
            action: null
        };
    }
}
