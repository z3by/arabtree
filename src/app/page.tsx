import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex flex-col">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center px-4 animate-in fade-in zoom-in duration-700">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-green-700 to-green-900 dark:from-primary dark:via-green-400 dark:to-green-200 pb-2 tracking-tight">
              شجرة الأنساب العربية
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              منصة رقمية لتوثيق الأنساب العربية، تربط الأجيال الحديثة بجذورها القبلية العريقة باستخدام أحدث التقنيات.
            </p>
            <div className="space-x-4 gap-4 flex flex-col sm:flex-row justify-center items-center mt-4">
              <Link href="/tree">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
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

        <section className="container space-y-6 bg-slate-50 dark:bg-slate-900/50 py-8 md:py-12 lg:py-24 px-4 rounded-3xl mb-8 glass-card border-none shadow-none mx-4 md:mx-auto max-w-6xl">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-xl border bg-background/50 p-2 hover:bg-background transition-colors duration-300">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-primary">موثوقة</h3>
                  <p className="text-sm text-muted-foreground">بيانات خاضعة للتدقيق والمراجعة من قبل مؤرخين ونسابين معتمدين.</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border bg-background/50 p-2 hover:bg-background transition-colors duration-300">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-primary">شاملة</h3>
                  <p className="text-sm text-muted-foreground">تغطي القبائل العدنانية والقحطانية من الجذور التاريخية إلى الفروع المعاصرة.</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border bg-background/50 p-2 hover:bg-background transition-colors duration-300">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-primary">تفاعلية</h3>
                  <p className="text-sm text-muted-foreground">خرائط تاريخية ورسوم بيانية تفاعلية تساعدك على فهم هجرات القبائل وتوزيعها.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
