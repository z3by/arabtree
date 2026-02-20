import { z } from 'zod'

// ── Node type hierarchy (enforced on creation) ──
export const NODE_TYPE_ORDER = ['ROOT', 'TRIBE', 'CLAN', 'FAMILY', 'INDIVIDUAL'] as const

export const nodeTypeEnum = z.enum(NODE_TYPE_ORDER)
export type NodeTypeEnum = z.infer<typeof nodeTypeEnum>

// ── Create lineage node schema ──
export const createLineageNodeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(200),
    nameAr: z.string().min(2, 'Arabic name must be at least 2 characters').max(200),
    title: z.string().max(200).optional(),
    epithet: z.string().max(200).optional(),
    alternateNames: z.array(z.string()).optional().default([]),
    type: nodeTypeEnum,
    parentId: z.string().optional(), // Optional only for ROOT nodes
    biography: z.string().max(5000).optional(),
    biographyAr: z.string().max(5000).optional(),
    birthYear: z.number().int().min(-5000).max(new Date().getFullYear()).optional(),
    birthYearHijri: z.number().int().optional(),
    deathYear: z.number().int().min(-5000).max(new Date().getFullYear()).optional(),
    deathYearHijri: z.number().int().optional(),
    birthPlace: z.string().max(200).optional(),
    era: z.string().max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    isDirectAncestor: z.boolean().optional(),
})

export type CreateLineageNodeInput = z.infer<typeof createLineageNodeSchema>

// ── Update lineage node schema (all fields optional) ──
export const updateLineageNodeSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    nameAr: z.string().min(2).max(200).optional(),
    title: z.string().max(200).nullable().optional(),
    epithet: z.string().max(200).nullable().optional(),
    alternateNames: z.array(z.string()).optional(),
    biography: z.string().max(5000).nullable().optional(),
    biographyAr: z.string().max(5000).nullable().optional(),
    birthYear: z.number().int().min(-5000).max(new Date().getFullYear()).nullable().optional(),
    birthYearHijri: z.number().int().nullable().optional(),
    deathYear: z.number().int().min(-5000).max(new Date().getFullYear()).nullable().optional(),
    deathYearHijri: z.number().int().nullable().optional(),
    birthPlace: z.string().max(200).nullable().optional(),
    era: z.string().max(100).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    isDirectAncestor: z.boolean().optional(),
})

export type UpdateLineageNodeInput = z.infer<typeof updateLineageNodeSchema>
