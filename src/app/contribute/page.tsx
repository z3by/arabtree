import { ContributionForm } from '@/components/contribution/ContributionForm'

export default function ContributePage() {
    return (
        <div className="container max-w-2xl py-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">المساهمة في الشجرة</h1>
                <p className="text-muted-foreground">
                    شارك في بناء وتوثيق شجرة الأنساب العربية. جميع المساهمات تخضع للمراجعة قبل النشر.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
                <ContributionForm />
            </div>
        </div>
    )
}
