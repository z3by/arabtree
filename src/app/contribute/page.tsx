import { ContributionForm } from '@/components/contribution/ContributionForm'
import { BookOpen, Shield, Clock } from 'lucide-react'

export default function ContributePage() {
    return (
        <div className="container max-w-3xl py-10 space-y-8">
            {/* ── Header ── */}
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold">المساهمة في الشجرة</h1>
                <p className="text-muted-foreground text-lg">
                    شارك في بناء وتوثيق شجرة الأنساب العربية
                </p>
            </div>

            {/* ── Info Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                        <div className="font-semibold text-sm">وثّق مصادرك</div>
                        <div className="text-xs text-muted-foreground">كتب، مخطوطات، أو روايات شفهية</div>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                        <div className="font-semibold text-sm">مراجعة شاملة</div>
                        <div className="text-xs text-muted-foreground">كل مساهمة تخضع لمراجعة متخصصين</div>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                        <div className="font-semibold text-sm">متابعة الحالة</div>
                        <div className="text-xs text-muted-foreground">تابع حالة مساهمتك من حسابك</div>
                    </div>
                </div>
            </div>

            {/* ── Form ── */}
            <div className="p-6 md:p-8 border rounded-xl bg-card shadow-sm">
                <ContributionForm />
            </div>
        </div>
    )
}
