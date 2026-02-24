import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'
import Link from 'next/link'
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS_AR } from '@/lib/constants'

interface NodeData {
    id?: string
    label: string
    nameAr: string
    title?: string
    epithet?: string
    type: string
    birthYear?: number
    deathYear?: number
    childCount?: number
    isDirectAncestor?: boolean
    isConfirmed?: boolean
    expanded?: boolean
    onToggle?: (nodeId: string) => void
}

const typeColors = NODE_TYPE_COLORS

const typeTranslations = NODE_TYPE_LABELS_AR

const NodeCard = ({ id, data }: { id: string; data: NodeData }) => {
    const nodeId = data.id || id
    const hasChildren = data.childCount && data.childCount > 0
    const colors = typeColors[data.type] || { badge: 'bg-primary/5 border-primary/20 text-primary', ring: 'ring-primary/50' }

    // If data.isConfirmed is explicitly false, style as unconfirmed. Otherwise assume true.
    const isUnconfirmed = data.isConfirmed === false

    return (
        <div className={`relative group animate-grow-tree ${isUnconfirmed ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}>
            <Handle type="target" position={Position.Top} className="!bg-primary/60 w-3 h-3 !border-2 !border-background" />

            <Card className={`w-[210px] glass-card hover:shadow-xl hover:scale-105 transition-all duration-300 ${isUnconfirmed ? 'border-2 border-dashed border-muted-foreground/50' : 'border-none'} ${data.expanded && hasChildren && !isUnconfirmed ? `ring-2 ${colors.ring}` : ''} ${data.isDirectAncestor && !isUnconfirmed ? 'ring-2 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] dark:shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}`}>
                {/* Info link */}
                <Link
                    href={`/tree/${nodeId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary scale-75 group-hover:scale-100"
                    title="تفاصيل"
                >
                    <Info className="w-4 h-4" />
                </Link>

                <CardHeader className="p-3 pb-2 text-center space-y-1">
                    <Badge variant="outline" className={`w-fit mx-auto text-[10px] px-2 py-0 h-5 mb-1 ${colors.badge}`}>
                        {typeTranslations[data.type] || data.type}
                    </Badge>
                    {isUnconfirmed && (
                        <div className="text-[10px] items-center justify-center font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 rounded-full px-2 py-0.5 mx-auto w-fit mb-1 border border-orange-200 dark:border-orange-800">
                            ⚠️ نسب مُختلف فيه
                        </div>
                    )}
                    {data.isDirectAncestor && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 flex items-center justify-center w-6 h-6 bg-gradient-to-br from-amber-300 to-amber-600 text-white rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)] z-20">
                            <span className="text-xs">⭐</span>
                        </div>
                    )}
                    <CardTitle className="text-lg font-bold leading-none">{data.nameAr}</CardTitle>
                    <div className="text-xs text-muted-foreground font-medium">{data.label}</div>
                    {(data.title || data.epithet) && (
                        <div className="text-xs text-primary font-semibold mt-1">
                            {data.title || data.epithet}
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-3 pt-0 text-center text-xs text-muted-foreground">
                    {data.birthYear ? (
                        <span className="inline-block bg-muted/50 px-2 py-0.5 rounded-full">
                            {data.birthYear} - {data.deathYear || 'الحاضر'}
                        </span>
                    ) : (
                        <span className="opacity-50">حقبة غير معروفة</span>
                    )}

                    {hasChildren ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                data.onToggle?.(nodeId)
                            }}
                            className="mt-2 w-full flex items-center justify-center gap-1 text-primary cursor-pointer hover:font-bold transition-all p-1.5 hover:bg-primary/10 rounded-md group/toggle"
                        >
                            <span className="text-[10px]">{data.childCount} فرع</span>
                            {data.expanded ? (
                                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover/toggle:translate-y-0.5" />
                            ) : (
                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/toggle:-translate-x-0.5" />
                            )}
                        </button>
                    ) : null}
                </CardContent>
            </Card>

            <Handle type="source" position={Position.Bottom} className="!bg-primary/60 w-3 h-3 !border-2 !border-background" />
        </div>
    )
}

export default memo(NodeCard)
