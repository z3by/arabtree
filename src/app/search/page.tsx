'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LineageNode } from '@prisma/client'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2 } from 'lucide-react'

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<LineageNode[]>([])
    const [loading, setLoading] = useState(false)
    const [debouncedQuery, setDebouncedQuery] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        const search = async () => {
            if (debouncedQuery.length < 2) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
                const { data } = await response.json()
                setResults(data || [])
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        search()
    }, [debouncedQuery])

    return (
        <div className="container py-10 space-y-8 max-w-4xl mx-auto">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">البحث في شجرة الأنساب</h1>
                <p className="text-muted-foreground">أدخل اسم الشخص، القبيلة، أو العائلة التي تبحث عنها.</p>
            </div>

            <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pr-10 h-12 text-lg"
                    placeholder="ابحث عن اسم... (مثال: عدنان، تميم)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && <Loader2 className="absolute left-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((node) => (
                    <Link href={`/tree?root=true&focus=${node.id}`} key={node.id}>
                        <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-dashed hover:border-solid">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline">{node.type}</Badge>
                                    {node.birthYear && <span className="text-xs text-muted-foreground">{node.birthYear}</span>}
                                </div>
                                <CardTitle className="text-lg pt-2">{node.nameAr}</CardTitle>
                                <div className="text-sm text-muted-foreground">{node.name}</div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm">
                                {node.title && <div className="text-primary font-medium mt-2">{node.title}</div>}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {debouncedQuery.length >= 2 && results.length === 0 && !loading && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        لا توجد نتائج مطابقة لـ "{debouncedQuery}". <Link href="/contribute" className="underline text-primary">هل تريد إضافتها؟</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
