import { PrismaClient, NodeType, NodeStatus, EventType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing data (order matters for self-referencing relations)
    await prisma.historicalEvent.deleteMany()
    await prisma.contribution.deleteMany()
    // Nullify parent references first, then delete nodes
    await prisma.lineageNode.updateMany({ data: { parentId: null } })
    await prisma.lineageNode.deleteMany()
    console.log('🧹 Cleared existing data')

    // ────────────────────────────────────────────
    // 1. ADNAN Branch (Northern Arabs / العرب العدنانية)
    // ────────────────────────────────────────────

    const adnan = await prisma.lineageNode.create({
        data: {
            name: 'Adnan',
            nameAr: 'عدنان',
            type: NodeType.ROOT,
            status: NodeStatus.PUBLISHED,
            generationDepth: 0,
            biography: 'The traditional ancestor of the Adnanite Arabs, descended from Ishmael son of Abraham.',
            biographyAr: 'الجد الجامع لقبائل العرب العدنانية، من ذرية إسماعيل بن إبراهيم عليهما السلام.',
            birthPlace: 'مكة المكرمة',
            era: 'ما قبل الإسلام',
            latitude: 21.4225,
            longitude: 39.8262,
            childCount: 1,
        },
    })
    console.log(`✅ ${adnan.name}`)

    const maad = await prisma.lineageNode.create({
        data: {
            name: "Ma'ad",
            nameAr: 'معد',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 1,
            parentId: adnan.id,
            birthPlace: 'الحجاز',
            era: 'ما قبل الإسلام',
            latitude: 24.47,
            longitude: 39.61,
            childCount: 1,
        },
    })
    console.log(`  ✅ ${maad.name}`)

    const nizar = await prisma.lineageNode.create({
        data: {
            name: 'Nizar',
            nameAr: 'نزار',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 2,
            parentId: maad.id,
            birthPlace: 'نجد',
            era: 'ما قبل الإسلام',
            latitude: 24.63,
            longitude: 46.72,
            childCount: 2,
        },
    })
    console.log(`    ✅ ${nizar.name}`)

    const mudar = await prisma.lineageNode.create({
        data: {
            name: 'Mudar',
            nameAr: 'مضر',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 3,
            parentId: nizar.id,
            birthPlace: 'تهامة',
            era: 'ما قبل الإسلام',
            latitude: 20.45,
            longitude: 41.05,
            childCount: 0,
        },
    })
    console.log(`      ✅ ${mudar.name}`)

    const rabia = await prisma.lineageNode.create({
        data: {
            name: "Rabi'a",
            nameAr: 'ربيعة',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 3,
            parentId: nizar.id,
            birthPlace: 'شرق الجزيرة العربية',
            era: 'ما قبل الإسلام',
            latitude: 26.43,
            longitude: 50.10,
            childCount: 0,
        },
    })
    console.log(`      ✅ ${rabia.name}`)

    // ────────────────────────────────────────────
    // 2. QAHTAN Branch (Southern Arabs / العرب القحطانية)
    // ────────────────────────────────────────────

    const qahtan = await prisma.lineageNode.create({
        data: {
            name: 'Qahtan',
            nameAr: 'قحطان',
            type: NodeType.ROOT,
            status: NodeStatus.PUBLISHED,
            generationDepth: 0,
            biography: 'The traditional ancestor of the Qahtanite Arabs from southern Arabia.',
            biographyAr: 'الجد الجامع لقبائل العرب القحطانية من جنوب الجزيرة العربية.',
            birthPlace: 'اليمن',
            era: 'ما قبل الإسلام',
            latitude: 15.37,
            longitude: 44.19,
            childCount: 1,
        },
    })
    console.log(`✅ ${qahtan.name}`)

    const yarub = await prisma.lineageNode.create({
        data: {
            name: "Ya'rub",
            nameAr: 'يعرب',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 1,
            parentId: qahtan.id,
            birthPlace: 'حضرموت',
            era: 'ما قبل الإسلام',
            latitude: 15.95,
            longitude: 48.78,
            childCount: 1,
        },
    })
    console.log(`  ✅ ${yarub.name}`)

    const yashjub = await prisma.lineageNode.create({
        data: {
            name: 'Yashjub',
            nameAr: 'يشجب',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 2,
            parentId: yarub.id,
            birthPlace: 'عُمان',
            era: 'ما قبل الإسلام',
            latitude: 23.58,
            longitude: 58.38,
            childCount: 1,
        },
    })
    console.log(`    ✅ ${yashjub.name}`)

    const saba = await prisma.lineageNode.create({
        data: {
            name: 'Saba',
            nameAr: 'سبأ',
            type: NodeType.TRIBE,
            status: NodeStatus.PUBLISHED,
            generationDepth: 3,
            parentId: yashjub.id,
            birthPlace: 'مأرب',
            era: 'ما قبل الإسلام',
            latitude: 15.46,
            longitude: 45.35,
            childCount: 0,
        },
    })
    console.log(`      ✅ ${saba.name}`)

    // ────────────────────────────────────────────
    // 3. HISTORICAL EVENTS
    // ────────────────────────────────────────────
    console.log('\n📜 Creating historical events...')

    await prisma.historicalEvent.createMany({
        data: [
            {
                nodeId: saba.id,
                title: 'Kingdom of Saba Founded',
                titleAr: 'تأسيس مملكة سبأ',
                description: 'The Kingdom of Saba (Sheba) was established in Marib with the great dam.',
                descriptionAr: 'تأسيس مملكة سبأ في مأرب وبناء سد مأرب العظيم.',
                yearCE: -1000,
                eventType: EventType.FOUNDING,
                location: 'مأرب، اليمن',
                latitude: 15.46,
                longitude: 45.35,
            },
            {
                nodeId: saba.id,
                title: 'Marib Dam Collapse',
                titleAr: 'انهيار سد مأرب',
                description: 'The collapse of the Great Dam of Marib led to the dispersal of Yemeni tribes (سيل العرم).',
                descriptionAr: 'انهيار سد مأرب أدى إلى تفرق القبائل اليمنية فيما عُرف بسيل العرم.',
                yearCE: 575,
                eventType: EventType.MIGRATION,
                location: 'مأرب، اليمن',
                latitude: 15.43,
                longitude: 45.33,
            },
            {
                nodeId: qahtan.id,
                title: 'Azd Migration Northward',
                titleAr: 'هجرة الأزد شمالًا',
                description: 'After the dam collapse, the Azd tribe migrated to Oman, Hejaz, and the Levant.',
                descriptionAr: 'بعد انهيار السد، هاجرت قبيلة الأزد إلى عمان والحجاز والشام.',
                yearCE: 580,
                eventType: EventType.MIGRATION,
                location: 'من اليمن إلى الشمال',
                latitude: 19.50,
                longitude: 43.00,
            },
            {
                nodeId: rabia.id,
                title: 'Battle of Dhi Qar',
                titleAr: 'معركة ذي قار',
                description: 'A major pre-Islamic battle where Arab tribes under Banu Bakr (Rabi\'a) defeated the Sassanids.',
                descriptionAr: 'معركة كبرى انتصر فيها العرب من بني بكر (ربيعة) على الفرس الساسانيين.',
                yearCE: 609,
                eventType: EventType.BATTLE,
                location: 'ذي قار، العراق',
                latitude: 31.05,
                longitude: 46.25,
            },
            {
                nodeId: mudar.id,
                title: 'Quraysh Custodianship of Kaaba',
                titleAr: 'تولي قريش سدانة الكعبة',
                description: 'Qusai ibn Kilab of Quraysh (Mudar branch) unified custodianship of the Kaaba.',
                descriptionAr: 'قصي بن كلاب من قريش (فرع مضر) وحّد سدانة الكعبة المشرفة.',
                yearCE: 480,
                eventType: EventType.CULTURAL,
                location: 'مكة المكرمة',
                latitude: 21.4225,
                longitude: 39.8262,
            },
            {
                nodeId: adnan.id,
                title: 'Hajj Pilgrimage Established',
                titleAr: 'تأسيس شعائر الحج',
                description: 'The pre-Islamic Hajj pilgrimage tradition was passed through the descendants of Adnan.',
                descriptionAr: 'توارث أبناء عدنان تقاليد الحج في مكة المكرمة.',
                yearCE: -200,
                eventType: EventType.CULTURAL,
                location: 'مكة المكرمة',
                latitude: 21.42,
                longitude: 39.83,
            },
            {
                nodeId: nizar.id,
                title: 'Nizar Tribal Confederation',
                titleAr: 'تحالف بني نزار',
                description: 'Formation of the great tribal confederation under Nizar controlling central Arabia.',
                descriptionAr: 'تشكيل التحالف القبلي الكبير تحت بني نزار للسيطرة على وسط الجزيرة.',
                yearCE: 300,
                eventType: EventType.ALLIANCE,
                location: 'نجد',
                latitude: 24.63,
                longitude: 46.72,
            },
            {
                nodeId: yarub.id,
                title: 'Founding of Hadramawtian Kingdom',
                titleAr: 'تأسيس مملكة حضرموت',
                description: 'The ancient kingdom of Hadramawt was established by descendants of Ya\'rub.',
                descriptionAr: 'تأسيس مملكة حضرموت القديمة من قبل أبناء يعرب.',
                yearCE: -800,
                eventType: EventType.FOUNDING,
                location: 'حضرموت، اليمن',
                latitude: 15.95,
                longitude: 48.78,
            },
            {
                nodeId: yashjub.id,
                title: 'Omani Maritime Trade',
                titleAr: 'التجارة البحرية العمانية',
                description: 'Tribes in Oman developed extensive maritime trade routes to East Africa and India.',
                descriptionAr: 'طورت القبائل في عمان طرقًا تجارية بحرية واسعة إلى شرق أفريقيا والهند.',
                yearCE: 100,
                eventType: EventType.CULTURAL,
                location: 'مسقط، عُمان',
                latitude: 23.61,
                longitude: 58.54,
            },
            {
                nodeId: maad.id,
                title: 'Hejaz Trade Route Control',
                titleAr: 'السيطرة على طريق تجارة الحجاز',
                description: 'Ma\'ad tribes controlled the vital incense trade route through Hejaz.',
                descriptionAr: 'سيطرت قبائل معد على طريق تجارة البخور الحيوي عبر الحجاز.',
                yearCE: 200,
                eventType: EventType.CULTURAL,
                location: 'المدينة المنورة',
                latitude: 24.47,
                longitude: 39.61,
            },
        ],
    })
    console.log('✅ Created 10 historical events')

    console.log('\n🎉 Seed completed successfully!')
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
