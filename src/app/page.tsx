import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldCheck, Globe, Sparkles, Users, TreePine, BookOpen, ArrowLeft } from "lucide-react"

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
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
            {/* Floating geometric shapes */}
            <div className="absolute top-20 right-[15%] w-16 h-16 rounded-full bg-primary/10 animate-float" />
            <div className="absolute top-40 left-[10%] w-10 h-10 rounded-lg bg-primary/8 animate-float stagger-2 rotate-45" />
            <div className="absolute bottom-20 right-[25%] w-12 h-12 rounded-full bg-amber-500/10 animate-float stagger-3" />
            <div className="absolute top-32 left-[30%] w-8 h-8 rounded-md bg-blue-500/8 animate-float stagger-4 rotate-12" />
            <div className="absolute bottom-32 left-[20%] w-14 h-14 rounded-full border-2 border-primary/10 animate-spin-slow" />
          </div>

          <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center px-4">
            {/* Logo animation */}
            <div className="animate-grow-tree">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-5xl shadow-lg animate-pulse-glow">
                🌴
              </span>
            </div>

            <h1 className="animate-fade-in-up font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-green-700 to-green-900 dark:from-primary dark:via-green-400 dark:to-green-200 pb-2 tracking-tight">
              شجرة الأنساب العربية
            </h1>

            <p className="animate-fade-in-up stagger-1 max-w-[42rem] leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
              منصة رقمية لتوثيق الأنساب العربية، تربط الأجيال الحديثة بجذورها القبلية العريقة باستخدام أحدث التقنيات.
            </p>

            <div className="animate-fade-in-up stagger-2 flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
              <Link href="/tree">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse-glow">
                  تصفح الشجرة
                </Button>
              </Link>
              <Link href="/contribute">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-12 rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 transition-all">
                  ساهم في التوثيق
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="container max-w-4xl px-4 -mt-4 mb-10 relative z-10">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fade-in-up stagger-${i + 2} flex flex-col items-center gap-2 p-5 rounded-2xl glass-card border-none text-center`}
              >
                <stat.icon className="w-6 h-6 text-primary mb-1" />
                <span className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</span>
                <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Section ── */}
        <section className="container max-w-6xl px-4 mb-12">
          <div className="rounded-3xl glass-card border-none shadow-none p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">لماذا ArabTree؟</h2>
              <p className="text-muted-foreground">منصة مبنية على أسس علمية وتقنية متينة</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`animate-fade-in-up stagger-${i + 1} group relative overflow-hidden rounded-xl border bg-background/50 p-6 hover:bg-background hover:shadow-md transition-all duration-300`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="container max-w-4xl px-4 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 text-center border border-primary/10">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-primary/5 animate-float" />
              <div className="absolute bottom-4 left-8 w-12 h-12 rounded-full bg-primary/5 animate-float stagger-3" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">ساهم في بناء الشجرة</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              كل مساهمة تُحدث فرقاً. أضف معلومات عن عائلتك أو قبيلتك وساعدنا في حفظ التراث العربي للأجيال القادمة.
            </p>
            <Link href="/contribute">
              <Button size="lg" className="rounded-full px-8 h-12 text-lg gap-2 hover:scale-105 transition-transform">
                ابدأ المساهمة
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
