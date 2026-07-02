PS E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce> npm run dev

> abscommerce@0.1.0 dev
> next dev

   ▲ Next.js 15.5.2
   - Local:        http://localhost:3000
   - Network:      http://192.168.56.1:3000
   - Environments: .env.local, .env
   - Experiments (use with caution):
     ✓ scrollRestoration

 ✓ Starting...
 ✓ Ready in 20.5s
 ○ Compiling / ...
 ✓ Compiled / in 69.4s (2970 modules)
✅ Data fetched successfully in 601ms
📦 Products: 12
⭐ Featured: 0
📂 Categories: 15
ReferenceError: auroraStyles is not defined
    at Home (pages\index.js:469:29)
  467 |
  468 |         {/* Enhanced Product Showcase */}
> 469 |         <section className={auroraStyles['aurora-feature-section']}>
      |                             ^
  470 |           <h2>Experience Next-Gen Audio with <span className={auroraStyles.highlight}>Aurora Sky Pulse™</span></h2>
  471 |
  472 |           <p>Immerse yourself in revolutionary 3D spatial audio that transforms your reality. The <strong>Aurora Sky Pulse™</strong> represents a quantum leap in audio technology, featuring AI-powered sound adaptation and neural processing.</p>
 ⨯ ReferenceError: auroraStyles is not defined
    at Home (pages\index.js:469:29)
  467 |
  468 |         {/* Enhanced Product Showcase */}
> 469 |         <section className={auroraStyles['aurora-feature-section']}>
      |                             ^
  470 |           <h2>Experience Next-Gen Audio with <span className={auroraStyles.highlight}>Aurora Sky Pulse™</span></h2>
  471 |
  472 |           <p>Immerse yourself in revolutionary 3D spatial audio that transforms your reality. The <strong>Aurora Sky Pulse™</strong> represents a quantum leap in audio technology, featuring AI-powered sound adaptation and neural processing.</p>
 ⨯ ReferenceError: auroraStyles is not defined
    at Home (pages\index.js:469:29)
  467 |
  468 |         {/* Enhanced Product Showcase */}
> 469 |         <section className={auroraStyles['aurora-feature-section']}>
      |                             ^
  470 |           <h2>Experience Next-Gen Audio with <span className={auroraStyles.highlight}>Aurora Sky Pulse™</span></h2>
  471 |
  472 |           <p>Immerse yourself in revolutionary 3D spatial audio that transforms your reality. The <strong>Aurora Sky Pulse™</strong> represents a quantum leap in audio technology, featuring AI-powered sound adaptation and neural processing.</p> {
  page: '/'
}
 ○ Compiling /_error ...
 ✓ Compiled /_error in 56.1s (1457 modules)
 GET / 500 in 290745ms