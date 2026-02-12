import { Contribution } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface ContributionListProps {
    contributions: (Contribution & { node: { name: string; nameAr: string } })[]
}

export function ContributionList({ contributions }: ContributionListProps) {
    if (contributions.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/10">
                You haven't made any contributions yet.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {contributions.map((contribution) => (
                <Card key={contribution.id}>
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <Badge variant={
                                contribution.status === 'APPROVED' ? 'default' :
                                    contribution.status === 'REJECTED' ? 'destructive' :
                                        'secondary'
                            }>
                                {contribution.status}
                            </Badge>
                            <span className="text-sm font-medium">
                                {contribution.type.replace('_', ' ')}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {contribution.submittedAt ? formatDistanceToNow(new Date(contribution.submittedAt), { addSuffix: true }) : 'Draft'}
                        </span>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <p className="text-sm">
                            Proposed changes for <span className="font-bold">{contribution.node.nameAr} ({contribution.node.name})</span>
                        </p>
                        {contribution.summary && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                &quot;{contribution.summary}&quot;
                            </p>
                        )}
                        {contribution.reviewNote && (
                            <div className="mt-2 text-xs bg-muted p-2 rounded">
                                <strong>Reviewer Note:</strong> {contribution.reviewNote}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
