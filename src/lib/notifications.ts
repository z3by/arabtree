import prisma from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

/**
 * Create a notification for a specific user.
 */
export async function createNotification({
    userId,
    type,
    title,
    titleAr,
    message,
    messageAr,
    link,
    entityId,
    entityType,
}: {
    userId: string
    type: NotificationType
    title: string
    titleAr: string
    message?: string
    messageAr?: string
    link?: string
    entityId?: string
    entityType?: string
}) {
    return prisma.notification.create({
        data: {
            userId,
            type,
            title,
            titleAr,
            message,
            messageAr,
            link,
            entityId,
            entityType,
        },
    })
}

/**
 * Notify a contribution author when their contribution status changes.
 */
export async function notifyContributionStatus(
    authorId: string,
    contributionId: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNote?: string
) {
    const isApproved = status === 'APPROVED'

    return createNotification({
        userId: authorId,
        type: isApproved
            ? NotificationType.CONTRIBUTION_APPROVED
            : NotificationType.CONTRIBUTION_REJECTED,
        title: isApproved
            ? 'Contribution Approved'
            : 'Contribution Rejected',
        titleAr: isApproved
            ? 'تمت الموافقة على مساهمتك'
            : 'تم رفض مساهمتك',
        message: reviewNote || undefined,
        messageAr: reviewNote || undefined,
        link: '/contribute',
        entityId: contributionId,
        entityType: 'Contribution',
    })
}

/**
 * Notify all verifiers when a new contribution is submitted for review.
 */
export async function notifyNewContribution(
    contributionId: string,
    summary: string
) {
    // Find all verifiers and admins
    const verifiers = await prisma.user.findMany({
        where: { role: { in: ['VERIFIER', 'ADMIN'] } },
        select: { id: true },
    })

    if (verifiers.length === 0) return []

    return prisma.notification.createMany({
        data: verifiers.map((v) => ({
            userId: v.id,
            type: NotificationType.CONTRIBUTION_PENDING,
            title: 'New contribution awaiting review',
            titleAr: 'مساهمة جديدة بانتظار المراجعة',
            message: summary,
            messageAr: summary,
            link: '/verify',
            entityId: contributionId,
            entityType: 'Contribution',
        })),
    })
}

/**
 * Notify a user about a role change.
 */
export async function notifyRoleChange(
    userId: string,
    newRole: string
) {
    const roleNames: Record<string, string> = {
        VIEWER: 'مشاهد',
        CONTRIBUTOR: 'مساهم',
        VERIFIER: 'مراجع',
        ADMIN: 'مدير',
    }

    return createNotification({
        userId,
        type: NotificationType.ROLE_CHANGED,
        title: `Your role has been updated to ${newRole}`,
        titleAr: `تم تحديث صلاحيتك إلى ${roleNames[newRole] || newRole}`,
        link: '/profile',
    })
}
