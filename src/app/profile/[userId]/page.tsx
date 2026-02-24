import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Star, Award, Shield, User, TreePine,
    Calendar, CheckCircle2, XCircle, Clock, FileText,
} from 'lucide-react'
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS_AR } from '@/lib/constants'

// ── Role labels ──
const roleLabels: Record<string, { ar: string; color: string }> = {
    VIEWER: { ar: 'مشاهد', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    CONTRIBUTOR: { ar: 'مساهم', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    VERIFIER: { ar: 'محقق', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    ADMIN: { ar: 'مدير', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
}

const typeLabels = NODE_TYPE_LABELS_AR

const typeColors = NODE_TYPE_COLORS

const contributionTypeLabels: Record<string, string> = {
    ADD_NODE: 'إضافة',
    EDIT_NODE: 'تعديل',
    MERGE_NODES: 'دمج',
    ADD_SOURCE: 'مصدر',
    ADD_EVENT: 'حدث',
}

const statusLabels: Record<string, { ar: string; color: string }> = {
    APPROVED: { ar: 'مقبول', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    REJECTED: { ar: 'مرفوض', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    PENDING: { ar: 'قيد المراجعة', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    DRAFT: { ar: 'مسودة', color: 'bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300' },
    WITHDRAWN: { ar: 'مسحوب', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400' },
}

// ── Reputation tiers ──
function getReputationTier(score: number) {
    if (score >= 100) return { label: 'ذهبي', icon: Award, color: 'text-amber-500' }
    if (score >= 50) return { label: 'فضي', icon: Shield, color: 'text-slate-400' }
    if (score >= 10) return { label: 'برونزي', icon: Star, color: 'text-orange-600' }
    return { label: 'مبتدئ', icon: User, color: 'text-muted-foreground' }
}

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ userId: string }>
}) {
    const { userId } = await params

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            image: true,
            role: true,
            bio: true,
            reputationScore: true,
            createdAt: true,
        },
    })

    if (!user) {
        notFound()
    }

    // Stats
    const [total, approved, pending, rejected] = await Promise.all([
        prisma.contribution.count({ where: { authorId: userId } }),
        prisma.contribution.count({ where: { authorId: userId, status: 'APPROVED' } }),
        prisma.contribution.count({ where: { authorId: userId, status: 'PENDING' } }),
        prisma.contribution.count({ where: { authorId: userId, status: 'REJECTED' } }),
    ])

    // Verified tribes
    const approvedContributions = await prisma.contribution.findMany({
        where: { authorId: userId, status: 'APPROVED' },
        select: {
            node: { select: { id: true, name: true, nameAr: true, type: true } },
        },
        distinct: ['nodeId'],
    })
    const verifiedTribes = approvedContributions.map((c) => c.node)

    // Recent contributions
    const recentContributions = await prisma.contribution.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
            id: true,
            type: true,
            status: true,
            summary: true,
            createdAt: true,
            node: { select: { id: true, name: true, nameAr: true, type: true } },
        },
    })

    const tier = getReputationTier(user.reputationScore)
    const TierIcon = tier.icon
    const role = roleLabels[user.role] || roleLabels.VIEWER!

    return (
        <div className="container max-w-4xl py-8 px-4 space-y-8" dir="rtl">
            {/* ── User Header ── */}
            <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-lg">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                        {user.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-right space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{user.name}</h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <Badge className={`${role.color} border text-xs px-3 py-1`}>
                            {role.ar}
                        </Badge>
                        <div className={`flex items-center gap-1 text-sm font-medium ${tier.color}`}>
                            <TierIcon className="w-4 h-4" />
                            <span>{tier.label}</span>
                            <span className="text-muted-foreground">({user.reputationScore} نقطة)</span>
                        </div>
                    </div>
                    {user.bio && (
                        <p className="text-muted-foreground leading-relaxed max-w-xl">{user.bio}</p>
                    )}
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>عضو منذ {new Date(user.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}</span>
                    </div>
                </div>
            </header>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="text-center">
                    <CardContent className="p-4">
                        <FileText className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-2xl font-bold">{total}</div>
                        <div className="text-xs text-muted-foreground">إجمالي المساهمات</div>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="p-4">
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{approved}</div>
                        <div className="text-xs text-muted-foreground">مقبولة</div>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="p-4">
                        <Clock className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pending}</div>
                        <div className="text-xs text-muted-foreground">قيد المراجعة</div>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="p-4">
                        <XCircle className="w-5 h-5 mx-auto mb-1 text-red-500" />
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejected}</div>
                        <div className="text-xs text-muted-foreground">مرفوضة</div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Verified Tribes ── */}
            {verifiedTribes.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TreePine className="w-5 h-5" />
                        الأنساب المُحقَّقة
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {verifiedTribes.map((tribe) => (
                            <Link href={`/tree/${tribe.id}`} key={tribe.id}>
                                <Badge
                                    className={`${typeColors[tribe.type]?.badge || ''} border text-xs px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                    {typeLabels[tribe.type] ? `${typeLabels[tribe.type]}: ` : ''}
                                    {tribe.nameAr}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Recent Contributions ── */}
            {recentContributions.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        آخر المساهمات
                    </h2>
                    <div className="space-y-3">
                        {recentContributions.map((contribution) => {
                            const st = statusLabels[contribution.status] || statusLabels.DRAFT!
                            return (
                                <Card key={contribution.id} className="hover:bg-muted/30 transition-colors">
                                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${st.color} border text-[10px] px-2 py-0`}>
                                                    {st.ar}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {contributionTypeLabels[contribution.type] || contribution.type}
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <Link
                                                    href={`/tree/${contribution.node.id}`}
                                                    className="font-semibold hover:text-primary transition-colors"
                                                >
                                                    {contribution.node.nameAr}
                                                </Link>
                                                <span className="text-muted-foreground mr-1">({contribution.node.name})</span>
                                            </div>
                                            {contribution.summary && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {contribution.summary}
                                                </p>
                                            )}
                                        </div>
                                        <time className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(contribution.createdAt).toLocaleDateString('ar-SA')}
                                        </time>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Empty state */}
            {recentContributions.length === 0 && verifiedTribes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                    <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-lg">لا توجد مساهمات حتى الآن</p>
                    <p className="text-sm mt-1">هذا المستخدم لم يقدم أي مساهمات بعد.</p>
                </div>
            )}
        </div>
    )
}
