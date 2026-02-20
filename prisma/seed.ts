import { PrismaClient, NodeType, NodeStatus, EventType, DnaType, UserRole, NotificationType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing data
    await prisma.notification.deleteMany()
    await prisma.dnaMarker.deleteMany()
    await prisma.historicalEvent.deleteMany()
    await prisma.contribution.deleteMany()
    await prisma.lineageNode.updateMany({ data: { parentId: null } })
    await prisma.lineageNode.deleteMany()
    console.log('🧹 Cleared existing data')

    // ═══════════════════════════════════════════════
    // ADNANITE BRANCH (Northern Arabs / العرب العدنانية)
    // Source: Ibn al-Kalbi, Jamharat al-Nasab; Ibn Hisham, al-Sirah
    // ═══════════════════════════════════════════════

    const ibrahim = await prisma.lineageNode.create({
        data: {
            name: 'Ibrahim (Abraham)', nameAr: 'إبراهيم', type: NodeType.ROOT, status: NodeStatus.PUBLISHED,
            generationDepth: -3, childCount: 1, isDirectAncestor: true,
            title: 'أبو الأنبياء الخليل',
            biography: 'The Patriarch Abraham, revered in Islam, Christianity, and Judaism. Built the Kaaba in Mecca with his son Ishmael. Source: Quran.',
            biographyAr: 'أبو الأنبياء الخليل. بنى الكعبة في مكة مع ابنه إسماعيل. المصدر: القرآن الكريم.',
            birthPlace: 'أور (العراق)', era: 'العصور القديمة',
            latitude: 30.96, longitude: 46.10,
        },
    })

    const ismail = await prisma.lineageNode.create({
        data: {
            name: "Isma'il", nameAr: 'إسماعيل', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: -2, parentId: ibrahim.id, childCount: 1, isDirectAncestor: true,
            title: 'ذبيح الله',
            biography: 'Son of Abraham and ancestor of the Northern Arabs. Settled in Mecca and helped his father build the Kaaba. Source: Quran, Ibn Hisham.',
            biographyAr: 'ابن إبراهيم وجد العرب المستعربة. استقر في مكة وساعد أباه في بناء الكعبة. المصدر: القرآن الكريم، ابن هشام.',
            birthPlace: 'فلسطين / مكة المكرمة', era: 'العصور القديمة',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const qedar = await prisma.lineageNode.create({
        data: {
            name: 'Qedar', nameAr: 'قيدار بن إسماعيل', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: -1, parentId: ismail.id, childCount: 1, isDirectAncestor: true,
            biography: 'Son of Ishmael. He is the traditional ancestor of the Qedarites, a powerful tribal confederacy. Adnan descends from him. Source: Biblical/Islamic tradition.',
            biographyAr: 'ابن إسماعيل وجد قبائل قيدار القوية. تنحدر العرب العدنانية من نسله. المصدر: التراث الديني والتاريخي.',
            birthPlace: 'الحجاز / الشام', era: 'العصور القديمة',
            latitude: 28.39, longitude: 36.58,
        },
    })

    const adnan = await prisma.lineageNode.create({
        data: {
            name: 'Adnan', nameAr: 'عدنان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 0, parentId: qedar.id, childCount: 2, isDirectAncestor: true,
            title: 'أبو العرب العدنانية',
            biography: 'The traditional ancestor of the Adnanite (Northern) Arabs. According to Islamic tradition, he is a descendant of Ishmael (Isma\'il) son of Abraham (Ibrahim). The Prophet Muhammad\'s lineage traces back to Adnan. His genealogy is documented in Ibn al-Kalbi\'s Jamharat al-Nasab and al-Tabari\'s Tarikh.',
            biographyAr: 'الجد الجامع للعرب العدنانية (عرب الشمال). ينحدر من إسماعيل بن إبراهيم عليهما السلام حسب الإجماع الإسلامي. يرجع نسب النبي محمد ﷺ إليه. وثّق نسبه ابن الكلبي في جمهرة النسب والطبري في تاريخه.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const maad = await prisma.lineageNode.create({
        data: {
            name: "Ma'ad", nameAr: 'معد بن عدنان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 1, parentId: adnan.id, childCount: 1, isDirectAncestor: true,
            biography: 'Son of Adnan and father of Nizar. The forefather of the major northern Arab tribal confederations. Referenced in pre-Islamic poetry and in Jamharat al-Nasab.',
            biographyAr: 'ابن عدنان وأبو نزار. جدّ القبائل العدنانية الكبرى. ورد ذكره في الشعر الجاهلي وجمهرة النسب.',
            birthPlace: 'الحجاز', era: 'ما قبل الإسلام',
            latitude: 24.47, longitude: 39.61,
        },
    })

    const nizar = await prisma.lineageNode.create({
        data: {
            name: 'Nizar', nameAr: 'نزار بن معد', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 2, parentId: maad.id, childCount: 4, isDirectAncestor: true,
            biography: 'Son of Ma\'ad. Common ancestor of most northern Arab tribes. His four sons — Mudar, Rabi\'a, Iyad, and Anmar — founded the great tribal branches. Source: Ibn al-Kalbi, Jamharat al-Nasab.',
            biographyAr: 'ابن معد. الجد المشترك لمعظم قبائل العرب الشمالية. أبناؤه الأربعة — مضر وربيعة وإياد وأنمار — أسسوا الفروع القبلية الكبرى. المصدر: ابن الكلبي، جمهرة النسب.',
            birthPlace: 'نجد', era: 'ما قبل الإسلام',
            latitude: 24.63, longitude: 46.72,
        },
    })

    // ── Nizar's four sons ──

    const mudar = await prisma.lineageNode.create({
        data: {
            name: 'Mudar', nameAr: 'مضر بن نزار', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 3, parentId: nizar.id, childCount: 2, isDirectAncestor: true,
            title: 'مضر الحمراء',
            biography: 'Son of Nizar. Progenitor of the Mudarite tribes, the largest Adnanite confederation. Split into two branches: Qays \'Aylan and Khindif. The Quraysh tribe descends from this line. Source: Jamharat al-Nasab.',
            biographyAr: 'ابن نزار. جدّ قبائل مضر، أكبر تجمع عدناني. انقسمت إلى فرعين: قيس عيلان وخندف. قبيلة قريش من هذا النسل. المصدر: جمهرة النسب.',
            birthPlace: 'تهامة', era: 'ما قبل الإسلام',
            latitude: 20.45, longitude: 41.05,
        },
    })

    const rabia = await prisma.lineageNode.create({
        data: {
            name: "Rabi'a", nameAr: 'ربيعة بن نزار', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 3, parentId: nizar.id, childCount: 5,
            biography: 'Son of Nizar. Progenitor of the Rabi\'a tribal confederation. His descendants — Bakr, Taghlib, \'Anazah, Abdul Qais, and Hanifa — dominated eastern and central Arabia. Source: Ibn al-Kalbi.',
            biographyAr: 'ابن نزار. جدّ قبائل ربيعة. أبناؤه — بكر وتغلب وعنزة وعبد القيس وحنيفة — سيطروا على شرق ووسط الجزيرة العربية. المصدر: ابن الكلبي.',
            birthPlace: 'شرق الجزيرة العربية', era: 'ما قبل الإسلام',
            latitude: 26.43, longitude: 50.10,
        },
    })

    const iyad = await prisma.lineageNode.create({
        data: {
            name: 'Iyad', nameAr: 'إياد بن نزار', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 3, parentId: nizar.id, childCount: 0,
            biography: 'Son of Nizar. An ancient tribe that migrated to Mesopotamia. Mentioned by al-Tabari and in pre-Islamic poetry.',
            biographyAr: 'ابن نزار. قبيلة قديمة هاجرت إلى بلاد الرافدين. ذكرها الطبري وفي الشعر الجاهلي.',
            birthPlace: 'العراق', era: 'ما قبل الإسلام',
            latitude: 33.31, longitude: 44.37,
        },
    })

    const anmar = await prisma.lineageNode.create({
        data: {
            name: 'Anmar', nameAr: 'أنمار بن نزار', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 3, parentId: nizar.id, childCount: 2,
            biography: 'Son of Nizar. Ancestor of several tribes that settled in Yemen and the southern highlands. Source: Ibn al-Kalbi.',
            biographyAr: 'ابن نزار. جدّ عدة قبائل استقرت في اليمن والمرتفعات الجنوبية. المصدر: ابن الكلبي.',
            birthPlace: 'عسير', era: 'ما قبل الإسلام',
            latitude: 18.22, longitude: 42.50,
        },
    })

    await prisma.lineageNode.createMany({
        data: [
            { name: "Khath'am", nameAr: 'خثعم', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 4, parentId: anmar.id, childCount: 0, biography: 'A powerful tribe in the Asir region. Source: Ibn al-Kalbi.', biographyAr: 'قبيلة قوية في منطقة عسير. المصدر: ابن الكلبي.', birthPlace: 'عسير', era: 'ما قبل الإسلام', latitude: 19.50, longitude: 42.50 },
            { name: 'Bajila', nameAr: 'بجيلة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 4, parentId: anmar.id, childCount: 0, isConfirmed: false, biography: 'A tribe from the Sarat mountains. The famous companion Jarir al-Bajali was from them. Source: Jamharat al-Nasab.', biographyAr: 'قبيلة من جبال السراة. الصحابي الجليل جرير البجلي كان منهم. المصدر: جمهرة النسب.', birthPlace: 'السراة', era: 'ما قبل الإسلام', latitude: 20.00, longitude: 41.50 },
        ]
    })

    // ── Mudar's two branches ──

    const qaysAylan = await prisma.lineageNode.create({
        data: {
            name: "Qays 'Aylan", nameAr: 'قيس عيلان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 4, parentId: mudar.id, childCount: 3,
            biography: 'Major branch of Mudar. Includes the warrior tribes Hawazin, Ghatafan, and Sulaym. Dominated Najd. Source: Jamharat al-Nasab.',
            biographyAr: 'فرع رئيسي من مضر. يشمل قبائل هوازن وغطفان وسُليم المحاربة. سيطر على نجد. المصدر: جمهرة النسب.',
            birthPlace: 'نجد', era: 'ما قبل الإسلام',
            latitude: 25.00, longitude: 45.00,
        },
    })

    const khindif = await prisma.lineageNode.create({
        data: {
            name: 'Khindif', nameAr: 'خندف (إلياس بن مضر)', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 4, parentId: mudar.id, childCount: 4, isDirectAncestor: true,
            alternateNames: ['Ilyas ibn Mudar', 'إلياس'],
            biography: 'Also known as Ilyas ibn Mudar. The branch that includes Kinanah (and thus Quraysh), Tamim, Hudhayl, and Asad. Source: Ibn Hisham, al-Sirah.',
            biographyAr: 'يُعرف أيضًا بإلياس بن مضر. الفرع الذي يشمل كنانة (وبالتالي قريش) وتميم وهذيل وأسد. المصدر: ابن هشام، السيرة.',
            birthPlace: 'الحجاز', era: 'ما قبل الإسلام',
            latitude: 23.00, longitude: 40.00,
        },
    })

    // ── Qays 'Aylan tribes ──

    const hawazin = await prisma.lineageNode.create({
        data: {
            name: 'Hawazin', nameAr: 'هوازن', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 5, parentId: qaysAylan.id, childCount: 2,
            biography: 'One of the largest Qaysite tribes. Fought against the Prophet at the Battle of Hunayn (630 CE). Source: al-Tabari.',
            biographyAr: 'من أكبر قبائل قيس. حاربت النبي ﷺ في غزوة حنين (630م). المصدر: الطبري.',
            birthPlace: 'الطائف', era: 'ما قبل الإسلام',
            latitude: 21.27, longitude: 40.42
        }
    })

    const ghatafan = await prisma.lineageNode.create({
        data: {
            name: 'Ghatafan', nameAr: 'غطفان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 5, parentId: qaysAylan.id, childCount: 2,
            biography: 'A powerful Qaysite tribe in Najd. Allied with Quraysh in the Battle of the Trench. Source: Ibn Hisham.',
            biographyAr: 'قبيلة قيسية قوية في نجد. تحالفت مع قريش في غزوة الخندق. المصدر: ابن هشام.',
            birthPlace: 'نجد', era: 'ما قبل الإسلام',
            latitude: 26.30, longitude: 43.50
        }
    })

    await prisma.lineageNode.createMany({
        data: [
            { name: 'Sulaym', nameAr: 'بنو سُليم', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: qaysAylan.id, childCount: 0, biography: 'A Qaysite tribe known for their role in the early Islamic conquests and migration to North Africa. Source: al-Tabari.', biographyAr: 'قبيلة قيسية اشتهرت بدورها في الفتوحات الإسلامية وهجرتها إلى شمال أفريقيا. المصدر: الطبري.', birthPlace: 'الحجاز', era: 'ما قبل الإسلام', latitude: 23.50, longitude: 40.80 },
            { name: 'Thaqif', nameAr: 'ثقيف', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: hawazin.id, childCount: 0, biography: 'A major sub-tribe of Hawazin that settled in Ta\'if. They initially resisted Islam before converting. Source: Ibn Hisham.', biographyAr: 'من كبرى فروع هوازن في الطائف. قاوموا الإسلام في البداية قبل أن يسلموا. المصدر: ابن هشام.', birthPlace: 'الطائف', era: 'ما قبل الإسلام', latitude: 21.27, longitude: 40.42 },
            { name: "Banu 'Amir", nameAr: 'بنو عامر بن صعصعة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: hawazin.id, childCount: 0, biography: 'A massive Hawazin sub-tribe, prominent in pre-Islamic poetry and history. They were key players in the Najd region. Source: Jamharat al-Nasab.', biographyAr: 'قبيلة هوازنية ضخمة، بارزة في الشعر والتاريخ الجاهلي. لعبت دوراً رئيسياً في إقليم نجد. المصدر: جمهرة النسب.', birthPlace: 'نجد', era: 'ما قبل الإسلام', latitude: 24.00, longitude: 45.00 },
            { name: "Banu Sa'd", nameAr: 'بنو سعد بن بكر', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: hawazin.id, childCount: 0, biography: 'A Hawazin sub-tribe, famous for Halimah al-Sa\'diyah, the Prophet\'s wet-nurse. Known for their pure Arabic dialect. Source: Ibn Hisham.', biographyAr: 'فرع من هوازن، اشتهروا بحليمة السعدية مرضعة النبي ﷺ. عُرفوا بفصاحة لسانهم. المصدر: ابن هشام.', birthPlace: 'الطائف', era: 'ما قبل الإسلام', latitude: 21.30, longitude: 40.50 },
            { name: "'Abs", nameAr: 'بنو عبس', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: ghatafan.id, childCount: 0, biography: 'A major branch of Ghatafan. Famous for the poet Antarah ibn Shaddad and the War of Dahis and Ghabra. Source: al-Aghani.', biographyAr: 'فرع ريئسي من غطفان. اشتهروا بالشاعر عنترة بن شداد وحرب داحس والغبراء. المصدر: الأغاني.', birthPlace: 'نجد', era: 'ما قبل الإسلام', latitude: 26.00, longitude: 43.00 },
            { name: 'Dhubyan', nameAr: 'بنو ذبيان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: ghatafan.id, childCount: 0, biography: 'A major branch of Ghatafan. Rivals of Banu Abs in the famous War of Dahis and Ghabra. Source: al-Aghani.', biographyAr: 'فرع رئيسي من غطفان. خصوم بني عبس في حرب داحس والغبراء. المصدر: الأغاني.', birthPlace: 'نجد', era: 'ما قبل الإسلام', latitude: 26.30, longitude: 43.50 },
        ],
    })

    // ── Khindif tribes ──

    const khuzaimah = await prisma.lineageNode.create({
        data: {
            name: 'Khuzaimah', nameAr: 'خزيمة بن مدركة', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 5, parentId: khindif.id, childCount: 1, isDirectAncestor: true,
            biography: 'Ancestor of Kinanah and Asad. Source: Ibn al-Kalbi.',
            biographyAr: 'جد كنانة وأسد. المصدر: ابن الكلبي.',
            birthPlace: 'الحجاز', era: 'ما قبل الإسلام', latitude: 22.00, longitude: 40.00
        }
    })

    const kinanah = await prisma.lineageNode.create({
        data: {
            name: 'Kinanah', nameAr: 'كنانة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 6, parentId: khuzaimah.id, childCount: 1, isDirectAncestor: true,
            biography: 'A major Mudarite tribe from which Quraysh descends. Settled around Mecca and the Tihama. Source: Ibn al-Kalbi.',
            biographyAr: 'قبيلة مضرية كبرى تنحدر منها قريش. استقرت حول مكة وتهامة. المصدر: ابن الكلبي.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.50, longitude: 39.80,
        },
    })

    await prisma.lineageNode.createMany({
        data: [
            { name: 'Tamim', nameAr: 'بنو تميم', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: khindif.id, childCount: 0, biography: 'One of the largest Arab tribes. Dominated eastern Najd. Famous for their poetry and oratory. The Prophet said: "The last to follow the Dajjal will be from Tamim." Source: al-Tabari, Sahih Muslim.', biographyAr: 'من أكبر القبائل العربية. سيطرت على شرق نجد. اشتهرت بالشعر والخطابة. قال النبي ﷺ: "آخر من يتبع الدجال من تميم." المصدر: الطبري، صحيح مسلم.', birthPlace: 'اليمامة', era: 'ما قبل الإسلام', latitude: 24.15, longitude: 47.30 },
            { name: 'Hudhayl', nameAr: 'هُذيل', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: khindif.id, childCount: 0, biography: 'A Mudarite tribe near Mecca known for their eloquent poetry. Major figures include Abu Dhu\'ayb al-Hudhali. Source: al-Aghani.', biographyAr: 'قبيلة مضرية قرب مكة اشتهرت بالشعر الفصيح. من أبرز شعرائها أبو ذؤيب الهذلي. المصدر: الأغاني.', birthPlace: 'قرب مكة', era: 'ما قبل الإسلام', latitude: 21.60, longitude: 40.20 },
            { name: 'Asad', nameAr: 'بنو أسد', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: khindif.id, childCount: 0, biography: 'A Mudarite tribe in central Najd. Produced notable pre-Islamic poets. Source: Jamharat al-Nasab.', biographyAr: 'قبيلة مضرية في وسط نجد. أنجبت شعراء جاهليين بارزين. المصدر: جمهرة النسب.', birthPlace: 'نجد', era: 'ما قبل الإسلام', latitude: 25.50, longitude: 44.00 },
        ],
    })

    // ── Quraysh and its ancestry ──

    const quraysh = await prisma.lineageNode.create({
        data: {
            name: 'Quraysh', nameAr: 'قريش', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 7, parentId: kinanah.id, childCount: 1, isDirectAncestor: true,
            title: 'سادة مكة',
            biography: 'The ruling tribe of Mecca and custodians of the Kaaba. The Prophet Muhammad ﷺ was from Quraysh. Named in the Quran (Surah Quraysh, 106). Source: Ibn Hisham, al-Sirah.',
            biographyAr: 'القبيلة الحاكمة في مكة وسدنة الكعبة. النبي محمد ﷺ من قريش. ورد ذكرها في القرآن (سورة قريش، 106). المصدر: ابن هشام، السيرة.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const ghalib = await prisma.lineageNode.create({
        data: { name: 'Ghalib ibn Fihr', nameAr: 'غالب بن فهر', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 8, parentId: quraysh.id, childCount: 1, isDirectAncestor: true, biography: 'Ancestor of most prominent Qurayshi clans. Source: Ibn Hisham.', biographyAr: 'جد أبرز بطون قريش. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 }
    })

    const kab = await prisma.lineageNode.create({
        data: { name: "Ka'b ibn Lu'ayy", nameAr: 'كعب بن لؤي', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 10, parentId: ghalib.id, childCount: 2, isDirectAncestor: true, biography: 'A revered ancestor in Quraysh. He initiated the Friday gatherings. Source: Ibn Sa\'d.', biographyAr: 'جد محترم في قريش. هو أول من جمع الناس يوم الجمعة. المصدر: ابن سعد.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 }
    })

    const kilab = await prisma.lineageNode.create({
        data: { name: 'Kilab ibn Murrah', nameAr: 'كلاب بن مرة', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 12, parentId: kab.id, childCount: 2, isDirectAncestor: true, biography: 'Father of Qusai and Zuhrah. Real name was Hakim or Urwah. Source: Ibn Hisham.', biographyAr: 'أبو قصي وزهرة. اسمه الحقيقي حكيم أو عروة. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 }
    })

    const qusai = await prisma.lineageNode.create({
        data: { name: 'Qusai ibn Kilab', nameAr: 'قصي بن كلاب', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 13, parentId: kilab.id, childCount: 1, isDirectAncestor: true, title: 'مُجمِّع', biography: 'Unified Quraysh and established custodianship of the Kaaba, Dar al-Nadwa, and Siqaya. Source: Ibn Hisham.', biographyAr: 'وحد قريش وأسس سدانة الكعبة ودار الندوة والسقاية. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 }
    })

    const abdManaf = await prisma.lineageNode.create({
        data: { name: 'Abd Manaf', nameAr: 'عبد مناف', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 14, parentId: qusai.id, childCount: 4, isDirectAncestor: true, biography: 'Father of Hashim, Abd Shams, Nawfal, and Muttalib. Highly respected in Mecca. Source: Ibn Hisham.', biographyAr: 'أبو هاشم وعبد شمس ونوفل والمطلب. كان عظيم القدر في مكة. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 }
    })

    const hashim = await prisma.lineageNode.create({
        data: {
            name: 'Banu Hashim', nameAr: 'بنو هاشم', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 15, parentId: abdManaf.id, childCount: 1, isDirectAncestor: true,
            title: 'آل البيت',
            biography: 'The clan of the Prophet Muhammad ﷺ within Quraysh. Named after Hashim ibn Abd Manaf, who established the trade caravans to Yemen and Syria. Source: Ibn Hisham.',
            biographyAr: 'بطن النبي محمد ﷺ من قريش. سُمي نسبة إلى هاشم بن عبد مناف الذي أسس رحلتي الشتاء والصيف التجاريتين. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const umayya = await prisma.lineageNode.create({
        data: {
            name: 'Banu Umayya', nameAr: 'بنو أمية', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 15, parentId: abdManaf.id, childCount: 1,
            biography: 'A major clan of Quraysh. They established the Umayyad Caliphate (661–750 CE), the first great Muslim dynasty. Source: al-Tabari.',
            biographyAr: 'بطن رئيسي من قريش. أسسوا الخلافة الأموية (661-750م)، أول سلالة إسلامية كبرى. المصدر: الطبري.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const taym = await prisma.lineageNode.create({
        data: {
            name: 'Banu Taym', nameAr: 'بنو تيم', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 13, parentId: kilab.id, childCount: 1,
            biography: 'A clan of Quraysh. Famous for Abu Bakr al-Siddiq, the first Caliph. Source: Ibn Hisham, al-Tabari.',
            biographyAr: 'بطن من قريش. اشتهروا بأبي بكر الصديق، الخليفة الأول. المصدر: ابن هشام، الطبري.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
        },
    })

    const adi = await prisma.lineageNode.create({
        data: {
            name: 'Banu Adi', nameAr: 'بنو عدي', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 12, parentId: kab.id, childCount: 1,
            biography: 'A clan of Quraysh responsible for diplomacy (Sifarah). Famous for Umar ibn al-Khattab. Source: al-Durrah.',
            biographyAr: 'بطن من قريش تولى السفارة. اشتهروا بعمر بن الخطاب. المصدر: الدرة.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
        },
    })

    const makhzum = await prisma.lineageNode.create({
        data: {
            name: 'Banu Makhzum', nameAr: 'بنو مخزوم', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 11, parentId: kab.id, childCount: 1,
            title: 'ريحانة قريش',
            biography: 'A prominent, wealthy, and politically powerful clan of Quraysh known for their military leadership, such as Khalid ibn al-Walid. Source: Ibn Hisham.',
            biographyAr: 'بطن بارز وثري ذو نفوذ سياسي في قريش، عُرفوا بقيادتهم العسكرية، مثل خالد بن الوليد. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const abdShams = await prisma.lineageNode.create({
        data: {
            name: 'Banu Abd Shams', nameAr: 'بنو عبد شمس', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 15, parentId: abdManaf.id, childCount: 1,
            biography: 'A powerful clan of Quraysh, rivals of Banu Hashim. Progenitors of the Umayyads. Source: Ibn Hisham.',
            biographyAr: 'بطن قوي من قريش، ومنافس لبني هاشم. منهم الأمويون. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const sahm = await prisma.lineageNode.create({
        data: {
            name: 'Banu Sahm', nameAr: 'بنو سهم', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 12, parentId: kab.id, childCount: 1,
            biography: 'Clan responsible for arbitration (Hukumah) and custodianship of the Kaaba\'s treasures. Included Amr ibn al-Aas. Source: Ibn Hisham.',
            biographyAr: 'بطن تولى الحكومة وحفظ أموال الكعبة. منهم عمرو بن العاص. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const jumah = await prisma.lineageNode.create({
        data: {
            name: 'Banu Jumah', nameAr: 'بنو جمح', type: NodeType.CLAN, status: NodeStatus.PUBLISHED,
            generationDepth: 12, parentId: kab.id, childCount: 1,
            biography: 'Clan responsible for divination (Azlam). Umayyah ibn Khalaf was their chief. Source: Ibn Hisham.',
            biographyAr: 'بطن تولى الاستقسام بالأزلام. سيدهم أمية بن خلف. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    // ── Individual prominent figures ──

    await prisma.lineageNode.createMany({
        data: [
            { name: "Abu Bakr al-Siddiq", nameAr: "أبو بكر الصديق", type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 16, parentId: taym.id, childCount: 0, biography: "The first Caliph of Islam and the closest companion of the Prophet Muhammad ﷺ.", biographyAr: "الخليفة الأول للإسلام وأقرب صحابة النبي محمد ﷺ.", birthYear: 573, deathYear: 634, birthPlace: "مكة المكرمة", era: "صدر الإسلام" },
            { name: "Umar ibn al-Khattab", nameAr: "عمر بن الخطاب", type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 16, parentId: adi.id, childCount: 0, biography: "The second Caliph of Islam. Known as Al-Faruq.", biographyAr: "الخليفة الثاني للإسلام. يلقب بالفاروق.", birthYear: 584, deathYear: 644, birthPlace: "مكة المكرمة", era: "صدر الإسلام" },
            { name: "Uthman ibn Affan", nameAr: "عثمان بن عفان", type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 16, parentId: umayya.id, childCount: 0, biography: "The third Caliph of Islam. Known as Dhul-Nurayn.", biographyAr: "الخليفة الثالث للإسلام. يلقب بذي النورين.", birthYear: 576, deathYear: 656, birthPlace: "مكة المكرمة", era: "صدر الإسلام" },
            { name: "Khalid ibn al-Walid", nameAr: "خالد بن الوليد", type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 13, parentId: makhzum.id, childCount: 0, biography: "Legendary Muslim commander. Known as the Drawn Sword of God.", biographyAr: "قائد إسلامي أسطوري. يلقب بسيف الله المسلول.", birthYear: 585, deathYear: 642, birthPlace: "مكة المكرمة", era: "صدر الإسلام" }
        ]
    })

    const abdAlMuttalib = await prisma.lineageNode.create({
        data: {
            name: 'Abd al-Muttalib', nameAr: 'عبد المطلب', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 16, parentId: hashim.id, childCount: 2, isDirectAncestor: true,
            title: 'شيبة الحمد',
            biography: 'Grandfather of the Prophet Muhammad ﷺ. He rediscovered the well of Zamzam and was the leader of Quraysh during the Year of the Elephant. Source: Ibn Hisham.',
            biographyAr: 'جد النبي محمد ﷺ. حفر بئر زمزم وكان سيد قريش في عام الفيل. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const abuTalib = await prisma.lineageNode.create({
        data: {
            name: 'Abu Talib', nameAr: 'أبو طالب', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 17, parentId: abdAlMuttalib.id, childCount: 1,
            biography: 'Uncle and protector of the Prophet Muhammad ﷺ. Father of Ali. Source: Ibn Hisham.',
            biographyAr: 'عم النبي محمد ﷺ وكافله. أبو علي بن أبي طالب. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'صدر الإسلام',
            birthYear: 535, deathYear: 619,
        }
    })

    const ali = await prisma.lineageNode.create({
        data: {
            name: 'Ali ibn Abi Talib', nameAr: 'علي بن أبي طالب', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 18, parentId: abuTalib.id, childCount: 2,
            title: 'أمير المؤمنين',
            biography: 'Cousin and son-in-law of the Prophet ﷺ. The fourth Caliph. Father of Al-Hasan and Al-Husayn. Source: Al-Tabari.',
            biographyAr: 'ابن عم النبي ﷺ وصهره. الخليفة الراشد الرابع. أبو الحسن والحسين. المصدر: الطبري.',
            birthPlace: 'مكة المكرمة', era: 'صدر الإسلام',
            birthYear: 599, deathYear: 661,
        }
    })

    const alHasan = await prisma.lineageNode.create({
        data: {
            name: 'Al-Hasan ibn Ali', nameAr: 'الحسن بن علي', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 19, parentId: ali.id, childCount: 0,
            title: 'سيد شباب أهل الجنة',
            biography: 'Eldest grandson of the Prophet ﷺ. Fifth Caliph briefly before abdicating to Muawiyah to unify Muslims. Source: Al-Tabari.',
            biographyAr: 'السبط الأكبر للنبي ﷺ. تنازل عن الخلافة لمعاوية حقناً لدماء المسلمين. المصدر: الطبري.',
            birthPlace: 'المدينة المنورة', era: 'صدر الإسلام',
            birthYear: 625, deathYear: 670,
        }
    })

    const alHusayn = await prisma.lineageNode.create({
        data: {
            name: 'Al-Husayn ibn Ali', nameAr: 'الحسين بن علي', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 19, parentId: ali.id, childCount: 0,
            title: 'سيد الشهداء',
            biography: 'Younger grandson of the Prophet ﷺ. Martyred at the Battle of Karbala. Source: Al-Tabari.',
            biographyAr: 'السبط الأصغر للنبي ﷺ. استشهد في معركة كربلاء. المصدر: الطبري.',
            birthPlace: 'المدينة المنورة', era: 'العصر الأموي',
            birthYear: 626, deathYear: 680,
        }
    })

    const alAbbas = await prisma.lineageNode.create({
        data: {
            name: 'Al-Abbas ibn Abd al-Muttalib', nameAr: 'العباس بن عبد المطلب', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 17, parentId: abdAlMuttalib.id, childCount: 1,
            biography: 'Uncle of the Prophet Muhammad ﷺ. Ancestor of the Abbasid Caliphs. Source: Al-Tabari.',
            biographyAr: 'عم النبي محمد ﷺ. جد الخلفاء العباسيين. المصدر: الطبري.',
            birthPlace: 'مكة المكرمة', era: 'صدر الإسلام',
            birthYear: 568, deathYear: 653,
        }
    })

    const abdullahIbnAbbas = await prisma.lineageNode.create({
        data: {
            name: 'Abdullah ibn Abbas', nameAr: 'عبد الله بن عباس', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED,
            generationDepth: 18, parentId: alAbbas.id, childCount: 0,
            title: 'حبر الأمة',
            biography: 'Cousin of the Prophet ﷺ. Renowned as the most knowledgeable scholar of the Quran and Tafsir. Source: Sahih Bukhari.',
            biographyAr: 'ابن عم النبي ﷺ. اشتهر بأنه حبر الأمة وأعلمها بتفسير القرآن. المصدر: صحيح البخاري.',
            birthPlace: 'مكة المكرمة', era: 'صدر الإسلام',
            birthYear: 619, deathYear: 687,
        }
    })

    await prisma.lineageNode.createMany({
        data: [
            { name: 'Banu Asad (Quraysh)', nameAr: 'بنو أسد بن عبد العزى', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 14, parentId: qusai.id, childCount: 0, biography: 'Clan of Khadija bint Khuwaylid and al-Zubayr ibn al-Awwam. Source: Ibn Hisham.', biographyAr: 'بطن خديجة بنت خويلد والزبير بن العوام. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 },
            { name: 'Banu Zuhrah', nameAr: 'بنو زهرة', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 13, parentId: kilab.id, childCount: 0, biography: 'Clan of Aminah bint Wahb (the Prophet\'s mother) and Sa\'d ibn Abi Waqqas. Source: Ibn Hisham.', biographyAr: 'بطن آمنة بنت وهب (أم النبي) وسعد بن أبي وقاص. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 },
            { name: 'Banu Taym', nameAr: 'بنو تيم', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 12, parentId: kab.id, childCount: 0, biography: 'Clan of Abu Bakr al-Siddiq and Talha ibn Ubaydullah. Source: Ibn Hisham.', biographyAr: 'بطن أبي بكر الصديق وطلحة بن عبيد الله. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 },
            { name: "Banu 'Adi", nameAr: 'بنو عدي', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 12, parentId: kab.id, childCount: 0, biography: 'Clan of Umar ibn al-Khattab. They were responsible for delegations (Sifarah) in Mecca. Source: Ibn Hisham.', biographyAr: 'بطن عمر بن الخطاب. تولوا السفارة في مكة. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 },
            { name: 'Banu Nawfal', nameAr: 'بنو نوفل', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 15, parentId: abdManaf.id, childCount: 0, biography: 'Clan of Mut\'im ibn \'Adi, who protected the Prophet after his return from Ta\'if. Source: Ibn Hisham.', biographyAr: 'بطن مطعم بن عدي الذي أجار النبي بعد عودته من الطائف. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 },
            { name: 'Banu Muttalib', nameAr: 'بنو المطلب', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 15, parentId: abdManaf.id, childCount: 0, biography: 'Closely allied with Banu Hashim. Imam Al-Shafi\'i was from this clan. Source: Ibn Hisham.', biographyAr: 'من أقرب الحلفاء لبني هاشم. الإمام الشافعي من هذا البطن. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.42, longitude: 39.82 },
        ]
    })

    // ── Rabi'a tribes ──

    const bakr = await prisma.lineageNode.create({
        data: {
            name: "Bakr ibn Wa'il", nameAr: 'بكر بن وائل', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 4, parentId: rabia.id, childCount: 1,
            biography: 'A major Rabi\'a tribe in eastern Arabia and Mesopotamia. Defeated the Sassanid Persians at the Battle of Dhi Qar (~609 CE), the first Arab victory over Persia. Source: al-Tabari.',
            biographyAr: 'قبيلة ربعية كبرى في شرق الجزيرة والعراق. هزمت الفرس الساسانيين في معركة ذي قار (~609م)، أول انتصار عربي على فارس. المصدر: الطبري.',
            birthPlace: 'البحرين (التاريخية)', era: 'ما قبل الإسلام',
            latitude: 26.07, longitude: 50.55,
        },
    })

    await prisma.lineageNode.createMany({
        data: [
            { name: 'Taghlib', nameAr: 'تغلب', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 4, parentId: rabia.id, childCount: 0, biography: 'A Christian Rabi\'a tribe in Mesopotamia. Fought the famous Basus War against Bakr. Source: al-Aghani.', biographyAr: 'قبيلة ربعية مسيحية في الجزيرة الفراتية. خاضت حرب البسوس الشهيرة ضد بكر. المصدر: الأغاني.', birthPlace: 'الجزيرة الفراتية', era: 'ما قبل الإسلام', latitude: 36.40, longitude: 42.00 },
            { name: "'Anazah", nameAr: 'عنزة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 4, parentId: rabia.id, childCount: 0, biography: 'One of the largest Arab tribes today. A Rabi\'a tribe that spread across Arabia, Syria, and Iraq. Source: Jamharat al-Nasab.', biographyAr: 'من أكبر القبائل العربية اليوم. قبيلة ربعية انتشرت في الجزيرة والشام والعراق. المصدر: جمهرة النسب.', birthPlace: 'نجد', era: 'ما قبل الإسلام', latitude: 28.00, longitude: 42.00 },
            { name: "'Abdul Qais", nameAr: 'عبد القيس', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 4, parentId: rabia.id, childCount: 0, biography: 'A Rabi\'a tribe settled in Bahrain (historical region). Among the first to accept Islam. Source: Sahih al-Bukhari, al-Tabari.', biographyAr: 'قبيلة ربعية استقرت في البحرين (الإقليم التاريخي). من أوائل من أسلم. المصدر: صحيح البخاري، الطبري.', birthPlace: 'البحرين', era: 'ما قبل الإسلام', latitude: 26.22, longitude: 50.20 },
            { name: 'Hanifa', nameAr: 'بنو حنيفة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 4, parentId: rabia.id, childCount: 0, biography: 'A Rabi\'a tribe in Yamama (central Arabia). Known for the Ridda Wars after the Prophet\'s death. Source: al-Tabari.', biographyAr: 'قبيلة ربعية في اليمامة (وسط الجزيرة). اشتهرت بحروب الردة بعد وفاة النبي ﷺ. المصدر: الطبري.', birthPlace: 'اليمامة', era: 'ما قبل الإسلام', latitude: 24.60, longitude: 46.00 },
            { name: 'Banu Shayban', nameAr: 'بنو شيبان', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: bakr.id, childCount: 0, biography: 'A prominent branch of Bakr ibn Wa\'il. Instrumental in the Arab victory at Dhi Qar against the Sassanid Empire. Source: al-Tabari.', biographyAr: 'بطن بارز من بكر بن وائل. لعبوا دوراً رئيسياً في انتصار العرب بمعركة ذي قار ضد الساسانيين. المصدر: الطبري.', birthPlace: 'العراق', era: 'ما قبل الإسلام', latitude: 31.05, longitude: 46.25 },
        ],
    })

    // ═══════════════════════════════════════════════
    // QAHTANITE BRANCH (Southern Arabs / العرب القحطانية)
    // Source: Ibn al-Kalbi; al-Hamdani, al-Iklil
    // ═══════════════════════════════════════════════

    const qahtan = await prisma.lineageNode.create({
        data: {
            name: 'Qahtan', nameAr: 'قحطان', type: NodeType.ROOT, status: NodeStatus.PUBLISHED,
            generationDepth: 0, childCount: 1,
            title: 'أبو العرب القحطانية',
            biography: 'The traditional ancestor of the Qahtanite (Southern) Arabs, also known as al-\'Arab al-\'Aribah (the "genuine Arabs"). Often identified with the biblical Joktan. All Yemeni tribes trace their ancestry to him. Source: al-Hamdani, al-Iklil; Ibn al-Kalbi.',
            biographyAr: 'الجد الجامع للعرب القحطانية، المعروفين بالعرب العاربة. يُعرّف أحيانًا بيقطان التوراتي. جميع قبائل اليمن ترجع إليه. المصدر: الهمداني، الإكليل؛ ابن الكلبي.',
            birthPlace: 'اليمن', era: 'ما قبل الإسلام',
            latitude: 15.37, longitude: 44.19,
        },
    })

    const yarub = await prisma.lineageNode.create({
        data: {
            name: "Ya'rub", nameAr: 'يعرب بن قحطان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 1, parentId: qahtan.id, childCount: 2,
            biography: 'Son of Qahtan. Considered by some traditions as the first to speak Arabic. Source: al-Hamdani.',
            biographyAr: 'ابن قحطان. يعتبره بعض المؤرخين أول من تكلم العربية. المصدر: الهمداني.',
            birthPlace: 'حضرموت', era: 'ما قبل الإسلام',
            latitude: 15.95, longitude: 48.78,
        },
    })

    const jurhum = await prisma.lineageNode.create({
        data: {
            name: 'Jurhum', nameAr: 'جرهم', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 1, parentId: qahtan.id, childCount: 0,
            biography: 'An ancient Qahtanite tribe. They settled in Mecca and allied with Prophet Ishmael. Source: Ibn Hisham.',
            biographyAr: 'قبيلة قحطانية قديمة. استقرت في مكة وصاهرت النبي إسماعيل عليه السلام. المصدر: ابن هشام.',
            birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام',
            latitude: 21.4225, longitude: 39.8262,
        },
    })

    const yashjub = await prisma.lineageNode.create({
        data: {
            name: 'Yashjub', nameAr: 'يشجب بن يعرب', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 2, parentId: yarub.id, childCount: 1,
            biography: 'Son of Ya\'rub. Father of Saba\'. Source: al-Hamdani, al-Iklil.',
            biographyAr: 'ابن يعرب وأبو سبأ. المصدر: الهمداني، الإكليل.',
            birthPlace: 'عُمان', era: 'ما قبل الإسلام',
            latitude: 23.58, longitude: 58.38,
        },
    })

    const saba = await prisma.lineageNode.create({
        data: {
            name: "Saba'", nameAr: 'سبأ بن يشجب', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 3, parentId: yashjub.id, childCount: 2,
            title: 'عبد شمس',
            biography: 'Son of Yashjub. Progenitor of all southern Arab tribes through his two sons Himyar and Kahlan. The Kingdom of Saba (Sheba) is named after him. Mentioned in the Quran (34:15). Source: al-Hamdani; Quran.',
            biographyAr: 'ابن يشجب. جدّ جميع قبائل الجنوب من ابنيه حِمير وكهلان. مملكة سبأ سُميت باسمه. ذُكر في القرآن (سبأ: 15). المصدر: الهمداني؛ القرآن.',
            birthPlace: 'مأرب', era: 'ما قبل الإسلام',
            latitude: 15.46, longitude: 45.35,
        },
    })

    // ── Saba's two sons ──

    const himyar = await prisma.lineageNode.create({
        data: {
            name: 'Himyar', nameAr: 'حِمير بن سبأ', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 4, parentId: saba.id, childCount: 2,
            biography: 'Son of Saba\'. Founded the Himyarite Kingdom which succeeded the Sabaean Kingdom. Dominated southern Arabia until the 6th century CE. Source: al-Hamdani, al-Iklil.',
            biographyAr: 'ابن سبأ. أسس المملكة الحميرية التي خلفت مملكة سبأ. سيطر على جنوب الجزيرة حتى القرن السادس الميلادي. المصدر: الهمداني، الإكليل.',
            birthPlace: 'ظفار (اليمن)', era: 'ما قبل الإسلام',
            latitude: 14.20, longitude: 44.40,
        },
    })

    const kahlan = await prisma.lineageNode.create({
        data: {
            name: 'Kahlan', nameAr: 'كهلان بن سبأ', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 4, parentId: saba.id, childCount: 7,
            biography: 'Son of Saba\'. Progenitor of the Kahlanite tribes who migrated from Yemen after the Marib Dam collapse. His descendants include the Azd, Kindah, Tayy, Madhhij, Hamdan, Lakhm, and Judham. Source: Ibn al-Kalbi.',
            biographyAr: 'ابن سبأ. جدّ قبائل كهلان التي هاجرت من اليمن بعد انهيار سد مأرب. من نسله الأزد وكندة وطيئ ومذحج وهمدان ولخم وجذام. المصدر: ابن الكلبي.',
            birthPlace: 'مأرب', era: 'ما قبل الإسلام',
            latitude: 15.46, longitude: 45.35,
        },
    })

    // ── Himyar subtribes ──
    await prisma.lineageNode.createMany({
        data: [
            { name: "Quda'a", nameAr: 'قضاعة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: himyar.id, childCount: 0, isConfirmed: false, biography: 'A major Himyarite confederation. Genealogists debate whether they belong to Himyar or Adnan. Source: Jamharat al-Nasab.', biographyAr: 'تحالف حميري كبير. اختلف النسابون في نسبتهم لحمير أو عدنان. المصدر: جمهرة النسب.', birthPlace: 'اليمن', era: 'ما قبل الإسلام', latitude: 14.80, longitude: 44.00 },
            { name: 'Zaid al-Jamhur', nameAr: 'زيد الجمهور', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: himyar.id, childCount: 0, biography: 'A Himyarite sept. Source: al-Hamdani.', biographyAr: 'بطن من حمير. المصدر: الهمداني.', birthPlace: 'اليمن', era: 'ما قبل الإسلام', latitude: 14.50, longitude: 44.20 },
        ],
    })

    // ── Kahlan subtribes ──

    const azd = await prisma.lineageNode.create({
        data: {
            name: 'Azd', nameAr: 'الأزد', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 5, parentId: kahlan.id, childCount: 4,
            biography: 'One of the largest Qahtanite tribes. After the Marib Dam collapse, the Azd migrated to Oman, Hejaz, and Syria. Branches include the Aws and Khazraj of Medina and the Ghassanids. Source: al-Hamdani; al-Tabari.',
            biographyAr: 'من أكبر قبائل قحطان. بعد انهيار سد مأرب هاجر الأزد إلى عُمان والحجاز والشام. من فروعهم الأوس والخزرج في المدينة والغساسنة. المصدر: الهمداني؛ الطبري.',
            birthPlace: 'مأرب ثم تفرقوا', era: 'ما قبل الإسلام',
            latitude: 15.46, longitude: 45.35,
        },
    })

    const hamdan = await prisma.lineageNode.create({
        data: {
            name: 'Hamdan', nameAr: 'همدان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED,
            generationDepth: 5, parentId: kahlan.id, childCount: 2,
            biography: 'A major Yemeni Kahlanite tribe. Centered in San\'a and its highlands. Strong supporters of Islam. Source: al-Hamdani, al-Iklil.',
            biographyAr: 'قبيلة كهلانية يمنية كبرى. تمركزت في صنعاء ومرتفعاتها. من أقوى أنصار الإسلام. المصدر: الهمداني، الإكليل.',
            birthPlace: 'صنعاء', era: 'ما قبل الإسلام',
            latitude: 15.37, longitude: 44.19,
        },
    })

    await prisma.lineageNode.createMany({
        data: [
            { name: 'Kindah', nameAr: 'كندة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: kahlan.id, childCount: 0, biography: 'A Kahlanite tribe from Hadramawt. Established the Kingdom of Kinda (~425-528 CE) in central Arabia. Imru\' al-Qais, the greatest pre-Islamic poet, was from Kinda. Source: al-Tabari.', biographyAr: 'قبيلة كهلانية من حضرموت. أسست مملكة كندة (~425-528م) في وسط الجزيرة. امرؤ القيس أعظم شعراء الجاهلية كان كندياً. المصدر: الطبري.', birthPlace: 'حضرموت', era: 'ما قبل الإسلام', latitude: 15.90, longitude: 48.80 },
            { name: "Tayy'", nameAr: 'طيئ', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: kahlan.id, childCount: 0, biography: 'A Kahlanite tribe settled around the Aja and Salma mountains in northern Najd. Famous for Hatim al-Ta\'i\'s legendary generosity. Source: al-Tabari.', biographyAr: 'قبيلة كهلانية استقرت حول جبلي أجا وسلمى في شمال نجد. اشتهرت بكرم حاتم الطائي الأسطوري. المصدر: الطبري.', birthPlace: 'جبل شمر', era: 'ما قبل الإسلام', latitude: 27.50, longitude: 41.70 },
            { name: 'Madhhij', nameAr: 'مذحج', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: kahlan.id, childCount: 1, biography: 'A major Kahlanite confederation in Yemen. Played a significant role in the Islamic conquests. Source: al-Hamdani.', biographyAr: 'تحالف كهلاني كبير في اليمن. لعب دوراً مهماً في الفتوحات الإسلامية. المصدر: الهمداني.', birthPlace: 'اليمن', era: 'ما قبل الإسلام', latitude: 14.80, longitude: 45.00 },
            { name: 'Lakhm', nameAr: 'لخم', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: kahlan.id, childCount: 0, biography: 'A Kahlanite tribe that founded the Lakhmid Kingdom of al-Hira (~300-602 CE) in southern Iraq. Vassals of the Sassanid Empire. Source: al-Tabari.', biographyAr: 'قبيلة كهلانية أسست مملكة اللخميين في الحيرة (~300-602م) جنوب العراق. كانوا أتباع الإمبراطورية الساسانية. المصدر: الطبري.', birthPlace: 'الحيرة، العراق', era: 'ما قبل الإسلام', latitude: 31.98, longitude: 44.45 },
            { name: 'Judham', nameAr: 'جذام', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: kahlan.id, childCount: 0, biography: 'A Kahlanite tribe that migrated to Palestine and Egypt. Source: Ibn al-Kalbi.', biographyAr: 'قبيلة كهلانية هاجرت إلى فلسطين ومصر. المصدر: ابن الكلبي.', birthPlace: 'فلسطين', era: 'ما قبل الإسلام', latitude: 31.90, longitude: 35.20 },
            { name: 'Hashid', nameAr: 'حاشد', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: hamdan.id, childCount: 0, biography: 'One of the two major branches of the Hamdan tribe. A powerful tribal confederation in Yemen. Source: al-Hamdani.', biographyAr: 'أحد الفرعين الرئيسيين لقبيلة همدان. تحالف قبلي قوي في اليمن. المصدر: الهمداني.', birthPlace: 'اليمن', era: 'ما قبل الإسلام', latitude: 15.60, longitude: 44.00 },
            { name: 'Bakil', nameAr: 'بكيل', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: hamdan.id, childCount: 0, biography: 'The other major branch of the Hamdan tribe. A historically significant pillar of Yemeni society. Source: al-Hamdani.', biographyAr: 'الفرع الرئيسي الآخر لقبيلة همدان. ركيزة تاريخية مهمة للمجتمع اليمني. المصدر: الهمداني.', birthPlace: 'اليمن', era: 'ما قبل الإسلام', latitude: 15.80, longitude: 44.30 },
        ],
    })

    const madhhijId = await prisma.lineageNode.findFirst({ where: { name: 'Madhhij' } }).then(n => n?.id);
    if (madhhijId) {
        await prisma.lineageNode.create({
            data: { name: 'Banu al-Harith', nameAr: 'بنو الحارث بن كعب', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: madhhijId, childCount: 0, biography: 'A major Madhhij tribe in Najran. Included a significant Christian population before Islam. Source: Ibn Hisham.', biographyAr: 'قبيلة رئيسية من مذحج في نجران. ضمت نسبة كبيرة من المسيحيين قبل الإسلام. المصدر: ابن هشام.', birthPlace: 'نجران', era: 'ما قبل الإسلام', latitude: 17.50, longitude: 44.10 }
        })
    }

    // ── Azd subtribes ──
    await prisma.lineageNode.createMany({
        data: [
            { name: 'Aws', nameAr: 'الأوس', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: azd.id, childCount: 0, biography: 'An Azdite tribe of Yathrib (Medina). Together with the Khazraj, they formed the Ansar who supported the Prophet. Source: Ibn Hisham, al-Sirah.', biographyAr: 'قبيلة أزدية في يثرب (المدينة). شكّلوا مع الخزرج الأنصار الذين نصروا النبي ﷺ. المصدر: ابن هشام، السيرة.', birthPlace: 'يثرب (المدينة المنورة)', era: 'ما قبل الإسلام', latitude: 24.47, longitude: 39.61 },
            { name: 'Khazraj', nameAr: 'الخزرج', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: azd.id, childCount: 0, biography: 'An Azdite tribe of Yathrib. The larger of the two Ansar tribes. Sa\'d ibn \'Ubadah was their chief. Source: Ibn Hisham.', biographyAr: 'قبيلة أزدية في يثرب. أكبر القبيلتين الأنصاريتين. سعد بن عبادة كان سيدهم. المصدر: ابن هشام.', birthPlace: 'يثرب (المدينة المنورة)', era: 'ما قبل الإسلام', latitude: 24.47, longitude: 39.61 },
            { name: 'Ghassan', nameAr: 'غسان', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: azd.id, childCount: 0, biography: 'An Azdite tribe that established the Ghassanid Kingdom (~220-638 CE) in the Levant as Byzantine vassals. Source: al-Tabari.', biographyAr: 'قبيلة أزدية أسست مملكة الغساسنة (~220-638م) في الشام كأتباع للبيزنطيين. المصدر: الطبري.', birthPlace: 'الشام', era: 'ما قبل الإسلام', latitude: 33.51, longitude: 36.29 },
            { name: "Khuza'a", nameAr: 'خزاعة', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: azd.id, childCount: 0, biography: 'An Azdite tribe that ruled Mecca before Quraysh. They were allies of the Prophet Muhammad ﷺ. Source: Ibn Hisham.', biographyAr: 'قبيلة أزدية حكمت مكة قبل قريش. كانوا حلفاء للنبي ﷺ. المصدر: ابن هشام.', birthPlace: 'مكة المكرمة', era: 'ما قبل الإسلام', latitude: 21.4225, longitude: 39.8262 },
        ],
    })

    // ═══════════════════════════════════════════════
    // DETAILED SUBTRIBES EXPANSION
    // ═══════════════════════════════════════════════

    console.log('🌱 Expanding subtribes...')

    // ── Tamim Branches ──
    const tamimNode = await prisma.lineageNode.findFirst({ where: { name: 'Tamim' } });
    if (tamimNode) {
        const hanzala = await prisma.lineageNode.create({
            data: { name: 'Banu Hanzala', nameAr: 'بنو حنظلة', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: tamimNode.id, childCount: 2, biography: 'A major branch of Tamim. Home to the sub-clans of Darim and Yarbu. Source: Ibn al-Kalbi.', biographyAr: 'فرع رئيسي من تميم. يضم بطون دارم ويربوع. المصدر: ابن الكلبي.', birthPlace: 'اليمامة', era: 'ما قبل الإسلام' }
        });

        await prisma.lineageNode.createMany({
            data: [
                { name: 'Banu Darim', nameAr: 'بنو دارم', type: NodeType.FAMILY, status: NodeStatus.PUBLISHED, generationDepth: 7, parentId: hanzala.id, childCount: 0, biography: 'Aristocratic clan of Tamim known for their nobility. Source: Jamharat al-Nasab.', biographyAr: 'بيت الشرف في تميم، عُرفوا بالنبل والسيادة. المصدر: جمهرة النسب.', birthPlace: 'نجد', era: 'ما قبل الإسلام' },
                { name: 'Banu Yarbu', nameAr: 'بنو يربوع', type: NodeType.FAMILY, status: NodeStatus.PUBLISHED, generationDepth: 7, parentId: hanzala.id, childCount: 0, biography: 'Warrior clan of Tamim. Famous for their cavalry and poets. Source: al-Aghani.', biographyAr: 'فرسان تميم وشعراؤهم. اشتهروا بالخيل والشجاعة. المصدر: الأغاني.', birthPlace: 'نجد', era: 'ما قبل الإسلام' }
            ]
        });
    }

    // ── Azd Branches ──
    if (azd) {
        await prisma.lineageNode.createMany({
            data: [
                { name: 'Ghamid', nameAr: 'غامد', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: azd.id, childCount: 0, biography: 'An Azdite tribe settled in the Sarawat Mountains. Source: al-Hamdani.', biographyAr: 'قبيلة أزدية استقرت في جبال السروات. المصدر: الهمداني.', birthPlace: 'الباحة', era: 'ما قبل الإسلام', latitude: 19.9, longitude: 41.5 },
                { name: 'Zahran', nameAr: 'زهران', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: azd.id, childCount: 0, biography: 'Brother tribe to Ghamid, also in the Sarawat. Daws was a branch of Zahran (tribe of Abu Hurayrah). Source: al-Hamdani.', biographyAr: 'شقيق غامد في السروات. منها دوس (قبيلة أبي هريرة). المصدر: الهمداني.', birthPlace: 'الباحة', era: 'ما قبل الإسلام', latitude: 20.0, longitude: 41.3 },
                { name: 'Bariq', nameAr: 'بارق', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: azd.id, childCount: 0, biography: 'Azdite tribe in Asir. Known for their early conversion to Islam. Source: Ibn Sa\'d.', biographyAr: 'قبيلة أزدية في عسير. عُرفوا بإسلامهم المبكر. المصدر: ابن سعد.', birthPlace: 'عسير', era: 'ما قبل الإسلام', latitude: 18.9, longitude: 41.9 },
                { name: 'Banu Daws', nameAr: 'دوس', type: NodeType.CLAN, status: NodeStatus.PUBLISHED, generationDepth: 7, parentId: azd.id, childCount: 0, biography: 'A branch of Zahran. The tribe of Abu Hurayrah. Source: Ibn Hisham.', biographyAr: 'فرع من زهران. قبيلة أبي هريرة. المصدر: ابن هشام.', birthPlace: 'الباحة', era: 'ما قبل الإسلام', latitude: 20.1, longitude: 41.2 }
            ]
        });
    }

    // ── Madhhij Branches ──
    if (madhhijId) {
        await prisma.lineageNode.createMany({
            data: [
                { name: 'Banu Murad', nameAr: 'مراد', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: madhhijId, childCount: 0, biography: 'A warrior tribe of Madhhij. Famous for their rebellion and later role in conquests. Source: al-Tabari.', biographyAr: 'قبيلة محاربة من مذحج. اشتهرت بفروسيتها ودورها في الفتوحات. المصدر: الطبري.', birthPlace: 'اليمن', era: 'ما قبل الإسلام', latitude: 15.5, longitude: 45.8 },
                { name: 'Banu Zubayd', nameAr: 'زبيد', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: madhhijId, childCount: 0, biography: 'Famous Madhhij clan, home of the knight Amr ibn Ma\'adi Yakrib. Source: al-Aghani.', biographyAr: 'قبيلة مذحجية، منها الفارس عمرو بن معد يكرب. المصدر: الأغاني.', birthPlace: 'اليمن', era: 'ما قبل الإسلام', latitude: 14.5, longitude: 44.8 }
            ]
        });
    }

    // ── Himyar Branches ──
    if (himyar) {
        await prisma.lineageNode.createMany({
            data: [
                { name: 'Yafi', nameAr: 'يافع', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 5, parentId: himyar.id, childCount: 0, biography: 'A major Himyarite tribe in the southern highlands. Known for their distinct identity and dialect. Source: al-Hamdani.', biographyAr: 'قبيلة حميرية كبرى في المرتفعات الجنوبية. عُرفت بلهجتها وهويتها المميزة. المصدر: الهمداني.', birthPlace: 'يافع، اليمن', era: 'ما قبل الإسلام', latitude: 13.9, longitude: 45.2 }
            ]
        });
    }

    // ── Notable Figures Expansion ──
    const absNode = await prisma.lineageNode.findFirst({ where: { name: "'Abs" } });
    const kindaNode = await prisma.lineageNode.findFirst({ where: { name: 'Kindah' } });
    const tayyNode = await prisma.lineageNode.findFirst({ where: { name: "Tayy'" } });
    const dawsNode = await prisma.lineageNode.findFirst({ where: { name: 'Banu Daws' } });

    await prisma.lineageNode.createMany({
        data: [
            ...(absNode ? [{ name: 'Antarah ibn Shaddad', nameAr: 'عنترة بن شداد', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 7, parentId: absNode.id, childCount: 0, title: 'الفارس الشاعر', biography: 'Pre-Islamic warrior and poet. Author of one of the Mu\'allaqat. Famous for his chivalry and love for Abla. Source: al-Aghani.', biographyAr: 'فارس وشاعر جاهلي. صاحب إحدى المعلقات. اشتهر بفروسيته وحبه لعبلة. المصدر: الأغاني.', birthPlace: 'نجد', era: 'ما قبل الإسلام', birthYear: 525, deathYear: 608 }] : []),
            ...(kindaNode ? [{ name: "Imru' al-Qais", nameAr: 'امرؤ القيس', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: kindaNode.id, childCount: 0, title: 'الملك الضليل', biography: 'The most renowned pre-Islamic poet. Son of the last King of Kinda. Author of the most famous Mu\'allaqa. Source: al-Aghani.', biographyAr: 'أشهر شعراء الجاهلية. ابن آخر ملوك كندة. صاحب المعلقة الشهيرة. المصدر: الأغاني.', birthPlace: 'نجد', era: 'ما قبل الإسلام', birthYear: 501, deathYear: 544 }] : []),
            ...(tayyNode ? [{ name: "Hatim al-Ta'i", nameAr: 'حاتم الطائي', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 6, parentId: tayyNode.id, childCount: 0, title: 'أجود العرب', biography: 'Legendary figure of generosity in Arab tradition. His son Adi became a companion of the Prophet. Source: al-Aghani.', biographyAr: 'مضرب المثل في الجود والكرم عند العرب. ابنه عدي صار صحابياً. المصدر: الأغاني.', birthPlace: 'حائل', era: 'ما قبل الإسلام', deathYear: 578 }] : []),
             ...(dawsNode ? [{ name: "Abu Hurayrah", nameAr: 'أبو هريرة', type: NodeType.INDIVIDUAL, status: NodeStatus.PUBLISHED, generationDepth: 8, parentId: dawsNode.id, childCount: 0, title: 'راوية الإسلام', biography: 'The most prolific narrator of Hadith. Embraced Islam in the year of Khaybar. Source: Sahih al-Bukhari.', biographyAr: 'أكثر الصحابة رواية للحديث. أسلم عام خيبر. المصدر: صحيح البخاري.', birthPlace: 'الباحة', era: 'صدر الإسلام', birthYear: 603, deathYear: 681 }] : []),
        ]
    });


    // ═══════════════════════════════════════════════
    // LEVANT & MODERN TRIBES (Syria, Jordan, etc.)
    // ═══════════════════════════════════════════════

    const tayyId = await prisma.lineageNode.findFirst({ where: { name: "Tayy'" } }).then(n => n?.id);
    const anazahId = await prisma.lineageNode.findFirst({ where: { name: "'Anazah" } }).then(n => n?.id);
    const tamimId = await prisma.lineageNode.findFirst({ where: { name: 'Tamim' } }).then(n => n?.id);
    const qudaaId = await prisma.lineageNode.findFirst({ where: { name: "Quda'a" } }).then(n => n?.id);
    const qaysAylanId = await prisma.lineageNode.findFirst({ where: { name: "Qays 'Aylan" } }).then(n => n?.id);

    const levantTribes = [];
    if (tayyId) {
        levantTribes.push({ name: 'Shammar', nameAr: 'شمر', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 10, parentId: tayyId, childCount: 0, biography: 'A huge confederation descended from Tayy. Spread across Najd, Iraq, and Syria. Source: Ibn Khaldun.', biographyAr: 'تحالف ضخم ينحدر من طيئ. ينتشر في نجد والعراق وسوريا. المصدر: ابن خلدون.', birthPlace: 'حائل / الشام', era: 'العصور الوسطى', latitude: 27.52, longitude: 41.69 });
        levantTribes.push({ name: 'Bani Sakhr', nameAr: 'بني صخر', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 10, parentId: tayyId, childCount: 0, biography: 'A prominent Jordanian Bedouin tribe of Tayyite descent. Played a vital role in Jordan\'s history. Source: Peake Pasha.', biographyAr: 'قبيلة بدوية أردنية بارزة من أصول طائية. لعبت دوراً حيوياً في تاريخ الأردن. المصدر: بيك باشا.', birthPlace: 'الأردن', era: 'العصور الحديثة', latitude: 31.5, longitude: 36.2 });
    }
    if (anazahId) {
        levantTribes.push({ name: 'Al-Ruwailah', nameAr: 'الرولة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 9, parentId: anazahId, childCount: 0, biography: 'The largest branch of the \'Anazah confederation in the Syrian desert. Famous for their camel breeding. Source: Alois Musil.', biographyAr: 'أكبر فروع تحالف عنزة في بادية الشام. اشتهروا بتربية الإبل والفروسية. المصدر: ألويس موسيل.', birthPlace: 'بادية الشام', era: 'العصور الحديثة', latitude: 33.0, longitude: 38.0 });
    }
    if (tamimId) {
        levantTribes.push({ name: 'Al-Majali', nameAr: 'المجالي', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 10, parentId: tamimId, childCount: 0, biography: 'One of the most prominent political families and tribes in Jordan, based in Karak. Trace their lineage to Banu Tamim. Source: Frederick Peake.', biographyAr: 'من أبرز العائلات والقبائل السياسية في الأردن، ومقرها الكرك. يرجع نسبهم إلى بني تميم. المصدر: فريدريك بيك.', birthPlace: 'الكرك، الأردن', era: 'العصور الحديثة', latitude: 31.18, longitude: 35.70 });
    }
    if (hashim.id) {
        levantTribes.push({ name: 'Bani Hassan', nameAr: 'بني حسن', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 20, parentId: hashim.id, childCount: 0, biography: 'Often called the "Million-Man Tribe" in Jordan. They claim Ashraf (Hashemite) descent. Centered in Zarqa and Mafraq.', biographyAr: 'تُعرف باسم "قبيلة المليون" في الأردن. ينسبون أنفسهم للأشراف بني هاشم. يتركزون في الزرقاء والمفرق.', birthPlace: 'شمال الأردن', era: 'العصور الحديثة', latitude: 32.25, longitude: 36.0 });
        levantTribes.push({ name: 'Al-Baggara', nameAr: 'البقارة', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 20, parentId: hashim.id, childCount: 0, biography: 'A major Syrian tribe along the Euphrates. Claim descent from Imam Muhammad al-Baqir. Source: Syrian tribal genealogies.', biographyAr: 'قبيلة سورية كبرى على طول نهر الفرات. ينسبون أنفسهم للإمام محمد الباقر. المصدر: أنساب القبائل السورية.', birthPlace: 'دير الزور، سوريا', era: 'العصور الحديثة', latitude: 35.33, longitude: 40.14 });
    }
    if (qudaaId) {
        levantTribes.push({ name: 'Al-Huwaitat', nameAr: 'الحويطات', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 10, parentId: qudaaId, childCount: 0, biography: 'A large tribe in southern Jordan and Tabuk. Played a major role in the Great Arab Revolt with Auda Abu Tayi.', biographyAr: 'قبيلة كبيرة في جنوب الأردن وتبوك. لعبت دوراً كبيراً في الثورة العربية الكبرى مع عودة أبو تايه.', birthPlace: 'جنوب الأردن', era: 'العصور الحديثة', latitude: 29.8, longitude: 35.3 });
    }
    if (madhhijId) {
        levantTribes.push({ name: 'Al-Aqidat', nameAr: 'العقيدات', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 10, parentId: madhhijId, childCount: 0, biography: 'The largest tribe in the Syrian Euphrates valley, tracing their lineage to Zubayd from Madhhij. Source: Max von Oppenheim.', biographyAr: 'أكبر قبيلة في وادي الفرات السوري، ويرجع نسبهم إلى زبيد من مذحج. المصدر: ماكس فون أوبنهايم.', birthPlace: 'دير الزور، سوريا', era: 'العصور الحديثة', latitude: 35.0, longitude: 40.4 });
    }
    if (qaysAylan.id) {
        levantTribes.push({ name: 'Al-Adwan', nameAr: 'العدوان', type: NodeType.TRIBE, status: NodeStatus.PUBLISHED, generationDepth: 9, parentId: qaysAylan.id, childCount: 0, biography: 'A dominant tribe in the Balqa region of Jordan. They ruled the Jordan Valley for centuries before the modern state.', biographyAr: 'قبيلة مهيمنة في منطقة البلقاء بالأردن. حكموا غور الأردن لقرون قبل الدولة الحديثة.', birthPlace: 'البلقاء، الأردن', era: 'العصور الحديثة', latitude: 31.8, longitude: 35.8 });
    }

    if (levantTribes.length > 0) {
        await prisma.lineageNode.createMany({
            data: levantTribes
        });
    }

    console.log('✅ Created all lineage nodes')

    // ═══════════════════════════════════════════════
    // HISTORICAL EVENTS
    // Source: al-Tabari, Tarikh; Ibn Hisham, al-Sirah
    // ═══════════════════════════════════════════════
    console.log('\n📜 Creating historical events...')

    const khuzaa = await prisma.lineageNode.findFirst({ where: { name: "Khuza'a" } });
    const abs = await prisma.lineageNode.findFirst({ where: { name: "'Abs" } });
    const ghassan = await prisma.lineageNode.findFirst({ where: { name: 'Ghassan' } });

    const umayyaId = await prisma.lineageNode.findFirst({ where: { name: 'Banu Umayya' } }).then(n => n?.id);

    await prisma.historicalEvent.createMany({
        data: [
            { nodeId: saba.id, title: 'Kingdom of Saba Founded', titleAr: 'تأسيس مملكة سبأ', description: 'The Kingdom of Saba (Sheba) was established in Ma\'rib, featuring the Great Dam — one of the engineering wonders of the ancient world. Source: inscriptions; al-Hamdani.', descriptionAr: 'تأسيس مملكة سبأ في مأرب، وبناء سد مأرب العظيم — أحد عجائب الهندسة في العالم القديم. المصدر: النقوش؛ الهمداني.', yearCE: -1000, eventType: EventType.FOUNDING, location: 'مأرب، اليمن', latitude: 15.46, longitude: 45.35 },
            { nodeId: saba.id, title: 'Marib Dam Collapse (Sayl al-\'Arim)', titleAr: 'انهيار سد مأرب (سيل العَرِم)', description: 'The collapse of the Great Dam of Ma\'rib triggered mass migration of Yemeni tribes. Referenced in the Quran (34:16). Source: Quran; al-Tabari.', descriptionAr: 'انهيار سد مأرب أدى إلى هجرة جماعية للقبائل اليمنية. ورد ذكره في القرآن (سبأ: 16). المصدر: القرآن؛ الطبري.', yearCE: 575, eventType: EventType.MIGRATION, location: 'مأرب، اليمن', latitude: 15.43, longitude: 45.33 },
            { nodeId: azd.id, title: 'Azd Migration Northward', titleAr: 'هجرة الأزد شمالاً', description: 'After the Marib Dam collapse, Azd tribes dispersed: some to Oman, others to Yathrib (Medina), and the Ghassanids to Syria. Source: al-Tabari.', descriptionAr: 'بعد انهيار السد تفرق الأزد: بعضهم إلى عُمان، وآخرون إلى يثرب (المدينة)، والغساسنة إلى الشام. المصدر: الطبري.', yearCE: 580, eventType: EventType.MIGRATION, location: 'من اليمن إلى الشمال', latitude: 19.50, longitude: 43.00 },
            { nodeId: bakr.id, title: 'Battle of Dhi Qar', titleAr: 'يوم ذي قار', description: 'The first recorded Arab victory over a foreign empire. Banu Bakr ibn Wa\'il defeated the Sassanid Persian army. The Prophet ﷺ said: "This is the first day the Arabs took revenge on the Persians." Source: al-Tabari.', descriptionAr: 'أول انتصار عربي مسجل على إمبراطورية أجنبية. هزم بنو بكر بن وائل الجيش الساساني الفارسي. قال النبي ﷺ: "هذا أول يوم انتصفت فيه العرب من العجم." المصدر: الطبري.', yearCE: 609, eventType: EventType.BATTLE, location: 'ذي قار، العراق', latitude: 31.05, longitude: 46.25 },
            { nodeId: quraysh.id, title: 'Qusai Unifies Quraysh Authority over Mecca', titleAr: 'توحيد قصي لسلطة قريش على مكة', description: 'Qusai ibn Kilab unified Quraysh custodianship of the Kaaba and established the Dar al-Nadwa (council house). Source: Ibn Hisham.', descriptionAr: 'وحّد قصي بن كلاب سدانة قريش للكعبة وأسس دار الندوة. المصدر: ابن هشام.', yearCE: 480, eventType: EventType.FOUNDING, location: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262 },
            { nodeId: hashim.id, title: "Hashim Establishes the Trade Caravans (Ilaf)", titleAr: 'تأسيس هاشم لرحلة الإيلاف', description: 'Hashim ibn Abd Manaf established the Ilaf trade agreements and the winter-summer caravan routes (referenced in Surah Quraysh). Source: Ibn Hisham.', descriptionAr: 'أسس هاشم بن عبد مناف اتفاقيات الإيلاف التجارية ورحلتي الشتاء والصيف (المذكورتين في سورة قريش). المصدر: ابن هشام.', yearCE: 500, eventType: EventType.CULTURAL, location: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262 },
            { nodeId: himyar.id, title: 'Rise of the Himyarite Kingdom', titleAr: 'قيام المملكة الحميرية', description: 'Himyar displaced Saba as the dominant power in Yemen, unifying southern Arabia under one kingdom. Source: al-Hamdani.', descriptionAr: 'أزاح حمير سبأ كقوة مهيمنة في اليمن، وموحداً جنوب الجزيرة تحت مملكة واحدة. المصدر: الهمداني.', yearCE: 110, eventType: EventType.FOUNDING, location: 'ظفار، اليمن', latitude: 14.20, longitude: 44.40 },
            { nodeId: nizar.id, title: 'Nizar Tribal Confederation', titleAr: 'تحالف بني نزار', description: 'Formation of the Nizari confederation controlling central and northern Arabia. Source: Jamharat al-Nasab.', descriptionAr: 'تشكيل تحالف نزار للسيطرة على وسط وشمال الجزيرة العربية. المصدر: جمهرة النسب.', yearCE: 300, eventType: EventType.ALLIANCE, location: 'نجد', latitude: 24.63, longitude: 46.72 },
            { nodeId: yarub.id, title: 'Founding of the Hadramawt Kingdom', titleAr: 'تأسيس مملكة حضرموت', description: 'The ancient kingdom of Hadramawt was established by descendants of Ya\'rub. Source: inscriptions; al-Hamdani.', descriptionAr: 'تأسيس مملكة حضرموت القديمة من قبل أبناء يعرب. المصدر: النقوش؛ الهمداني.', yearCE: -800, eventType: EventType.FOUNDING, location: 'حضرموت، اليمن', latitude: 15.95, longitude: 48.78 },
            { nodeId: maad.id, title: 'Hejaz Incense Trade Route', titleAr: 'طريق تجارة البخور في الحجاز', description: 'Ma\'ad tribes controlled the vital incense route connecting Yemen to the Levant via the Hejaz. Source: al-Tabari.', descriptionAr: 'سيطرت قبائل معد على طريق البخور الحيوي الواصل بين اليمن والشام عبر الحجاز. المصدر: الطبري.', yearCE: 200, eventType: EventType.CULTURAL, location: 'الحجاز', latitude: 24.47, longitude: 39.61 },
            { nodeId: adnan.id, title: 'Pre-Islamic Hajj Pilgrimage', titleAr: 'حج ما قبل الإسلام', description: 'The pre-Islamic Hajj tradition was maintained through the descendants of Adnan in Mecca. Source: Ibn Hisham.', descriptionAr: 'توارث أبناء عدنان تقاليد الحج في مكة المكرمة. المصدر: ابن هشام.', yearCE: -200, eventType: EventType.CULTURAL, location: 'مكة المكرمة', latitude: 21.42, longitude: 39.83 },
            { nodeId: qahtan.id, title: 'Suq Ukaz Poetry Market', titleAr: 'سوق عكاظ', description: 'The famous pre-Islamic market and poetry festival where tribal poets competed. A major cultural institution of the Arabs. Source: al-Aghani.', descriptionAr: 'السوق الجاهلي الشهير ومهرجان الشعر حيث تنافس شعراء القبائل. مؤسسة ثقافية عربية كبرى. المصدر: الأغاني.', yearCE: 500, eventType: EventType.CULTURAL, location: 'قرب الطائف', latitude: 21.20, longitude: 40.50 },
            ...(abs ? [{ nodeId: abs.id, title: 'War of Dahis and Ghabra', titleAr: 'حرب داحس والغبراء', description: 'Famous pre-Islamic 40-year war between Banu Abs and Banu Dhubyan. Triggered by a horse race dispute. Source: al-Aghani.', descriptionAr: 'أشهر حروب الجاهلية، استمرت 40 عاماً بين عبس وذبيان بسبب سباق خيل. المصدر: الأغاني.', yearCE: 568, eventType: EventType.BATTLE, location: 'نجد', latitude: 26.00, longitude: 43.00 }] : []),
            ...(khuzaa ? [{ nodeId: khuzaa.id, title: "Khuza'a Takes Mecca", titleAr: 'سيطرة خزاعة على مكة', description: 'Khuza\'a displaced Jurhum to take control of Mecca, until Qusai ibn Kilab eventually regained it for Quraysh. Source: Ibn Hisham.', descriptionAr: 'أزاحت خزاعة جرهم للسيطرة على مكة، حتى استعادها قصي بن كلاب لقريش. المصدر: ابن هشام.', yearCE: 200, eventType: EventType.BATTLE, location: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262 }] : []),
            ...(umayyaId ? [{ nodeId: umayyaId, title: "Umayyad Caliphate Founded", titleAr: 'تأسيس الخلافة الأموية', description: 'Muawiya I, from the Banu Umayya clan, formally establishes the Umayyad Caliphate governed from Damascus. Source: al-Tabari.', descriptionAr: 'مُعاوية الأول، من بني أمية، يؤسس رسمياً الخلافة الأموية وعاصمتها دمشق. المصدر: الطبري.', yearCE: 661, eventType: EventType.FOUNDING, location: 'دمشق', latitude: 33.5138, longitude: 36.2765 }] : []),
            { nodeId: abdAlMuttalib.id, title: 'Year of the Elephant', titleAr: 'عام الفيل', description: 'Abraha\'s army attempted to destroy the Kaaba but was defeated by birds sent by Allah. The Prophet Muhammad ﷺ was born this year. Source: Quran, Ibn Hisham.', descriptionAr: 'حاول جيش أبرهة هدم الكعبة ولكن هُزم بطيور أبابيل. وُلد النبي محمد ﷺ في هذا العام. المصدر: القرآن الكريم، ابن هشام.', yearCE: 570, eventType: EventType.BATTLE, location: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262 },
            { nodeId: ibrahim.id, title: 'Construction of the Kaaba', titleAr: 'بناء الكعبة المشرفة', description: 'Ibrahim and his son Isma\'il raised the foundations of the Kaaba in Mecca. Source: Quran.', descriptionAr: 'رفع إبراهيم وابنه إسماعيل قواعد الكعبة في مكة. المصدر: القرآن الكريم.', yearCE: -2000, eventType: EventType.FOUNDING, location: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262 },
            { nodeId: quraysh.id, title: 'Fijar Wars', titleAr: 'حرب الفجار', description: 'A series of conflicts between Quraysh/Kinanah and Hawazin. The Prophet ﷺ participated in them during his youth. Source: Ibn Hisham.', descriptionAr: 'سلسلة من المعارك بين قريش/كنانة وهوازن. شارك فيها النبي ﷺ في شبابه. المصدر: ابن هشام.', yearCE: 590, eventType: EventType.BATTLE, location: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262 },
            { nodeId: quraysh.id, title: 'Battle of Yarmouk', titleAr: 'معركة اليرموك', description: 'A major battle between the Muslim Arab forces and the Byzantine Empire. It ended Byzantine rule in Syria. Khalid ibn al-Walid was the commander. Source: al-Tabari.', descriptionAr: 'معركة كبرى بين المسلمين والروم. أنهت الحكم البيزنطي في الشام. كان خالد بن الوليد القائد. المصدر: الطبري.', yearCE: 636, eventType: EventType.BATTLE, location: 'نهر اليرموك', latitude: 32.81, longitude: 35.95 },
            { nodeId: quraysh.id, title: 'Conquest of Mecca', titleAr: 'فتح مكة', description: 'The Prophet Muhammad ﷺ and his followers entered Mecca peacefully, ending Quraysh opposition and cleansing the Kaaba of idols. Source: Ibn Hisham.', descriptionAr: 'دخل النبي محمد ﷺ وأصحابه مكة بسلام، منهين معارضة قريش ومطهرين الكعبة من الأصنام. المصدر: ابن هشام.', yearCE: 630, eventType: EventType.BATTLE, location: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262 },
            ...(bakr ? [{ nodeId: bakr.id, title: 'Battle of al-Qadisiyyah', titleAr: 'معركة القادسية', description: 'Decisive battle between the Arab Muslim army and the Sassanid Persian Empire. Resulted in the conquest of Iraq. Source: al-Tabari.', descriptionAr: 'معركة حاسمة بين المسلمين والفرس. أدت إلى فتح العراق. المصدر: الطبري.', yearCE: 636, eventType: EventType.BATTLE, location: 'القادسية، العراق', latitude: 31.55, longitude: 44.55 }] : []),
            ...(ghassan ? [{ nodeId: ghassan.id, title: "Battle of Mu'tah", titleAr: 'غزوة مؤتة', description: 'First military engagement between Muslim Arabs and the Byzantine Empire (and their Ghassanid vassals). Source: Ibn Hisham.', descriptionAr: 'أول مواجهة عسكرية بين العرب المسلمين والإمبراطورية البيزنطية (وحلفائهم الغساسنة). المصدر: ابن هشام.', yearCE: 629, eventType: EventType.BATTLE, location: 'مؤتة، الأردن', latitude: 31.06, longitude: 35.70 }] : []),
        ],
    })
    console.log('✅ Created historical events')

    // ═══════════════════════════════════════════════
    // DNA MARKERS
    // Source: FamilyTreeDNA projects; published genetic studies
    // ═══════════════════════════════════════════════
    console.log('\n🧬 Creating DNA markers...')

    const hawazinId = await prisma.lineageNode.findFirst({ where: { name: 'Hawazin' } }).then(n => n?.id);
    const tamimMarkerNode = await prisma.lineageNode.findFirst({ where: { name: 'Tamim' } });
    const kindaMarkerNode = await prisma.lineageNode.findFirst({ where: { name: 'Kindah' } });
    const anazahMarkerNode = await prisma.lineageNode.findFirst({ where: { name: "'Anazah" } });
    const shammarMarkerNode = await prisma.lineageNode.findFirst({ where: { name: 'Shammar' } });

    await prisma.dnaMarker.createMany({
        data: [
            { nodeId: quraysh.id, haplogroup: 'J1-FGC8712', type: DnaType.Y_DNA, subClade: 'J1-L859', confidence: 0.85, source: 'FamilyTreeDNA Quraysh Project', studyUrl: 'https://www.familytreedna.com/groups/quraysh', notes: 'FGC8712 and L859 are markers associated with Qurayshi lineages per FTDNA project data.' },
            { nodeId: hashim.id, haplogroup: 'J1-FGC8703', type: DnaType.Y_DNA, subClade: 'J1-L859 > FGC8703', confidence: 0.80, source: 'FamilyTreeDNA Hashemite Project', studyUrl: 'https://www.familytreedna.com/groups/hashemite', notes: 'FGC8703 subclade identified in Hashemite lineage studies.' },
            ...(tamimMarkerNode ? [{ nodeId: tamimMarkerNode.id, haplogroup: 'J1-L222.2', type: DnaType.Y_DNA, subClade: 'J1-M267 > L222.2', confidence: 0.70, source: 'FamilyTreeDNA Tamim Project', notes: 'L222.2 is frequently found in Tamimi branches in Najd.' }] : []),
            ...(kindaMarkerNode ? [{ nodeId: kindaMarkerNode.id, haplogroup: 'J1-M267', type: DnaType.Y_DNA, subClade: 'J1-M267', confidence: 0.65, source: 'Generic Arabian DNA', notes: 'Kinda carries basal J1 markers typical of southern Arabian tribes.' }] : []),
            ...(anazahMarkerNode ? [{ nodeId: anazahMarkerNode.id, haplogroup: 'J1-FGC4415', type: DnaType.Y_DNA, subClade: 'J1-M267 > P58 > FGC2', confidence: 0.72, source: 'FamilyTreeDNA Anazah Project', notes: 'FGC4415 is a major cluster within the Anazah confederation.' }] : []),
            ...(shammarMarkerNode ? [{ nodeId: shammarMarkerNode.id, haplogroup: 'J1-FGC4453', type: DnaType.Y_DNA, subClade: 'J1-M267 > P58 > FGC5', confidence: 0.70, source: 'FamilyTreeDNA Shammar Project', notes: 'FGC4453 is frequently observed in Shammar lineages.' }] : []),
            { nodeId: azd.id, haplogroup: 'J1-Z640', type: DnaType.Y_DNA, subClade: 'J1-M267 > Z640', confidence: 0.82, sampleSize: 150, source: 'FamilyTreeDNA Azd Tribe Project', studyUrl: 'https://www.familytreedna.com/groups/azd-tribe', notes: 'The majority of Azd branches carry J1-Z640 across Saudi Arabia, Yemen, UAE, and Oman.' },
            { nodeId: adnan.id, haplogroup: 'J1-M267', type: DnaType.Y_DNA, subClade: 'J1-P58', confidence: 0.75, source: 'Multiple genetic studies', studyUrl: 'https://www.familytreedna.com/groups/j1-m267', notes: 'J1-M267 is the predominant haplogroup among Arabian Peninsula populations. Most Adnanite tribes fall under J1-P58 downstream subclades.' },
            { nodeId: qahtan.id, haplogroup: 'J1-M267', type: DnaType.Y_DNA, subClade: 'J1-P58 > L222.2', confidence: 0.70, source: 'Genetic studies on Yemeni populations', notes: 'Qahtanite tribes show high frequency of J1, with Yemen reaching ~72% J1 frequency.' },
            { nodeId: kinanah.id, haplogroup: 'J1-FGC8712', type: DnaType.Y_DNA, subClade: 'J1-M267 > P58 > FGC8712', confidence: 0.78, source: 'FamilyTreeDNA Arabian DNA Project', notes: 'Kinanah lineages cluster under FGC8712, consistent with the Quraysh subclade.' },
            ...(hawazinId ? [{ nodeId: hawazinId, haplogroup: 'J1-FGC2', type: DnaType.Y_DNA, subClade: 'J1-M267 > P58 > FGC2', confidence: 0.75, source: 'FamilyTreeDNA Qays Aylan Project', notes: 'FGC2 subclade shows high frequency in Hawazin branches' }] : [])
        ],
    })
    console.log('✅ Created 6 DNA markers')

    // ═══════════════════════════════════════════════
    // DEMO USER + NOTIFICATIONS
    // ═══════════════════════════════════════════════
    console.log('\n👤 Creating demo user and notifications...')

    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@arabtree.com' },
        update: {},
        create: {
            name: 'مستخدم تجريبي',
            email: 'demo@arabtree.com',
            role: UserRole.CONTRIBUTOR,
            reputationScore: 25,
        },
    })

    await prisma.notification.createMany({
        data: [
            { userId: demoUser.id, type: NotificationType.CONTRIBUTION_APPROVED, title: 'Contribution Approved', titleAr: 'تمت الموافقة على مساهمتك', message: 'Your contribution about the Mudar tribe has been approved.', messageAr: 'تمت الموافقة على مساهمتك حول قبيلة مضر.', link: '/contribute', read: false },
            { userId: demoUser.id, type: NotificationType.CONTRIBUTION_PENDING, title: 'New contribution awaiting review', titleAr: 'مساهمة جديدة بانتظار المراجعة', message: 'A new node addition for Banu Tamim.', messageAr: 'إضافة عقدة جديدة لبني تميم.', link: '/verify', read: false },
            { userId: demoUser.id, type: NotificationType.SYSTEM_ANNOUNCEMENT, title: 'Historical Maps feature is now live!', titleAr: 'ميزة الخريطة التاريخية متاحة الآن!', message: 'Explore tribal territories and historical events on the new map.', messageAr: 'استكشف مواقع القبائل والأحداث التاريخية على الخريطة الجديدة.', link: '/map', read: false },
        ],
    })
    console.log('✅ Created demo user and 3 sample notifications')

    console.log('\n🎉 Seed completed successfully!')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
