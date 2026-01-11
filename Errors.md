Terminal logs -
PS E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce> npm run dev

> abscommerce@0.1.0 dev
> next dev

   ▲ Next.js 15.2.8
   - Local:        http://localhost:3000   
   - Network:      http://192.168.56.1:3000
   - Environments: .env.local, .env        
   - Experiments (use with caution):       
     ✓ scrollRestoration

 ✓ Starting...
[Browserslist] Could not parse E:\Agentic AIs\Groq_ChainMorph\abscommerce\package.json. Ignoring it.
 ✓ Ready in 44s
 ○ Compiling /product/[slug] ...
 ✓ Compiled /product/[slug] in 894s (1330 modules)
React expects the `children` prop of <title> tags to be a string, number, bigint, or object 
with a novel `toString` method but found an Array with length 2 instead. Browsers treat all 
child Nodes of <title> tags as Text content and React expects to be able to convert `children` of <title> tags to a single string value which is why Arrays of length greater than 1 are not supported. When using JSX it can be common to combine text nodes and value nodes. For example: <title>hello {nameOfUser}</title>. While not immediately apparent, `children` in this case is an Array with length 2. If your `children` prop is using this form try rewriting it using a template string: <title>{`hello ${nameOfUser}`}</title>.
 GET /product/enhanced-bohemian-inspired-tunic 200 in 1292789ms
React expects the `children` prop of <title> tags to be a string, number, bigint, or object 
with a novel `toString` method but found an Array with length 2 instead. Browsers treat all 
child Nodes of <title> tags as Text content and React expects to be able to convert `children` of <title> tags to a single string value which is why Arrays of length greater than 1 are not supported. When using JSX it can be common to combine text nodes and value nodes. For example: <title>hello {nameOfUser}</title>. While not immediately apparent, `children` in this case is an Array with length 2. If your `children` prop is using this form try rewriting it using a template string: <title>{`hello ${nameOfUser}`}</title>.
 GET /product/enhanced-bohemian-inspired-tunic 200 in 650ms
 ○ Compiling /api/auth/[...nextauth] ...
 ✓ Compiled /api/auth/[...nextauth] in 13.4s (1350 modules)
[next-auth][warn][DEBUG_ENABLED] 
https://next-auth.js.org/warnings#debug_enabled
 POST /api/auth/_log 200 in 46892ms
 GET /api/auth/session 200 in 617ms
 ○ Compiling /api/search/visual ...
 ✓ Compiled /api/search/visual in 13.3s (280 modules)
Failed to load color libraries TypeError: colorNameList.reduce is not a function
    at initColorService (services\visualSearchService.js:19:26)
    at async analyzeImage (services\visualSearchService.js:28:8)
    at async visualSearch (controllers\visualSearchController.js:24:25)
    at async handler (pages\api\search\visual.js:13:8)
  17 |
  18 |         nearestColor = nc.from(
> 19 |             colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {})
     |                          ^
  20 |         );
  21 |     } catch (e) {
  22 |         console.warn("Failed to load color libraries", e);
Visual analysis error: [Error: The file at ./config/google-vision-key.json does not exist, or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
 POST /api/search/visual 500 in 166247ms
[Error: The file at ./config/google-vision-key.json does not exist, or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
 ⨯ unhandledRejection: [Error: The file at ./config/google-vision-key.json does not exist, or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
 ⨯ unhandledRejection:  [Error: The file at ./config/google-vision-key.json does not exist, 
or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
Failed to load color libraries TypeError: colorNameList.reduce is not a function
    at initColorService (services\visualSearchService.js:19:26)
    at async analyzeImage (services\visualSearchService.js:28:8)
    at async visualSearch (controllers\visualSearchController.js:24:25)
    at async handler (pages\api\search\visual.js:13:8)
  17 |
  18 |         nearestColor = nc.from(
> 19 |             colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {})
     |                          ^
  20 |         );
  21 |     } catch (e) {
  22 |         console.warn("Failed to load color libraries", e);
Visual analysis error: [Error: The file at ./config/google-vision-key.json does not exist, or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
 POST /api/search/visual 500 in 83ms
[Error: The file at ./config/google-vision-key.json does not exist, or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
 ⨯ unhandledRejection: [Error: The file at ./config/google-vision-key.json does not exist, or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
 ⨯ unhandledRejection:  [Error: The file at ./config/google-vision-key.json does not exist, 
or it is not a file. ENOENT: no such file or directory, lstat 'E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\config\google-vision-key.json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'lstat',
  path: 'E:\\Agentic AIs\\Groq_ChainMorph\\abscommerce\\abscommerce\\config\\google-vision-key.json'
}
 ○ Compiling /api/auth/[...nextauth] ...
 ✓ Compiled /api/auth/[...nextauth] in 1089ms (286 modules)
 GET /api/auth/session 200 in 1200ms
 GET /api/auth/session 200 in 389ms

Console logs -
E:\src\client\compon…loader-client.ts:86 
 [HMR] Invalid message: {"action":"isrManifest","data":{"/product/enhanced-bohemian-inspired-tunic":true}}
TypeError: Cannot read properties of undefined (reading 'components')
    at handleStaticIndicator (E:\src\client\compon…er-client.ts:277:42)
    at processMessage (E:\src\client\compon…der-client.ts:304:7)
    at eval (E:\src\client\compon…ader-client.ts:84:7)
    at WebSocket.handleMessage (E:\src\client\compon…s\websocket.ts:67:9)
41
Tracking Prevention blocked access to storage for <URL>.
E:\src\shared\lib\utils\warn-once.ts:6 
 Image with src "https://cdn.sanity.io/images/7lh35oho/production/483ad54…-374x600.png?w=600" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
Read more: https://nextjs.org/docs/api-reference/next/image#priority
﻿

and Failed to load resource: the server responded with a status of 500 (Internal Server Error)
:3000/api/search/visual:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)