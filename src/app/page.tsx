import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Globe, Sparkles, Users, TreePine, BookOpen, ArrowLeft, Search } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "موثوقة",
    description: "بيانات خاضعة للتدقيق والمراجعة من قبل مؤرخين ونسابين معتمدين.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: Globe,
    title: "شاملة",
    description: "تغطي القبائل العدنانية والقحطانية من الجذور التاريخية إلى الفروع المعاصرة.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Sparkles,
    title: "تفاعلية",
    description: "خرائط تاريخية ورسوم بيانية تفاعلية تساعدك على فهم هجرات القبائل وتوزيعها.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
]

const stats = [
  { value: "١٢٠+", label: "قبيلة موثقة", icon: TreePine },
  { value: "٥٠+", label: "مساهم نشط", icon: Users },
  { value: "١٤٠٠+", label: "سنة من التاريخ", icon: BookOpen },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex flex-col">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden py-16 md:py-24 lg:py-36">
          {/* Background decorations - High-End Mesh Gradient */}
          <div className="absolute inset-0 -z-10 bg-background/50 dark:bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50 dark:opacity-70 dark:from-primary/10" />

            {/* AI Image Overlay for Hero */}
            <div className="absolute inset-0 opacity-30 mix-blend-multiply dark:opacity-20 dark:mix-blend-screen pointer-events-none">
              <Image
                src="/images/ai/hero_ancestry.png"
                alt="Ancestry Tree Background"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
            </div>

            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-40 mix-blend-multiply dark:bg-primary/20 dark:opacity-60 dark:mix-blend-screen animate-orb-1" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl opacity-30 mix-blend-multiply dark:bg-emerald-500/20 dark:opacity-50 dark:mix-blend-screen animate-orb-2 stagger-3" />
            {/* Floating geometric shapes */}
            <div className="absolute top-20 right-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-md dark:from-primary/30 animate-float" />
            <div className="absolute bottom-20 left-[15%] w-32 h-32 rounded-full border border-primary/10 dark:border-primary/20 animate-spin-slow" />
          </div>

          <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center px-4 relative z-10">
            {/* Premium Icon/Logo */}
            <div className="animate-grow-tree mb-2">
              <div className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl glass shadow-xl shadow-primary/20 border-white/60 dark:border-white/10 group overflow-hidden hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:scale-110 transition-transform duration-500" />
                <TreePine className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="animate-fade-in-up font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight pb-2 leading-[1.1] md:leading-tight">
                <span className="text-foreground drop-shadow-sm">شجرة الأنساب</span> <span className="text-primary block sm:inline mt-2 sm:mt-0 animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#10b981,45%,#34d399,55%,#10b981)] drop-shadow-sm">العربية</span>
              </h1>
              <p className="animate-fade-in-up stagger-1 max-w-[46rem] mx-auto leading-relaxed text-muted-foreground text-lg sm:text-xl font-medium">
                منصة رقمية لتوثيق الأنساب العربية، تربط الأجيال الحديثة بجذورها القبلية العريقة باستخدام أحدث التقنيات وواجهة عصرية.
              </p>
            </div>

            {/* Smart Search Bar */}
            <div className="animate-fade-in-up stagger-2 w-full max-w-2xl mt-4">
              <form action="/search" method="GET" className="relative group flex items-center">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500" />
                <div className="relative flex items-center w-full glass rounded-full shadow-lg border-white/60 dark:border-white/10 hover:shadow-primary/10 transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary/50">
                  <Search className="absolute right-5 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    name="q"
                    type="text"
                    required
                    minLength={2}
                    placeholder="ابحث عن قبيلة، عائلة، أو شخص..."
                    className="w-full bg-transparent pl-36 pr-14 h-16 text-base md:text-lg outline-none placeholder:text-muted-foreground/60 text-foreground"
                  />
                  <div className="absolute left-2 flex gap-2">
                    <Button type="submit" size="lg" className="h-12 rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
                      بحث
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            <div className="animate-fade-in-up stagger-3 flex flex-wrap gap-4 justify-center items-center mt-2 text-sm font-medium text-muted-foreground/80">
              <span className="hidden sm:inline">عمليات بحث شائعة:</span>
              <div className="flex gap-3">
                <Link href="/search?q=عدنان" className="hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4">عدنان</Link>
                <Link href="/search?q=قحطان" className="hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4">قحطان</Link>
                <Link href="/search?q=قريش" className="hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4">قريش</Link>
              </div>
            </div>

            <div className="animate-fade-in-up stagger-4 mt-8">
              <Link href="/tree">
                <Button variant="outline" className="rounded-full px-8 h-12 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all text-base font-medium group backdrop-blur-sm bg-background/30">
                  <Globe className="w-5 h-5 ml-2 text-primary group-hover:animate-pulse" />
                  أو تصفح الشجرة الكاملة
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="container max-w-5xl px-4 -mt-16 mb-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fade-in-up stagger-${i + 2} flex flex-col items-center justify-center gap-3 p-8 bento-card text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-border/50`}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-emerald-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
                <stat.icon className="w-10 h-10 text-primary mb-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 relative z-10" />
                <div className="space-y-1 relative z-10">
                  <h4 className="text-4xl md:text-5xl font-black text-foreground">{stat.value}</h4>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Section (Bento Box) ── */}
        <section className="container max-w-6xl px-4 mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-3/4 bg-primary/5 blur-[100px] rounded-full -z-10" />

          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground drop-shadow-sm">لماذا ArabTree؟</h2>
            <p className="text-muted-foreground/90 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">منصة حديثة تعيد تعريف كيفية تفاعلك مع التاريخ، مصممة للموثوقية وسهولة الاستخدام العالية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[320px]">
            {/* Feature 1 - Large Bento Box */}
            <div className="md:col-span-2 md:row-span-2 bento-card p-0 flex flex-col justify-end text-right overflow-hidden group border-none ring-1 ring-border/50 hover:shadow-2xl transition-all duration-500">
              {/* Background Map Image */}
              <div className="absolute inset-0 -z-20">
                <Image
                  src="/images/ai/feature_history.png"
                  alt="Historical Routes and Data Nodes"
                  fill
                  className="object-cover object-center opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/40 transition-colors duration-500" />

              <div className="p-8 md:p-10 relative z-10 w-full h-full flex flex-col justify-end items-start mt-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl ring-1 ring-white/30 backdrop-blur-md">
                  {(() => { const Icon = features[0].icon; return <Icon className="w-8 h-8 text-emerald-400 drop-shadow-md" /> })()}
                </div>
                <h3 className="font-bold text-3xl md:text-4xl text-white mb-3 drop-shadow-md">{features[0].title}</h3>
                <p className="text-lg text-gray-200 leading-relaxed font-medium max-w-[90%] drop-shadow-sm">{features[0].description}</p>
              </div>
            </div>

            {/* Feature 2 - Small Bento Box */}
            <div className="md:col-span-2 bento-card p-0 flex flex-col justify-end text-right overflow-hidden group border-none ring-1 ring-border/50 hover:shadow-2xl transition-all duration-500">
              {/* Background Globe Image */}
              <div className="absolute inset-0 -z-20">
                <Image
                  src="/images/ai/feature_comprehensive.png"
                  alt="Arabian Peninsula Data Globe"
                  fill
                  className="object-cover object-center opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -z-10 group-hover:bg-blue-500/40 transition-colors duration-500" />

              <div className="p-8 relative z-10 w-full h-full flex flex-col justify-end items-start mt-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg ring-1 ring-white/30 backdrop-blur-md">
                  {(() => { const Icon = features[1].icon; return <Icon className="w-6 h-6 text-blue-400 drop-shadow-md" /> })()}
                </div>
                <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-md">{features[1].title}</h3>
                <p className="text-sm text-gray-200 leading-relaxed font-medium drop-shadow-sm">{features[1].description}</p>
              </div>
            </div>

            {/* Feature 3 - Small Bento Box */}
            <div className="md:col-span-2 bento-card p-0 flex flex-col justify-end text-right overflow-hidden group border-none ring-1 ring-border/50 hover:shadow-2xl transition-all duration-500">
              {/* Background Fiber Optic Image */}
              <div className="absolute inset-0 -z-20">
                <Image
                  src="/images/ai/feature_interactive.png"
                  alt="Fiber Optic Data Tree"
                  fill
                  className="object-cover object-center opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -z-10 group-hover:bg-amber-500/40 transition-colors duration-500" />

              <div className="p-8 relative z-10 w-full h-full flex flex-col justify-end items-start mt-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg ring-1 ring-white/30 backdrop-blur-md">
                  {(() => { const Icon = features[2].icon; return <Icon className="w-6 h-6 text-amber-400 drop-shadow-md" /> })()}
                </div>
                <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-md">{features[2].title}</h3>
                <p className="text-sm text-gray-200 leading-relaxed font-medium drop-shadow-sm">{features[2].description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="container max-w-4xl px-4 mb-16 relative z-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-700 to-green-900 group p-10 md:p-14 text-center shadow-2xl shadow-primary/20 text-primary-foreground border-white/10 glass-card hover:scale-[1.01] transition-transform duration-500">
            <div className="absolute inset-0 -z-10 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

            {/* Community Nodes Image Overlay */}
            <div className="absolute inset-0 -z-10 opacity-30 mix-blend-screen pointer-events-none">
              <Image
                src="/images/ai/cta_community.png"
                alt="Community Connected Nodes"
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full animate-pulse" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-3xl rounded-full" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">ساهم في بناء الشجرة</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              كل مساهمة تُحدث فرقاً. أضف معلومات عن عائلتك أو قبيلتك وساعدنا في حفظ التراث العربي للأجيال القادمة.
            </p>
            <Link href="/contribute">
              <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-lg font-bold gap-3 hover:scale-105 transition-all shadow-xl hover:shadow-white/20 text-primary hover:bg-white bg-white/95">
                ابدأ المساهمة
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
