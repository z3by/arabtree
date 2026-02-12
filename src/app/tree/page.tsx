import Link from 'next/link'
import { Button } from '@/components/ui/button'
import LineageTree from '@/components/tree/LineageTree'
import { PlusCircle, Search } from 'lucide-react'

export default function TreePage() {
    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">شجرة الأنساب</h1>
                    <p className="text-muted-foreground mt-1">
                        استكشف الأنساب العربية من الجذور التاريخية إلى الفروع المعاصرة.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/search">
                        <Button variant="outline">
                            <Search className="w-4 h-4 ml-2" />
                            بحث متقدم
                        </Button>
                    </Link>
                    <Link href="/contribute">
                        <Button>
                            <PlusCircle className="w-4 h-4 ml-2" />
                            إضافة نسب
                        </Button>
                    </Link>
                </div>
            </div>

            <LineageTree />
        </div>
    )
}
