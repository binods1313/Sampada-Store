import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...\n');

    // Create test users for each tier
    const testUsers = [
        {
            id: 'free-user-001',
            email: 'free@test.sampada.in',
            name: 'Free Tier User',
            designerTier: 'free',
            designLimit: 2,
            designsCreatedThisMonth: 0,
            features: {
                aiAssistant: false,
                aiImageGen: false,
                multiProductPreview: false,
                customBranding: false,
            },
        },
        {
            id: 'pro-user-001',
            email: 'pro@test.sampada.in',
            name: 'Pro Tier User',
            designerTier: 'pro',
            designerSubStatus: 'active',
            designLimit: 50,
            designsCreatedThisMonth: 5,
            features: {
                aiAssistant: false,
                aiImageGen: false,
                multiProductPreview: true,
                customBranding: false,
            },
        },
        {
            id: 'ultra-user-001',
            email: 'ultra@test.sampada.in',
            name: 'Ultra Tier User',
            designerTier: 'ultra',
            designerSubStatus: 'active',
            designLimit: null, // Unlimited
            designsCreatedThisMonth: 25,
            features: {
                aiAssistant: true,
                aiImageGen: true,
                multiProductPreview: true,
                customBranding: true,
            },
        },
    ];

    for (const user of testUsers) {
        const created = await prisma.designUser.upsert({
            where: { email: user.email },
            update: user,
            create: user,
        });
        console.log(`✅ Created/Updated user: ${created.email} (${created.designerTier})`);
    }

    // Create sample templates
    const templates = [
        {
            id: 'template-minimal-001',
            name: 'Clean Minimal',
            description: 'Simple and elegant design with clean lines',
            category: 'minimal',
            canvasData: JSON.stringify({
                version: '5.3.0',
                objects: [
                    {
                        type: 'text',
                        text: 'YOUR TEXT HERE',
                        left: 200,
                        top: 200,
                        fontSize: 48,
                        fontFamily: 'Helvetica',
                        fill: '#333333',
                    },
                ],
            }),
            isPublic: true,
        },
        {
            id: 'template-bold-001',
            name: 'Bold Typography',
            description: 'Make a statement with bold text',
            category: 'minimal',
            canvasData: JSON.stringify({
                version: '5.3.0',
                objects: [
                    {
                        type: 'text',
                        text: 'BOLD',
                        left: 150,
                        top: 150,
                        fontSize: 96,
                        fontFamily: 'Impact',
                        fontWeight: 'bold',
                        fill: '#000000',
                    },
                ],
            }),
            isPublic: true,
        },
        {
            id: 'template-boho-001',
            name: 'Boho Floral',
            description: 'Beautiful bohemian floral patterns',
            category: 'bohemian',
            canvasData: JSON.stringify({
                version: '5.3.0',
                objects: [
                    {
                        type: 'circle',
                        left: 200,
                        top: 200,
                        radius: 50,
                        fill: '#f4a9a8',
                    },
                    {
                        type: 'text',
                        text: 'BLOOM',
                        left: 180,
                        top: 300,
                        fontSize: 36,
                        fontFamily: 'Georgia',
                        fill: '#8b5a5a',
                    },
                ],
            }),
            isPublic: true,
        },
        {
            id: 'template-sports-001',
            name: 'Sports Champion',
            description: 'Perfect for sports teams and athletes',
            category: 'sports',
            canvasData: JSON.stringify({
                version: '5.3.0',
                objects: [
                    {
                        type: 'text',
                        text: 'CHAMPION',
                        left: 100,
                        top: 180,
                        fontSize: 64,
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        fill: '#1e40af',
                    },
                    {
                        type: 'text',
                        text: '2026',
                        left: 200,
                        top: 260,
                        fontSize: 48,
                        fontFamily: 'Arial',
                        fill: '#dc2626',
                    },
                ],
            }),
            isPublic: true,
        },
    ];

    for (const template of templates) {
        const created = await prisma.designTemplate.upsert({
            where: { id: template.id },
            update: template,
            create: template,
        });
        console.log(`✅ Created/Updated template: ${created.name}`);
    }

    console.log('\n🌱 Seeding complete!\n');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
