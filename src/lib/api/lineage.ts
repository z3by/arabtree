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
    limit?: number
    skip?: number
}): Promise<LineageResponse> {
    const searchParams = new URLSearchParams()
    if (params.root) searchParams.append('root', 'true')
    if (params.parentId) searchParams.append('parentId', params.parentId)
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.skip) searchParams.append('skip', params.skip.toString())

    const response = await fetch(`/api/lineage?${searchParams.toString()}`)

    if (!response.ok) {
        throw new Error('Failed to fetch lineage nodes')
    }

    return response.json()
}
