'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, X, Filter, ChevronDown } from 'lucide-react'

// ── Type labels ──
const typeLabels: Record<string, string> = {
    ROOT: 'جذر',
    TRIBE: 'قبيلة',
    CLAN: 'عشيرة',
    FAMILY: 'عائلة',
    INDIVIDUAL: 'فرد',
}

const typeColors: Record<string, string> = {
    ROOT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    TRIBE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    CLAN: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    FAMILY: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-700',
    INDIVIDUAL: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300 border-slate-300 dark:border-slate-700',
}

interface SearchNode {
    id: string
    name: string
    nameAr: string
    title: string | null
    epithet: string | null
    type: string
    status: string
    birthYear: number | null
    deathYear: number | null
    birthPlace: string | null
    era: string | null
    childCount: number
    generationDepth: number
}

interface FacetItem {
    value: string
    count: number
}

interface SearchResponse {
    data: SearchNode[]
    meta: { total: number; page: number; limit: number }
    facets?: {
        type?: FacetItem[]
        era?: FacetItem[]
        status?: FacetItem[]
    }
}

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize state from URL params
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')
    const [eraFilter, setEraFilter] = useState(searchParams.get('era') || '')
    const [results, setResults] = useState<SearchNode[]>([])
    const [total, setTotal] = useState(0)
    const [facets, setFacets] = useState<SearchResponse['facets']>({})
    const [loading, setLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(!!typeFilter || !!eraFilter)
    const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('q') || '')

    // Debounce query
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    // Update URL params on filter/query change
    const updateUrl = useCallback((q: string, type: string, era: string) => {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (type) params.set('type', type)
        if (era) params.set('era', era)
        const paramStr = params.toString()
        router.replace(`/search${paramStr ? `?${paramStr}` : ''}`, { scroll: false })
    }, [router])

    // Search effect
    useEffect(() => {
        const search = async () => {
            if (debouncedQuery.length < 2) {
                setResults([])
                setTotal(0)
                setFacets({})
                return
            }

            setLoading(true)
            try {
                const params = new URLSearchParams({ q: debouncedQuery, facets: 'true' })
                if (typeFilter) params.set('type', typeFilter)
                if (eraFilter) params.set('era', eraFilter)

                const response = await fetch(`/api/search?${params}`)
                const json: SearchResponse = await response.json()

                setResults(json.data || [])
                setTotal(json.meta?.total || 0)
                if (json.facets) setFacets(json.facets)

                updateUrl(debouncedQuery, typeFilter, eraFilter)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        search()
    }, [debouncedQuery, typeFilter, eraFilter, updateUrl])

    const clearFilters = () => {
        setTypeFilter('')
        setEraFilter('')
    }

    const hasActiveFilters = !!typeFilter || !!eraFilter

    return (
        <div className="container py-10 space-y-6 max-w-5xl mx-auto">
            {/* ── Header ── */}
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">البحث في شجرة الأنساب</h1>
                <p className="text-muted-foreground">أدخل اسم الشخص، القبيلة، أو العائلة التي تبحث عنها.</p>
            </div>

            {/* ── Search bar ── */}
            <div className="relative">
                <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                    className="pr-12 h-12 text-lg"
                    placeholder="ابحث عن اسم... (مثال: عدنان، تميم)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && <Loader2 className="absolute left-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />}
            </div>

            {/* ── Filter toggle + active filters ── */}
            <div className="flex items-center gap-2 flex-wrap">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="w-4 h-4" />
                    تصفية
                    <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>

                {hasActiveFilters && (
                    <>
                        {typeFilter && (
                            <Badge className={`${typeColors[typeFilter] || ''} border gap-1 cursor-pointer`} onClick={() => setTypeFilter('')}>
                                {typeLabels[typeFilter] || typeFilter}
                                <X className="w-3 h-3" />
                            </Badge>
                        )}
                        {eraFilter && (
                            <Badge variant="outline" className="gap-1 cursor-pointer" onClick={() => setEraFilter('')}>
                                {eraFilter}
                                <X className="w-3 h-3" />
                            </Badge>
                        )}
                        <button className="text-xs text-muted-foreground hover:text-primary underline" onClick={clearFilters}>
                            مسح الكل
                        </button>
                    </>
                )}

                {total > 0 && (
                    <span className="text-sm text-muted-foreground mr-auto">{total} نتيجة</span>
                )}
            </div>

            {/* ── Filter panel ── */}
            {showFilters && debouncedQuery.length >= 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/30">
                    {/* Type facets */}
                    {facets?.type && facets.type.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">النوع</h3>
                            <div className="flex flex-wrap gap-2">
                                {facets.type.map((f) => (
                                    <button
                                        key={f.value}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${typeFilter === f.value
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-muted'
                                            }`}
                                        onClick={() => setTypeFilter(typeFilter === f.value ? '' : f.value)}
                                    >
                                        {typeLabels[f.value] || f.value} ({f.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Era facets */}
                    {facets?.era && facets.era.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">العصر</h3>
                            <div className="flex flex-wrap gap-2">
                                {facets.era.map((f) => (
                                    <button
                                        key={f.value}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${eraFilter === f.value
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-muted'
                                            }`}
                                        onClick={() => setEraFilter(eraFilter === f.value ? '' : f.value)}
                                    >
                                        {f.value} ({f.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Results grid ── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((node) => (
                    <Link href={`/tree/${node.id}`} key={node.id}>
                        <Card className="h-full hover:bg-muted/50 transition-all cursor-pointer border hover:border-primary/30 hover:shadow-md group">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className={`${typeColors[node.type] || ''} border text-[10px] px-2 py-0`}>
                                        {typeLabels[node.type] || node.type}
                                    </Badge>
                                    {node.birthYear && (
                                        <span className="text-xs text-muted-foreground">
                                            {node.birthYear}{node.deathYear ? ` - ${node.deathYear}` : ''} م
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-lg pt-2 group-hover:text-primary transition-colors">{node.nameAr}</CardTitle>
                                <div className="text-sm text-muted-foreground">{node.name}</div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-1">
                                {node.title && <div className="text-primary font-medium">{node.title}</div>}
                                {node.era && <div>{node.era}</div>}
                                {node.birthPlace && <div>📍 {node.birthPlace}</div>}
                                {node.childCount > 0 && <div>{node.childCount} فرع</div>}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {debouncedQuery.length >= 2 && results.length === 0 && !loading && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        لا توجد نتائج مطابقة لـ &quot;{debouncedQuery}&quot;.{' '}
                        <Link href="/contribute" className="underline text-primary">هل تريد إضافتها؟</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="container py-10 max-w-5xl mx-auto text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
