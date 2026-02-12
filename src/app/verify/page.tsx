'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Check, X, Loader2, Clock, User, ChevronDown,
    AlertTriangle, RefreshCw
} from 'lucide-react'

// ── Types ──
interface Contribution {
    id: string
    type: string
    status: string
    summary: string | null
    payload: Record<string, unknown>
    rejectionCount: number
    reviewNote: string | null
    submittedAt: string | null
    createdAt: string
    author: { id: string; name: string | null; image: string | null }
    node: { id: string; name: string; nameAr: string; type: string }
    reviewer: { id: string; name: string | null } | null
}

const typeLabels: Record<string, string> = {
    ADD_NODE: 'إضافة',
    EDIT_NODE: 'تعديل',
    MERGE_NODES: 'دمج',
    ADD_SOURCE: 'مصدر',
    ADD_EVENT: 'حدث',
}

const statusLabels: Record<string, { ar: string; color: string }> = {
    PENDING: { ar: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    APPROVED: { ar: 'مقبول', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
    REJECTED: { ar: 'مرفوض', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
    DRAFT: { ar: 'مسودة', color: 'bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300' },
    WITHDRAWN: { ar: 'مسحوب', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400' },
}

export default function VerifyPage() {
    const [contributions, setContributions] = useState<Contribution[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState('PENDING')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [reviewNote, setReviewNote] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchContributions = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/contributions?status=${statusFilter}&limit=50`)
            if (!response.ok) {
                if (response.status === 401) throw new Error('يجب تسجيل الدخول')
                if (response.status === 403) throw new Error('ليس لديك صلاحية الوصول لهذه الصفحة')
                throw new Error('فشل في تحميل المساهمات')
            }
            const { data } = await response.json()
            setContributions(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ')
        } finally {
            setLoading(false)
        }
    }, [statusFilter])

    useEffect(() => { fetchContributions() }, [fetchContributions])

    async function handleAction(id: string, status: 'APPROVED' | 'REJECTED') {
        setActionLoading(id)
        try {
            const response = await fetch(`/api/contributions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, reviewNote: reviewNote || undefined }),
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || 'فشل في تحديث الحالة')
            }

            // Remove from list and reset
            setContributions((prev) => prev.filter((c) => c.id !== id))
            setExpandedId(null)
            setReviewNote('')
        } catch (err) {
            alert(err instanceof Error ? err.message : 'حدث خطأ')
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="container max-w-4xl py-10 space-y-6">
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">لوحة المراجعة</h1>
                    <p className="text-muted-foreground">مراجعة واعتماد المساهمات المقدمة</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchContributions} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    تحديث
                </Button>
            </div>

            {/* ── Status filter tabs ── */}
            <div className="flex gap-2 flex-wrap">
                {Object.entries(statusLabels).map(([status, label]) => (
                    <button
                        key={status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${statusFilter === status
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background hover:bg-muted border-muted'
                            }`}
                        onClick={() => setStatusFilter(status)}
                    >
                        {label.ar}
                    </button>
                ))}
            </div>

            {/* ── Content ── */}
            {loading && (
                <div className="text-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                </div>
            )}

            {error && (
                <div className="text-center py-16">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                    <p className="text-destructive">{error}</p>
                </div>
            )}

            {!loading && !error && contributions.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">لا توجد مساهمات {statusLabels[statusFilter]?.ar}</p>
                </div>
            )}

            {/* ── Contributions list ── */}
            <div className="space-y-4">
                {contributions.map((c) => (
                    <Card key={c.id} className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <Badge className={statusLabels[c.status]?.color || ''}>
                                            {statusLabels[c.status]?.ar || c.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px]">
                                            {typeLabels[c.type] || c.type}
                                        </Badge>
                                        {c.rejectionCount > 0 && (
                                            <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                                                رُفض {c.rejectionCount}×
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-base">
                                        {c.node.nameAr} <span className="text-muted-foreground font-normal text-sm">({c.node.name})</span>
                                    </CardTitle>
                                    {c.summary && (
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.summary}</p>
                                    )}
                                </div>
                                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${expandedId === c.id ? 'rotate-180' : ''}`} />
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {c.author.name || 'مجهول'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(c.submittedAt || c.createdAt).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                            </div>
                        </CardHeader>

                        {/* ── Expanded detail ── */}
                        {expandedId === c.id && (
                            <CardContent className="p-4 pt-0 border-t mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Payload data */}
                                <div className="space-y-3 mt-3">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">البيانات المقترحة</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm p-3 rounded-lg bg-muted/30">
                                        {Object.entries(c.payload as Record<string, unknown>).map(([key, value]) => (
                                            value != null && value !== '' && (
                                                <div key={key}>
                                                    <span className="text-muted-foreground text-xs">{key}:</span>
                                                    <span className="block font-medium">{String(value)}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>

                                    {c.reviewNote && (
                                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                            <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">ملاحظات المراجع السابقة:</div>
                                            <p className="text-sm">{c.reviewNote}</p>
                                        </div>
                                    )}

                                    {/* Actions — only show for PENDING */}
                                    {c.status === 'PENDING' && (
                                        <div className="space-y-3 pt-2">
                                            <Textarea
                                                placeholder="ملاحظات للمساهم (اختياري)..."
                                                value={reviewNote}
                                                onChange={(e) => setReviewNote(e.target.value)}
                                                dir="rtl"
                                                className="min-h-[80px]"
                                            />
                                            <div className="flex gap-3 justify-end">
                                                <Button
                                                    variant="outline"
                                                    className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                    disabled={actionLoading === c.id}
                                                    onClick={() => handleAction(c.id, 'REJECTED')}
                                                >
                                                    {actionLoading === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                    رفض
                                                </Button>
                                                <Button
                                                    className="gap-2"
                                                    disabled={actionLoading === c.id}
                                                    onClick={() => handleAction(c.id, 'APPROVED')}
                                                >
                                                    {actionLoading === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    اعتماد
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
