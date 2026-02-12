import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronsDown, Info } from 'lucide-react'
import Link from 'next/link'

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
    expanded?: boolean
}

const NodeCard = ({ id, data }: { id: string; data: NodeData }) => {
    const nodeId = data.id || id

    return (
        <div className="relative group">
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground w-3 h-3" />

            <Card className={`w-[200px] glass-card border-none hover:shadow-lg hover:scale-105 transition-all duration-300 ${data.expanded ? 'ring-2 ring-primary/50' : ''}`}>
                {/* Info link to detail page */}
                <Link
                    href={`/tree/${nodeId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary"
                    title="تفاصيل"
                >
                    <Info className="w-4 h-4" />
                </Link>

                <CardHeader className="p-3 pb-2 text-center space-y-1">
                    <Badge variant="outline" className="w-fit mx-auto text-[10px] px-2 py-0 h-5 mb-1 bg-primary/5 border-primary/20 text-primary">
                        {data.type}
                    </Badge>
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
                            {data.birthYear} - {data.deathYear || 'Present'}
                        </span>
                    ) : (
                        <span className="opacity-50">Unknown Era</span>
                    )}

                    {data.childCount && data.childCount > 0 ? (
                        <div className="mt-2 flex items-center justify-center gap-1 text-primary cursor-pointer hover:font-bold transition-all p-1 hover:bg-primary/5 rounded">
                            <span className="text-[10px]">{data.childCount} descendants</span>
                            {data.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronsDown className="w-3 h-3" />}
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground w-3 h-3" />
        </div>
    )
}

export default memo(NodeCard)
