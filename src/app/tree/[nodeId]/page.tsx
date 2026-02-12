import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ChevronLeft,
    TreePine,
    PlusCircle,
    Calendar,
    MapPin,
    Users,
    Crown,
    BookOpen,
} from 'lucide-react'

// ── Type colors for badges ──
const typeColors: Record<string, string> = {
    ROOT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    TRIBE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    CLAN: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    FAMILY: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-700',
    INDIVIDUAL: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300 border-slate-300 dark:border-slate-700',
}

const typeLabels: Record<string, string> = {
    ROOT: 'جذر',
    TRIBE: 'قبيلة',
    CLAN: 'عشيرة',
    FAMILY: 'عائلة',
    INDIVIDUAL: 'فرد',
}

// ── Recursive ancestor path builder ──
async function getAncestorPath(parentId: string | null) {
    const ancestors: Array<{
        id: string
        name: string
        nameAr: string
        type: string
    }> = []

    let currentParentId = parentId
    let safety = 0

    while (currentParentId && safety < 100) {
        safety++
        const parent = await prisma.lineageNode.findUnique({
            where: { id: currentParentId },
            select: {
                id: true,
                name: true,
                nameAr: true,
                type: true,
                parentId: true,
            },
        })

        if (!parent) break

        ancestors.unshift({
            id: parent.id,
            name: parent.name,
            nameAr: parent.nameAr,
            type: parent.type,
        })

        currentParentId = parent.parentId
    }

    return ancestors
}

// ── Page Component ──
export default async function NodeDetailPage({
    params,
}: {
    params: Promise<{ nodeId: string }>
}) {
    const { nodeId } = await params

    const node = await prisma.lineageNode.findUnique({
        where: { id: nodeId },
        include: {
            children: {
                take: 50,
                orderBy: { birthYear: 'asc' },
                select: {
                    id: true,
                    name: true,
                    nameAr: true,
                    title: true,
                    epithet: true,
                    type: true,
                    birthYear: true,
                    deathYear: true,
                    childCount: true,
                    era: true,
                },
            },
        },
    })

    if (!node) {
        notFound()
    }

    const ancestors = await getAncestorPath(node.parentId)

    const yearDisplay = node.birthYear
        ? `${node.birthYear}${node.deathYear ? ` - ${node.deathYear}` : ' - الحاضر'}`
        : null

    const yearHijriDisplay = node.birthYearHijri
        ? `${node.birthYearHijri}${node.deathYearHijri ? ` - ${node.deathYearHijri}` : ''} هـ`
        : null

    return (
        <div className="container max-w-4xl py-8 px-4 space-y-8">
            {/* ── Ancestor Breadcrumb ── */}
            {ancestors.length > 0 && (
                <nav aria-label="سلسلة النسب" className="flex items-center gap-1 flex-wrap text-sm">
                    {ancestors.map((ancestor, index) => (
                        <span key={ancestor.id} className="flex items-center gap-1">
                            <Link
                                href={`/tree/${ancestor.id}`}
                                className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                            >
                                {ancestor.nameAr}
                            </Link>
                            {index < ancestors.length && (
                                <ChevronLeft className="w-3 h-3 text-muted-foreground/50" />
                            )}
                        </span>
                    ))}
                    <span className="font-semibold text-foreground">{node.nameAr}</span>
                </nav>
            )}

            {/* ── Node Header ── */}
            <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Badge className={`${typeColors[node.type] || ''} border text-xs px-3 py-1`}>
                        {typeLabels[node.type] || node.type}
                    </Badge>
                    {node.era && (
                        <Badge variant="outline" className="text-xs px-3 py-1">
                            {node.era}
                        </Badge>
                    )}
                    {node.status !== 'PUBLISHED' && (
                        <Badge variant="outline" className="text-xs px-3 py-1 border-amber-400 text-amber-600 dark:text-amber-400">
                            {node.status}
                        </Badge>
                    )}
                </div>

                <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-800 dark:from-primary dark:to-green-400">
                        {node.nameAr}
                    </h1>
                    <p className="text-xl text-muted-foreground">{node.name}</p>
                </div>

                {(node.title || node.epithet) && (
                    <div className="flex items-center gap-2 text-primary">
                        <Crown className="w-4 h-4" />
                        <span className="font-semibold text-lg">
                            {node.title}{node.title && node.epithet ? ' — ' : ''}{node.epithet}
                        </span>
                    </div>
                )}
            </header>

            {/* ── Metadata Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {yearDisplay && (
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                        <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
                        <div>
                            <div className="text-xs text-muted-foreground">الفترة الزمنية</div>
                            <div className="font-medium">{yearDisplay} م</div>
                            {yearHijriDisplay && (
                                <div className="text-xs text-muted-foreground">{yearHijriDisplay}</div>
                            )}
                        </div>
                    </div>
                )}
                {node.birthPlace && (
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                        <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                        <div>
                            <div className="text-xs text-muted-foreground">مكان الميلاد</div>
                            <div className="font-medium">{node.birthPlace}</div>
                        </div>
                    </div>
                )}
                {node.childCount > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                        <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                        <div>
                            <div className="text-xs text-muted-foreground">الفروع</div>
                            <div className="font-medium">{node.childCount} فرع</div>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                    <TreePine className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                        <div className="text-xs text-muted-foreground">عمق النسب</div>
                        <div className="font-medium">الجيل {node.generationDepth}</div>
                    </div>
                </div>
            </div>

            {/* ── Biography ── */}
            {(node.biographyAr || node.biography) && (
                <section className="space-y-3">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        السيرة
                    </h2>
                    {node.biographyAr && (
                        <p className="leading-relaxed text-foreground/90 whitespace-pre-line">
                            {node.biographyAr}
                        </p>
                    )}
                    {node.biography && (
                        <p className="leading-relaxed text-muted-foreground whitespace-pre-line" dir="ltr">
                            {node.biography}
                        </p>
                    )}
                </section>
            )}

            {/* ── Children Grid ── */}
            {node.children.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        الفروع ({node.children.length}{node.childCount > 50 ? ` من ${node.childCount}` : ''})
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {node.children.map((child) => (
                            <Link href={`/tree/${child.id}`} key={child.id}>
                                <Card className="h-full hover:bg-muted/50 transition-all cursor-pointer border hover:border-primary/30 hover:shadow-md group">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge className={`${typeColors[child.type] || ''} border text-[10px] px-2 py-0`}>
                                                {typeLabels[child.type] || child.type}
                                            </Badge>
                                            {child.childCount > 0 && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    {child.childCount} فرع
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg pt-1 group-hover:text-primary transition-colors">
                                            {child.nameAr}
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">{child.name}</div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                                        {child.title && (
                                            <div className="text-primary font-medium">{child.title}</div>
                                        )}
                                        {child.birthYear && (
                                            <div className="mt-1">
                                                {child.birthYear}{child.deathYear ? ` - ${child.deathYear}` : ''} م
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Actions ── */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                <Link href={`/tree?focus=${node.id}`}>
                    <Button variant="outline" className="gap-2">
                        <TreePine className="w-4 h-4" />
                        عرض في الشجرة
                    </Button>
                </Link>
                <Link href={`/contribute?parentId=${node.id}`}>
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        إضافة فرع
                    </Button>
                </Link>
            </div>
        </div>
    )
}
