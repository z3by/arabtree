import { LineageNode } from '@prisma/client'

export interface LineageResponse {
    data: LineageNode[]
    meta: {
        total: number
        page: number
        limit: number
    }
}

export async function getLineageNodes(params: {
    root?: boolean
    parentId?: string
    all?: boolean
    limit?: number
    skip?: number
}): Promise<LineageResponse> {
    const searchParams = new URLSearchParams()
    if (params.all) searchParams.append('all', 'true')
    if (params.root) searchParams.append('root', 'true')
    if (params.parentId) searchParams.append('parentId', params.parentId)
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.skip) searchParams.append('skip', params.skip.toString())

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    let response: Response
    try {
        response = await fetch(`/api/lineage?${searchParams.toString()}`, {
            signal: controller.signal,
        })
    } catch (err) {
        clearTimeout(timeout)
        if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('Request timed out — the server took too long to respond')
        }
        throw err
    }
    clearTimeout(timeout)

    if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(
            body.type
                ? `Failed to fetch lineage nodes (${response.status}: ${body.type})`
                : `Failed to fetch lineage nodes (${response.status})`
        )
    }

    return response.json()
}

export interface LineageNodeDetail {
    node: LineageNode
    ancestors: Array<{
        id: string
        name: string
        nameAr: string
        type: string
    }>
    children: Array<{
        id: string
        name: string
        nameAr: string
        title: string | null
        epithet: string | null
        type: string
        birthYear: number | null
        deathYear: number | null
        childCount: number
        era: string | null
    }>
}

export async function getLineageNode(id: string): Promise<LineageNodeDetail> {
    const response = await fetch(`/api/lineage/${id}`)

    if (!response.ok) {
        throw new Error('Failed to fetch lineage node')
    }

    return response.json()
}
