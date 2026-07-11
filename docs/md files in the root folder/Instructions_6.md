╔══════════════════════════════════════════════════════════════════╗
║  SAMPADA CREATIVE STUDIO — IMAGE GENERATION DEBUG & FIX          ║
║  File: pages/creative-studio.jsx + API routes                    ║
╚══════════════════════════════════════════════════════════════════╝

WHAT I'M SEEING:
  1. Typing a prompt and clicking "+ Generate" shows "processed"
     or a loading state but no image ever appears.
  2. The model dropdown (currently showing "Imagen 3") is not
     working — clicking it does nothing.
  3. The aspect ratio dropdown (the small square icon next to
     the model selector) is also not working.
  4. I recently added XAI_API_KEY (Grok) to the environment.
     The system may still be wired to a different model/provider.

DO THIS AUDIT FIRST — report findings before fixing anything:
══════════════════════════════════════════════════════════════════

STEP 1 — Trace the Generate button's onClick handler:
  In pages/creative-studio.jsx (or components/CreativeStudio/
  AIImageStudio.jsx, wherever the generate button lives):
  
  a) What function does the "+ Generate" button call?
  b) What API route does that function POST to?
     (e.g. /api/creative/grok-imagine or /api/ai/generate-image
      or /api/creative/firefly-generate)
  c) Show me the full fetch/axios call including headers,
     body payload, and how the response is handled.
  d) What happens with the response? Where is the returned
     image URL or base64 stored? Which state variable?
  e) Where in the JSX is that state variable rendered?
     Show me the <img> or image display element.

STEP 2 — Check the API route that handles image generation:
  Open whichever API file the generate button calls and report:
  
  a) Which AI provider is it calling?
     (Grok/xAI, Imagen, Firefly, DALL-E, or other)
  b) Which environment variable does it use for the API key?
     (e.g. XAI_API_KEY, GOOGLE_API_KEY, ADOBE_API_KEY)
  c) Is that env variable actually set in .env or .env.local?
     Log process.env.XAI_API_KEY?.slice(0,6) and report what
     it shows (first 6 chars only, never the full key).
  d) What does the full API response look like?
     Add a console.log of the raw API response BEFORE any
     processing and show me the terminal output when you
     click Generate with any test prompt.
  e) Is there any error being swallowed silently?
     Check every catch block — are errors being logged or
     are they silently setting a generic "error" state?

STEP 3 — Check the dropdowns:
  a) Find the model selector dropdown component. What onClick
     or onChange handler does it have? Show the code.
  b) Find the aspect ratio dropdown. Same question.
  c) Are these controlled components (value + onChange) or
     uncontrolled? If controlled, what state variable drives
     the selected value?
  d) Is there any z-index or pointer-events CSS that might
     be blocking the dropdown from receiving clicks?
     Check if any parent container has overflow:hidden or
     a higher z-index overlay sitting on top.

Report all findings before touching any code.

══════════════════════════════════════════════════════════════════
FIXES TO APPLY (after audit confirms the issues)
══════════════════════════════════════════════════════════════════

FIX 1 — Wire image generation to Grok (xAI) API
──────────────────────────────────────────────────

The correct Grok image generation endpoint is:
  POST https://api.x.ai/v1/images/generations

Request format:
  {
    "model": "grok-2-image",        // or "grok-2-image-1212"
    "prompt": "<user's prompt>",
    "n": 1,
    "response_format": "url"        // or "b64_json"
  }

Headers:
  Authorization: Bearer ${process.env.XAI_API_KEY}
  Content-Type: application/json

Expected response shape:
  {
    "data": [
      { "url": "https://..." }      // if response_format: "url"
      // OR
      { "b64_json": "..." }         // if response_format: "b64_json"
    ]
  }

In the API route file (likely pages/api/creative/grok-imagine.js):
  - Replace whatever provider call is there with the above.
  - Extract the image URL from response.data[0].url
  - Return it as JSON: { imageUrl: "..." }
  - Wrap in try/catch and return meaningful errors:
    catch(err) {
      console.error('Grok image generation error:', err.message);
      return res.status(500).json({ 
        error: err.message,
        details: err.response?.data || null
      });
    }

FIX 2 — Fix the frontend to display the returned image
────────────────────────────────────────────────────────

In the generate handler function in creative-studio.jsx
(or AIImageStudio.jsx):

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);
    
    try {
      const res = await fetch('/api/creative/grok-imagine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          model: selectedModel,     // from dropdown state
          aspectRatio: aspectRatio  // from dropdown state
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        throw new Error('No image returned from API');
      }
    } catch (err) {
      console.error('Generate error:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

In the JSX, make sure the image renders:

  {isGenerating && (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <p style={{ color: '#C9A84C' }}>✦ Generating your image...</p>
    </div>
  )}
  
  {error && (
    <div style={{ color: '#ff6b6b', padding: '16px',
                  background: 'rgba(255,0,0,0.1)',
                  borderRadius: '8px', margin: '16px 0' }}>
      ✗ {error}
    </div>
  )}
  
  {generatedImage && !isGenerating && (
    <div style={{ marginTop: '24px' }}>
      <img
        src={generatedImage}
        alt="Generated by Sampada AI"
        style={{
          width: '100%',
          maxWidth: '768px',
          borderRadius: '16px',
          display: 'block',
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
      />
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        
          href={generatedImage}
          download="sampada-generated.png"
          style={{
            color: '#C9A84C',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          ↓ Download Image
        </a>
      </div>
    </div>
  )}

FIX 3 — Fix the model dropdown
────────────────────────────────

The dropdown currently shows "Imagen 3" but that's likely a
display label leftover from a previous provider. Update the
model options to reflect what Grok actually supports:

  const MODEL_OPTIONS = [
    { label: 'Grok 2 Image',      value: 'grok-2-image' },
    { label: 'Grok 2 Image HD',   value: 'grok-2-image-1212' },
  ];

  const [selectedModel, setSelectedModel] = 
    useState('grok-2-image');

Make the dropdown a controlled component:
  <select
    value={selectedModel}
    onChange={(e) => setSelectedModel(e.target.value)}
    style={{
      background: '#2a1a0e',
      color: '#C9A84C',
      border: '1px solid rgba(201,168,76,0.3)',
      borderRadius: '8px',
      padding: '8px 12px',
      cursor: 'pointer'
    }}
  >
    {MODEL_OPTIONS.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>

FIX 4 — Fix the aspect ratio dropdown
───────────────────────────────────────

  const ASPECT_OPTIONS = [
    { label: '1:1 Square',    value: '1:1' },
    { label: '16:9 Wide',     value: '16:9' },
    { label: '9:16 Portrait', value: '9:16' },
    { label: '4:3 Standard',  value: '4:3' },
  ];

  const [aspectRatio, setAspectRatio] = useState('1:1');

Note: Grok's image API may not support aspect ratio as a
direct parameter. If it doesn't, encode the desired ratio
into the prompt automatically:

  const promptWithRatio = aspectRatio !== '1:1'
    ? `${prompt}, ${aspectRatio} aspect ratio composition`
    : prompt;

  // Use promptWithRatio in the API call body, not raw prompt

FIX 5 — Fix dropdown z-index / click blocking
───────────────────────────────────────────────

If the dropdowns still don't respond to clicks after the above
fixes, the problem is likely a CSS overlay. Check for:

  1. Any <div> with position:absolute or position:fixed,
     z-index > 0, covering the top bar area
  2. The spotlight effect or any canvas element that might
     be capturing pointer events in this area
  3. Any parent with pointer-events: none accidentally
     cascading down

Fix: add explicitly to the dropdown wrapper div:
  position: relative;
  z-index: 100;
  pointer-events: auto;

══════════════════════════════════════════════════════════════════
ENVIRONMENT CHECK
══════════════════════════════════════════════════════════════════

Confirm these are set in .env.local (not just .env):
  XAI_API_KEY=xai-...

Run this check in the API route during development only:
  if (!process.env.XAI_API_KEY) {
    return res.status(500).json({
      error: 'XAI_API_KEY is not configured'
    });
  }

This way the frontend shows a clear error instead of silently
processing forever.

══════════════════════════════════════════════════════════════════
ALSO CHECK — Video Studio (same API key)
══════════════════════════════════════════════════════════════════

Since you added XAI_API_KEY for both image and video:
  - Open pages/api/creative/grok-video.js
  - Confirm it also reads from process.env.XAI_API_KEY
  - If it was previously using a different variable name
    (e.g. GROK_API_KEY or XAI_SECRET), update it to
    XAI_API_KEY to match the new env variable you added.

══════════════════════════════════════════════════════════════════
✅ VERIFICATION
══════════════════════════════════════════════════════════════════

1. Show me the terminal console.log of the raw Grok API
   response for a test prompt (e.g. "a red rose on a table")
2. Show me the network tab response from /api/creative/grok-imagine
   with status 200 and a real imageUrl in the JSON
3. Screenshot of the generated image actually rendering on screen
4. Confirm both dropdowns open and change the selected value
5. Confirm the error state renders properly when API fails
   (test by temporarily using a bad API key — show the error
   message on screen, not a silent hang)
6. Run npm run build — zero errors