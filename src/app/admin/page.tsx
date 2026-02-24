'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Users, TreePine, FileText, Clock,
    Loader2, Shield, AlertTriangle, Search, RefreshCw
} from 'lucide-react'
import { NODE_TYPE_LABELS_AR } from '@/lib/constants'

// ── Types ──
interface Stats {
    users: number
    nodes: number
    contributions: number
    pendingContributions: number
    nodesByType: Array<{ type: string; count: number }>
    contributionsByStatus: Array<{ status: string; count: number }>
    recentActivity: Array<{
        id: string
        action: string
        entityType: string
        entityId: string
        user: string | null
        createdAt: string
    }>
}

interface AdminUser {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    createdAt: string
    _count: { contributions: number }
}

const roleLabels: Record<string, { ar: string; color: string }> = {
    VIEWER: { ar: 'مشاهد', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    CONTRIBUTOR: { ar: 'مساهم', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    VERIFIER: { ar: 'مراجع', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    ADMIN: { ar: 'مدير', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
}

const typeLabelsAr = NODE_TYPE_LABELS_AR

const statusLabelsAr: Record<string, string> = {
    PENDING: 'قيد المراجعة', APPROVED: 'مقبول', REJECTED: 'مرفوض', DRAFT: 'مسودة', WITHDRAWN: 'مسحوب',
}

const actionLabelsAr: Record<string, string> = {
    CREATE: 'إنشاء', UPDATE: 'تعديل', DELETE: 'حذف',
}

type TabId = 'overview' | 'users'

export default function AdminPage() {
    const [tab, setTab] = useState<TabId>('overview')
    const [stats, setStats] = useState<Stats | null>(null)
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userSearch, setUserSearch] = useState('')
    const [roleUpdating, setRoleUpdating] = useState<string | null>(null)

    // ── Fetch stats ──
    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/stats')
            if (!res.ok) throw new Error(res.status === 403 ? 'ليس لديك صلاحية الوصول' : 'فشل تحميل البيانات')
            const data = await res.json()
            setStats(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ')
        }
    }, [])

    // ── Fetch users ──
    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams({ limit: '50' })
            if (userSearch) params.set('search', userSearch)
            const res = await fetch(`/api/admin/users?${params}`)
            if (!res.ok) throw new Error('فشل تحميل المستخدمين')
            const { data } = await res.json()
            setUsers(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ')
        }
    }, [userSearch])

    useEffect(() => {
        setLoading(true)
        setError(null)
        Promise.all([fetchStats(), fetchUsers()]).finally(() => setLoading(false))
    }, [fetchStats, fetchUsers])

    // ── Update role ──
    async function updateRole(userId: string, newRole: string) {
        setRoleUpdating(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'فشل تحديث الدور')
            }
            // Refresh users
            await fetchUsers()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'حدث خطأ')
        } finally {
            setRoleUpdating(null)
        }
    }

    if (loading) {
        return (
            <div className="container py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container py-20 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-destructive">{error}</p>
            </div>
        )
    }

    return (
        <div className="container max-w-6xl py-10 space-y-6">
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="w-7 h-7 text-primary" />
                        لوحة الإدارة
                    </h1>
                    <p className="text-muted-foreground">إدارة المستخدمين والمحتوى والإحصائيات</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => { fetchStats(); fetchUsers() }} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    تحديث
                </Button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 border-b pb-2">
                {[
                    { id: 'overview' as TabId, label: 'نظرة عامة' },
                    { id: 'users' as TabId, label: 'المستخدمون' },
                ].map((t) => (
                    <button
                        key={t.id}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ──────── OVERVIEW TAB ──────── */}
            {tab === 'overview' && stats && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Stats cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <Users className="w-8 h-8 text-blue-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.users}</div>
                                    <div className="text-xs text-muted-foreground">مستخدم</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <TreePine className="w-8 h-8 text-green-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.nodes}</div>
                                    <div className="text-xs text-muted-foreground">عقدة</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-purple-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.contributions}</div>
                                    <div className="text-xs text-muted-foreground">مساهمة</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <Clock className="w-8 h-8 text-amber-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.pendingContributions}</div>
                                    <div className="text-xs text-muted-foreground">قيد المراجعة</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Distribution grids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nodes by type */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">توزيع العقد حسب النوع</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {stats.nodesByType.map((item) => {
                                    const pct = stats.nodes > 0 ? Math.round((item.count / stats.nodes) * 100) : 0
                                    return (
                                        <div key={item.type} className="flex items-center gap-3">
                                            <span className="text-sm w-16 text-muted-foreground">{typeLabelsAr[item.type] || item.type}</span>
                                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-12 text-left">{item.count}</span>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* Contributions by status */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">المساهمات حسب الحالة</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {stats.contributionsByStatus.map((item) => {
                                    const pct = stats.contributions > 0 ? Math.round((item.count / stats.contributions) * 100) : 0
                                    return (
                                        <div key={item.status} className="flex items-center gap-3">
                                            <span className="text-sm w-24 text-muted-foreground">{statusLabelsAr[item.status] || item.status}</span>
                                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-12 text-left">{item.count}</span>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent activity */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">النشاط الأخير</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {stats.recentActivity.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px]">
                                                {actionLabelsAr[log.action] || log.action}
                                            </Badge>
                                            <span className="text-muted-foreground">{log.entityType}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>{log.user || 'مجهول'}</span>
                                            <span>{new Date(log.createdAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                        </div>
                                    </div>
                                ))}
                                {stats.recentActivity.length === 0 && (
                                    <p className="text-center text-muted-foreground py-4">لا يوجد نشاط حتى الآن</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ──────── USERS TAB ──────── */}
            {tab === 'users' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Search */}
                    <div className="relative max-w-sm">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="ابحث عن مستخدم..."
                            className="pr-10"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                    </div>

                    {/* Users table */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="py-3 px-4 text-right font-medium">المستخدم</th>
                                    <th className="py-3 px-4 text-right font-medium hidden md:table-cell">البريد</th>
                                    <th className="py-3 px-4 text-center font-medium">الدور</th>
                                    <th className="py-3 px-4 text-center font-medium hidden sm:table-cell">المساهمات</th>
                                    <th className="py-3 px-4 text-center font-medium">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-medium">{u.name || '—'}</div>
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{u.email}</td>
                                        <td className="py-3 px-4 text-center">
                                            <Badge className={roleLabels[u.role]?.color || ''}>
                                                {roleLabels[u.role]?.ar || u.role}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-center hidden sm:table-cell text-muted-foreground">
                                            {u._count.contributions}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <select
                                                className="text-xs border rounded px-2 py-1 bg-background"
                                                value={u.role}
                                                disabled={roleUpdating === u.id}
                                                onChange={(e) => updateRole(u.id, e.target.value)}
                                            >
                                                {Object.entries(roleLabels).map(([value, label]) => (
                                                    <option key={value} value={value}>{label.ar}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                            لا يوجد مستخدمون
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
