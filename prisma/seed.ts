import { PrismaClient, NodeType, NodeStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing data (optional, be careful in production)
    // await prisma.lineageNode.deleteMany()

    // 1. Create Adnan (Root)
    const adnan = await prisma.lineageNode.create({
        data: {
            name: 'Adnan',
            nameAr: 'عدنان',
            type: NodeType.ROOT,
            status: NodeStatus.PUBLISHED,
            generationDepth: 0,
            biography: 'The traditional ancestor of the Adnanite Arabs.',
            biographyAr: 'الجد الجامع لقبائل العرب العدنانية.',
        },
    })
    console.log(`Created root: ${adnan.name}`)

    // 1a. Ma'ad (Tribe) -> Adnan
    const maad = await prisma.lineageNode.create({
        data: {
            name: "Ma'ad",
            nameAr: 'معد',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 1,
            parentId: adnan.id,
        },
    })

    // 1b. Nizar -> Ma'ad
    const nizar = await prisma.lineageNode.create({
        data: {
            name: 'Nizar',
            nameAr: 'نزار',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 2,
            parentId: maad.id,
        },
    })

    // 1c. Mudar -> Nizar
    const mudar = await prisma.lineageNode.create({
        data: {
            name: 'Mudar',
            nameAr: 'مضر',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 3,
            parentId: nizar.id,
        },
    })

    // 1d. Rabi'a -> Nizar
    await prisma.lineageNode.create({
        data: {
            name: "Rabi'a",
            nameAr: 'ربيعة',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 3,
            parentId: nizar.id,
        },
    })

    // 2. Create Qahtan (Root)
    const qahtan = await prisma.lineageNode.create({
        data: {
            name: 'Qahtan',
            nameAr: 'قحطان',
            type: NodeType.ROOT,
            status: NodeStatus.PUBLISHED,
            generationDepth: 0,
            biography: 'The traditional ancestor of the Qahtanite Arabs.',
            biographyAr: 'الجد الجامع لقبائل العرب القحطانية.',
        },
    })
    console.log(`Created root: ${qahtan.name}`)

    // 2a. Ya'rub -> Qahtan
    const yarub = await prisma.lineageNode.create({
        data: {
            name: "Ya'rub",
            nameAr: 'يعرب',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 1,
            parentId: qahtan.id,
        },
    })

    // 2b. Yashjub -> Ya'rub
    const yashjub = await prisma.lineageNode.create({
        data: {
            name: 'Yashjub',
            nameAr: 'يشجب',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 2,
            parentId: yarub.id,
        },
    })

    // 2c. Saba -> Yashjub
    await prisma.lineageNode.create({
        data: {
            name: 'Saba',
            nameAr: 'سبأ',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 3,
            parentId: yashjub.id,
        },
    })

    console.log('✅ Seed completed successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
