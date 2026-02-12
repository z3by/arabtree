'use client'

import dynamic from 'next/dynamic'

// Leaflet requires client-side only rendering — disable SSR
const MapExplorer = dynamic(() => import('@/components/map/MapExplorer'), {
    ssr: false,
    loading: () => (
        <div className="h-[75vh] w-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 animate-pulse">جاري تحميل الخريطة...</p>
        </div>
    ),
})

export default function MapPage() {
    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-right mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    🗺️ الخريطة التاريخية
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                    استكشف المواقع والأحداث التاريخية المرتبطة بالأنساب العربية
                </p>
            </div>

            {/* Map */}
            <MapExplorer />

            {/* Info section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                        <span>📍</span>
                        <span>مواقع القبائل</span>
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        تعرض الخريطة المواقع الجغرافية للقبائل والأنساب العربية من الجذور التاريخية إلى الفروع المعاصرة.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                        <span>⏱️</span>
                        <span>خط زمني تفاعلي</span>
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        استخدم شريط الزمن لتصفية الأحداث التاريخية حسب الفترة — من عصر ما قبل الإسلام إلى العصر الحديث.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <span>⚔️</span>
                        <span>أحداث تاريخية</span>
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        استكشف المعارك والهجرات والتحالفات والأحداث الثقافية المرتبطة بكل قبيلة وعشيرة.
                    </p>
                </div>
            </div>
        </main>
    )
}
