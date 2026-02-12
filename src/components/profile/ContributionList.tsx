import { Contribution } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

interface ContributionListProps {
    contributions: (Contribution & { node: { name: string; nameAr: string } })[]
}

const typeLabels: Record<string, string> = {
    ADD_NODE: 'إضافة',
    EDIT_NODE: 'تعديل',
    MERGE_NODES: 'دمج',
    ADD_SOURCE: 'مصدر',
    ADD_EVENT: 'حدث',
}

const statusConfig: Record<string, { ar: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' }> = {
    APPROVED: { ar: 'مقبول', variant: 'default' },
    REJECTED: { ar: 'مرفوض', variant: 'destructive' },
    PENDING: { ar: 'قيد المراجعة', variant: 'secondary' },
    DRAFT: { ar: 'مسودة', variant: 'outline' },
    WITHDRAWN: { ar: 'مسحوب', variant: 'outline' },
}

export function ContributionList({ contributions }: ContributionListProps) {
    if (contributions.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/10">
                لم تقدم أي مساهمات بعد.
            </div>
        )
    }

    return (
        <div className="space-y-3" dir="rtl">
            {contributions.map((contribution) => {
                const status = statusConfig[contribution.status] || statusConfig.DRAFT!
                return (
                    <Card key={contribution.id} className="hover:bg-muted/30 transition-colors">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-2">
                                <Badge variant={status.variant}>
                                    {status.ar}
                                </Badge>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {typeLabels[contribution.type] || contribution.type.replace('_', ' ')}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {contribution.submittedAt
                                    ? formatDistanceToNow(new Date(contribution.submittedAt), { addSuffix: true, locale: ar })
                                    : 'مسودة'}
                            </span>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <p className="text-sm">
                                تعديلات مقترحة على{' '}
                                <span className="font-bold">{contribution.node.nameAr} ({contribution.node.name})</span>
                            </p>
                            {contribution.summary && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    &quot;{contribution.summary}&quot;
                                </p>
                            )}
                            {contribution.reviewNote && (
                                <div className="mt-2 text-xs bg-muted p-2 rounded">
                                    <strong>ملاحظة المراجع:</strong> {contribution.reviewNote}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
