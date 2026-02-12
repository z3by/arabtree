<p align="center">
  <img src="docs/assets/logo-placeholder.png" alt="ArabTree Logo" width="200" />
</p>

<h1 align="center">🌳 ArabTree — شجرة العرب</h1>

<p align="center">
  <strong>Trace your lineage. Know your roots. | تتبع نسبك. اعرف جذورك</strong><br/>
  A digital platform to document and visualize Arab genealogy (Nasab), connecting modern families to their ancient tribal roots.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NextAuth.js-v5-purple?style=flat-square" alt="NextAuth" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="docs/ROADMAP.md">Roadmap</a> •
  <a href="docs/ARCHITECTURE.md">Architecture</a> •
  <a href="#-المساهمة">المساهمة</a>
</p>

---

## 📖 About

**ArabTree** is an open-source genealogy platform purpose-built for Arab lineage documentation. Unlike generic family-tree tools, ArabTree understands the unique structure of Arab genealogy — from the root patriarchs **Adnan (عدنان)** and **Qahtan (قحطان)**, through major tribes, clans, and families, all the way down to individuals living today.

Every branch on the tree is historically sourced, community-verified, and beautifully visualized.

### Why ArabTree?

| Problem | ArabTree's Solution |
|---|---|
| Generic genealogy tools don't model Arab tribal hierarchy (Root → Tribe → Clan → Family → Individual) | Purpose-built hierarchical model with `NodeType` taxonomy that mirrors real Nasab structure |
| Arabic names have dozens of transliteration variants | Phonetic-aware fuzzy search that maps between Arabic script and Latin transliterations |
| Oral tribal history is being lost as elders pass away | Guided, Arabic-first contribution forms designed for non-technical users |
| No verification process — anyone can add unverified data | Multi-step verification workflow with source citation requirements |
| Existing tools are English-only or RTL as an afterthought | Arabic (RTL) as the primary language, English as secondary |

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **🌲 Interactive Family Trees** | Zoomable, pannable tree visualization powered by D3.js / React Flow. Semantic zoom reveals detail progressively — tribal overview at macro level, individual biographies at micro level. |
| **🔬 DNA Marker Integration** | Link verified DNA haplogroup data (Y-DNA / mtDNA) to lineage branches. Visual badges show haplogroup distribution across tribes for scientific validation. |
| **🗺️ Historical Maps** | Explore tribal migration routes and historical territories on interactive, time-aware maps with a timeline slider spanning pre-Islamic through modern eras. |
| **✅ Verified Contributions** | Community-driven data with a multi-step verification workflow — Draft → Review → Published. Source citations required. Reputation scoring for trusted contributors. |
| **🔍 Smart Search** | Fuzzy, phonetic-aware search across Arabic & transliterated names (e.g., searching "محمد" also finds "Mohammed", "Muhammad", "Mohamad"). Full autocomplete with lineage path previews. |
| **🛡️ Role-Based Access** | Fine-grained RBAC — Viewers, Contributors, Verifiers, and Admins — enforced at both API and UI layers. |
| **🌐 Arabic-First (RTL)** | Full right-to-left interface in Arabic with proper bidirectional support. English as secondary language. |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) | SSR, RSC, routing, API routes |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type safety across the stack |
| **Database** | [MongoDB 7](https://www.mongodb.com/) | Document store for genealogical data |
| **ORM** | [Prisma 6](https://www.prisma.io/) | Type-safe database access |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS with RTL support |
| **Auth** | [NextAuth.js v5](https://authjs.dev/) | Authentication + session management |
| **Validation** | [Zod](https://zod.dev/) | Runtime schema validation |
| **Visualization** | [D3.js](https://d3js.org/) / [React Flow](https://reactflow.dev/) | Interactive tree rendering |
| **Maps** | [Leaflet](https://leafletjs.com/) | Historical maps & geolocation |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) | Arabic/English internationalization |

---

## 📸 Screenshots

> 🚧 *Coming soon — screenshots and demo GIFs will be added after Phase 2 completion.*

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | ≥ 18.x |
| **Package Manager** | npm, pnpm, or yarn |
| **MongoDB** | 6.x+ ([local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/atlas)) |
| **Git** | 2.x+ |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/arabtree.git
cd arabtree

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local — see Environment Variables table below

# 4. Generate Prisma client
npx prisma generate

# 5. Push the schema to your database
npx prisma db push

# 6. Seed the database with root tribal data
npx prisma db seed

# 7. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see ArabTree in action.

### Environment Variables

Create `.env.local` from `.env.example` and fill in the values:

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/arabtree` |
| `NEXTAUTH_SECRET` | ✅ | Random string for session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Base URL of your app | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID | — |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret | — |

### Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |
| `npx prisma studio` | Open Prisma database browser |
| `npx prisma db seed` | Seed database with tribal root data |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Product Requirements (PRD)](docs/PRD.md) | User personas, stories, competitive analysis, and functional requirements |
| [Architecture](docs/ARCHITECTURE.md) | System design, data flow, deployment topology, and directory structure |
| [Database Schema](docs/SCHEMA.md) | Prisma models, self-referencing lineage design, and query patterns |
| [Roadmap](docs/ROADMAP.md) | 4-phase implementation plan with Gantt chart, KPIs, and risk register |

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing a bug, adding a feature, or improving documentation — every contribution matters.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

> 📝 Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## المساهمة 🤝

نرحب بمساهماتكم! سواء كنت باحثاً في الأنساب، مبرمجاً، أو شيخ قبيلة يحمل معرفة تاريخية — مساهمتك قيّمة لحفظ تراثنا العربي.

- **الباحثون**: ساعدونا في التحقق من صحة البيانات وإضافة المصادر الأكاديمية
- **المبرمجون**: ساهموا في تطوير المنصة وتحسين تجربة المستخدم
- **حاملو المعرفة**: شاركوا علمكم بالأنساب والتاريخ القبلي

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for preserving Arab heritage | بُني بحب لحفظ التراث العربي
</p>
