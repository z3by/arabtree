import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ContributionList } from '@/components/profile/ContributionList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    const user = session.user

    const contributions = await prisma.contribution.findMany({
        where: { authorId: user.id },
        include: { node: { select: { name: true, nameAr: true } } },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="container py-10 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback className="text-2xl">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                        <div className="text-sm bg-secondary px-2 py-1 rounded">
                            Role: {user.role || 'VIEWER'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Your Contributions</h2>
                <ContributionList contributions={contributions as any} />
            </div>
        </div>
    )
}

