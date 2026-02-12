import { z } from 'zod'

export const contributionSchema = z.object({
    type: z.enum(['ADD_NODE', 'EDIT_NODE', 'MERGE_NODES', 'ADD_SOURCE', 'ADD_EVENT']),
    nodeId: z.string().optional(), // Required for EDIT/MERGE/ADD_SOURCE
    parentId: z.string().optional(), // Required for ADD_NODE

    // Payload for ADD_NODE / EDIT_NODE
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    nameAr: z.string().min(2, 'Arabic name must be at least 2 characters').optional(),
    title: z.string().optional(),
    epithet: z.string().optional(),
    nodeType: z.enum(['ROOT', 'TRIBE', 'CLAN', 'FAMILY', 'INDIVIDUAL']).optional(),
    birthYear: z.number().min(-5000).max(new Date().getFullYear()).optional(),
    deathYear: z.number().min(-5000).max(new Date().getFullYear()).optional(),
    biography: z.string().optional(),

    // Justification
    summary: z.string().min(10, 'Please provide a summary of your contribution'),

    // Contact info (if not using auth, but we are)
})

export type ContributionFormValues = z.infer<typeof contributionSchema>
