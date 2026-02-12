'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Trophy, Star, Award, Shield, User,
    Calendar, Loader2, Crown,
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
    if (score >= 100) return { label: 'ذهبي', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' }
    if (score >= 50) return { label: 'فضي', icon: Shield, color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/30' }
    if (score >= 10) return { label: 'برونزي', icon: Star, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' }
    return { label: 'مبتدئ', icon: User, color: 'text-muted-foreground', bg: 'bg-muted/30' }
}

// ── Rank badge for top 3 ──
function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-500" />
    if (rank === 2) return <Trophy className="w-5 h-5 text-slate-400" />
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-600" />
    return <span className="text-sm font-bold text-muted-foreground w-6 text-center">{rank}</span>
}

interface LeaderboardEntry {
    rank: number
    id: string
    name: string
    image: string | null
    role: string
    reputationScore: number
    approvedContributions: number
    createdAt: string
}

export default function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/users/leaderboard')
            if (res.ok) {
                const data = await res.json()
                setEntries(data.leaderboard)
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLeaderboard()
    }, [fetchLeaderboard])

    return (
        <div className="container max-w-3xl py-8 px-4 space-y-6" dir="rtl">
            <header className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    المتصدرون
                </h1>
                <p className="text-muted-foreground">
                    أكثر المساهمين نشاطاً في بناء شجرة الأنساب العربية
                </p>
            </header>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : entries.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border rounded-lg bg-muted/10">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-lg">لا يوجد مساهمون بعد</p>
                    <p className="text-sm mt-1">
                        كن أول من يساهم في بناء الشجرة!
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry) => {
                        const tier = getReputationTier(entry.reputationScore)
                        const TierIcon = tier.icon
                        const role = roleLabels[entry.role] || roleLabels.VIEWER!

                        return (
                            <Link href={`/profile/${entry.id}`} key={entry.id}>
                                <Card className={`hover:bg-muted/30 transition-all cursor-pointer ${entry.rank <= 3 ? 'border-primary/30 shadow-md' : ''}`}>
                                    <CardContent className="p-4 flex items-center gap-4">
                                        {/* Rank */}
                                        <div className="flex items-center justify-center w-8 shrink-0">
                                            <RankBadge rank={entry.rank} />
                                        </div>

                                        {/* Avatar */}
                                        <Avatar className={`h-12 w-12 shrink-0 ${entry.rank <= 3 ? 'ring-2 ring-primary/30' : ''}`}>
                                            <AvatarImage src={entry.image || ''} alt={entry.name} />
                                            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                                                {entry.name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold truncate">{entry.name}</span>
                                                <Badge className={`${role.color} border text-[10px] px-2 py-0`}>
                                                    {role.ar}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                <span className={`flex items-center gap-1 ${tier.color}`}>
                                                    <TierIcon className="w-3 h-3" />
                                                    {tier.label}
                                                </span>
                                                <span>{entry.approvedContributions} مساهمة مقبولة</span>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className={`text-center px-3 py-2 rounded-lg ${tier.bg} shrink-0`}>
                                            <div className="text-lg font-bold">{entry.reputationScore}</div>
                                            <div className="text-[10px] text-muted-foreground">نقطة</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}

            {/* CTA */}
            <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                    ساهم في شجرة الأنساب لزيادة نقاطك والظهور في لوحة المتصدرين
                </p>
                <Link
                    href="/contribute"
                    className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-primary hover:underline"
                >
                    ابدأ المساهمة →
                </Link>
            </div>
        </div>
    )
}
