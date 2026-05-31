const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\DIBYASINI\\.gemini\\antigravity\\scratch\\Kavya-Deployment\\Kavya_AGI\\components';
const destDir = 'E:\\Sampada-Store\\components\\CreativeStudio';

const files = ['CanvasInterface.tsx', 'Icons.tsx'];

files.forEach(file => {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');

    // Text replacements
    content = content.replace(/Kavya Creative Studio/g, "Sampada Creative Studio");
    content = content.replace(/Dream Bigger with Kavya/g, "Dream Bigger with Sampada");
    content = content.replace(/Firefly-powered agents/g, "AI-powered creative engines");
    content = content.replace(/Kavya/g, "Sampada");

    // Color hex replacements (case insensitive)
    content = content.replace(/#2a1b3d/gi, "#1A0A08");
    content = content.replace(/#1a0a2e/gi, "#2A1208");
    content = content.replace(/#121212/gi, "#1A0A08");
    content = content.replace(/#1e1e1e/gi, "#2A1208");
    content = content.replace(/#7c3aed/gi, "#8B1A1A");
    content = content.replace(/#06b6d4/gi, "#C9A84C");
    content = content.replace(/#8b5cf6/gi, "#8B1A1A");

    // "Any purple or violet gradient -> linear-gradient(135deg, #8B1A1A, #C9A84C)"
    // Since we need to keep Tailwind structure where possible, let's look for from-purple-X to-X
    content = content.replace(/bg-gradient-to-[a-z]+ from-purple-[0-9]+ (via-pink-[0-9]+ )?to-[a-z]+-[0-9]+/g, "bg-[linear-gradient(135deg,#8B1A1A,#C9A84C)]");
    content = content.replace(/bg-gradient-to-[a-z]+ from-cyan-[0-9]+ to-blue-[0-9]+/g, "bg-[#C9A84C]");
    content = content.replace(/from-cyan-[0-9]+ via-white to-magenta-[0-9]+/g, "from-[#C9A84C] via-white to-[#8B1A1A]");
    content = content.replace(/from-cyan-[0-9]+ via-purple-[0-9]+ to-orange-[0-9]+/g, "from-[#C9A84C] via-[#8B1A1A] to-[#C9A84C]");
    
    // Replace cyan/blue accents
    content = content.replace(/text-cyan-[0-9]+/g, "text-[#C9A84C]");
    content = content.replace(/border-cyan-[0-9]+/g, "border-[#C9A84C]");
    content = content.replace(/bg-cyan-[0-9]+/g, "bg-[#C9A84C]");
    content = content.replace(/text-blue-[0-9]+/g, "text-[#C9A84C]");
    content = content.replace(/border-blue-[0-9]+/g, "border-[#C9A84C]");
    content = content.replace(/bg-blue-[0-9]+/g, "bg-[#C9A84C]");

    // Replace purple accents
    content = content.replace(/text-purple-[0-9]+/g, "text-[#8B1A1A]");
    content = content.replace(/border-purple-[0-9]+/g, "border-[#8B1A1A]");
    content = content.replace(/bg-purple-[0-9]+/g, "bg-[#8B1A1A]");
    
    // Logo change
    // Change the F logo box to S
    // Apply linear-gradient(135deg, #8B1A1A, #C9A84C) to the logo background
    // Change font to Cormorant Garamond, serif for the S letter only
    content = content.replace(
        /<div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-\[#7c3aed\] to-\[#06b6d4\] flex items-center justify-center font-bold text-white text-lg shadow-lg">[\s\S]*?F[\s\S]*?<\/div>/g,
        `<div className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#8B1A1A,#C9A84C)] flex items-center justify-center font-bold text-white text-lg shadow-lg" style={{fontFamily: "'Cormorant Garamond', serif"}}>S</div>`
    );
    // There might be a generic F logo div if it doesn't match the regex exactly. Let's do a more robust replacement for the Logo if it's there.
    content = content.replace(
        /<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">[\s\S]*?F[\s\S]*?<\/div>/g,
        `<div className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#8B1A1A,#C9A84C)] flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{fontFamily: "'Cormorant Garamond', serif"}}>S</div>`
    );

    // Typescript stripping
    content = content.replace(/type ContentType = 'Photo' \| 'Art' \| 'Auto';/g, '');
    content = content.replace(/interface CanvasInterfaceProps {[\s\S]*?}/g, '');
    content = content.replace(/interface Model {[\s\S]*?}/g, '');
    content = content.replace(/interface AspectRatio {[\s\S]*?}/g, '');
    
    // Parameter types
    content = content.replace(/\(props: any\)/g, "(props)");
    content = content.replace(/\(props: React\.SVGProps<SVGSVGElement>\)/g, "(props)");
    content = content.replace(/<HTMLInputElement>/g, "");
    content = content.replace(/\(e: React\.ChangeEvent<HTMLInputElement>\)/g, "(e)");
    content = content.replace(/\(index: number\)/g, "(index)");
    content = content.replace(/\(e: MouseEvent\)/g, "(e)");
    content = content.replace(/\(file: File, idx: number\)/g, "(file, idx)");
    content = content.replace(/{ activeTab: string, setActiveTab: \(t: string\) => void }/g, "");
    content = content.replace(/{ activeTab, setActiveTab }: /g, "{ activeTab, setActiveTab }");
    
    // Write out as .jsx
    const destFile = file.replace('.tsx', '.jsx');
    fs.writeFileSync(path.join(destDir, destFile), content);
    console.log(`Processed ${file} to ${destFile}`);
});
