import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ContributionList } from '@/components/profile/ContributionList'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    Star, Award, Shield, User, ExternalLink,
    Calendar, CheckCircle2, XCircle, Clock, FileText,
} from 'lucide-react'

// ── Role labels ──
const roleLabels: Record<string, { ar: string; color: string }> = {
    VIEWER: { ar: 'مشاهد', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    CONTRIBUTOR: { ar: 'مساهم', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    VERIFIER: { ar: 'محقق', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    ADMIN: { ar: 'مدير', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
}

// ── Reputation tiers ──
function getReputationTier(score: number) {
    if (score >= 100) return { label: 'ذهبي', icon: Award, color: 'text-amber-500' }
    if (score >= 50) return { label: 'فضي', icon: Shield, color: 'text-slate-400' }
    if (score >= 10) return { label: 'برونزي', icon: Star, color: 'text-orange-600' }
    return { label: 'مبتدئ', icon: User, color: 'text-muted-foreground' }
}

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    const user = session.user

    // Fetch full user data with reputation
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            reputationScore: true,
            bio: true,
            role: true,
            createdAt: true,
        },
    })

    const reputationScore = dbUser?.reputationScore ?? 0
    const bio = dbUser?.bio ?? null
    const userRole = dbUser?.role ?? 'VIEWER'

    // Contribution stats
    const [total, approved, pending, rejected] = await Promise.all([
        prisma.contribution.count({ where: { authorId: user.id } }),
        prisma.contribution.count({ where: { authorId: user.id, status: 'APPROVED' } }),
        prisma.contribution.count({ where: { authorId: user.id, status: 'PENDING' } }),
        prisma.contribution.count({ where: { authorId: user.id, status: 'REJECTED' } }),
    ])

    const contributions = await prisma.contribution.findMany({
        where: { authorId: user.id },
        include: { node: { select: { name: true, nameAr: true } } },
        orderBy: { createdAt: 'desc' },
    })

    const tier = getReputationTier(reputationScore)
    const TierIcon = tier.icon
    const role = roleLabels[userRole] || roleLabels.VIEWER!

    return (
        <div className="container py-8 px-4 space-y-8 max-w-4xl mx-auto" dir="rtl">
            {/* ── Profile Header ── */}
            <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-lg">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                        {user.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 text-center sm:text-right">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{user.name}</h1>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <Badge className={`${role.color} border text-xs px-3 py-1`}>
                            {role.ar}
                        </Badge>
                        <div className={`flex items-center gap-1 text-sm font-medium ${tier.color}`}>
                            <TierIcon className="w-4 h-4" />
                            <span>{tier.label}</span>
                            <span className="text-muted-foreground">({reputationScore} نقطة)</span>
                        </div>
                    </div>
                    {bio && (
                        <p className="text-muted-foreground leading-relaxed max-w-xl">{bio}</p>
                    )}
                    {dbUser?.createdAt && (
                        <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>عضو منذ {new Date(dbUser.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}</span>
                        </div>
                    )}
                    <Link href={`/profile/${user.id}`}>
                        <Button variant="outline" size="sm" className="gap-2 mt-2">
                            <ExternalLink className="w-3 h-3" />
                            عرض الملف العام
                        </Button>
                    </Link>
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

            {/* ── Contributions List ── */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    مساهماتك
                </h2>
                <ContributionList contributions={contributions as unknown as Parameters<typeof ContributionList>[0]['contributions']} />
            </section>
        </div>
    )
}
