import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronsDown } from 'lucide-react'

interface NodeData {
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

const NodeCard = ({ data }: { data: NodeData }) => {
    return (
        <div className="relative group">
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground w-3 h-3" />

            <Card className={`w-[200px] border-2 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 ${data.expanded ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="p-3 pb-2 text-center space-y-1">
                    <Badge variant="outline" className="w-fit mx-auto text-[10px] px-2 py-0 h-5 mb-1 bg-slate-100 dark:bg-slate-800">
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
                        <span>
                            {data.birthYear} - {data.deathYear || 'Present'}
                        </span>
                    ) : (
                        <span>Unknown Era</span>
                    )}

                    {data.childCount && data.childCount > 0 ? (
                        <div className="mt-2 flex items-center justify-center gap-1 text-primary cursor-pointer hover:font-bold">
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
