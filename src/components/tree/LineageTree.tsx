'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
    addEdge,
    Connection,
    Edge,
    Node,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    Panel,
    useReactFlow,
    ReactFlowProvider,
    Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import dagre from 'dagre'
import { Button } from '@/components/ui/button'
import { LineageNode } from '@prisma/client'
import NodeCard from './NodeCard'
import { getLineageNodes } from '@/lib/api/lineage'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'

const nodeTypes = {
    custom: NodeCard,
}

const nodeWidth = 200
const nodeHeight = 150 // adjusted for taller card

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))

    dagreGraph.setGraph({ rankdir: 'TB' })

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        node.targetPosition = Position.Top
        node.sourcePosition = Position.Bottom
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches React Flow's anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        }
        return node
    })

    return { nodes, edges }
}

// Recursively collect all descendant node IDs from a given node
function getDescendantIds(nodeId: string, edges: Edge[]): Set<string> {
    const descendants = new Set<string>()
    const queue = [nodeId]
    while (queue.length > 0) {
        const current = queue.shift()!
        for (const edge of edges) {
            if (edge.source === current && !descendants.has(edge.target)) {
                descendants.add(edge.target)
                queue.push(edge.target)
            }
        }
    }
    return descendants
}

function LineageTreeInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const { fitView } = useReactFlow()
    const [loading, setLoading] = useState(false)

    // Store full tree data so collapse/expand doesn't need re-fetching
    const allNodesRef = useRef<Node[]>([])
    const allEdgesRef = useRef<Edge[]>([])
    // Track which node IDs are currently collapsed
    const collapsedRef = useRef<Set<string>>(new Set())

    // Given full data + collapsed set, compute visible nodes/edges
    const computeVisible = useCallback(() => {
        const collapsed = collapsedRef.current
        const allEdges = allEdgesRef.current

        // Find all nodes hidden by collapsed ancestors
        const hiddenIds = new Set<string>()
        for (const collapsedId of collapsed) {
            const descendants = getDescendantIds(collapsedId, allEdges)
            for (const d of descendants) hiddenIds.add(d)
        }

        const visibleNodes = allNodesRef.current
            .filter(n => !hiddenIds.has(n.id))
            .map(n => ({
                ...n,
                data: {
                    ...n.data,
                    expanded: !collapsed.has(n.id),
                },
            }))

        const visibleNodeIds = new Set(visibleNodes.map(n => n.id))
        const visibleEdges = allEdges.filter(
            e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
        )

        return getLayoutedElements(visibleNodes, visibleEdges)
    }, [])

    // Toggle collapse/expand for a node
    const handleToggle = useCallback((nodeId: string) => {
        const collapsed = collapsedRef.current
        if (collapsed.has(nodeId)) {
            collapsed.delete(nodeId)
        } else {
            collapsed.add(nodeId)
        }

        const { nodes: layoutedNodes, edges: layoutedEdges } = computeVisible()
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
        setTimeout(() => fitView({ duration: 400 }), 50)
    }, [computeVisible, setNodes, setEdges, fitView])

    // Initial fetch for ALL nodes — build full tree
    useEffect(() => {
        const init = async () => {
            console.log('LineageTree: Starting initial fetch')
            setLoading(true)
            try {
                const { data } = await getLineageNodes({ all: true })
                console.log(`LineageTree: Fetched ${data.length} nodes`)

                const initialNodes: Node[] = data.map((node: LineageNode) => ({
                    id: node.id,
                    type: 'custom',
                    position: { x: 0, y: 0 },
                    data: {
                        label: node.name,
                        nameAr: node.nameAr,
                        title: node.title,
                        epithet: node.epithet,
                        type: node.type,
                        birthYear: node.birthYear,
                        deathYear: node.deathYear,
                        childCount: node.childCount,
                        expanded: true,
                        onToggle: handleToggle,
                    },
                }))

                // Build edges from parentId relationships
                const initialEdges: Edge[] = data
                    .filter((node: LineageNode) => node.parentId)
                    .map((node: LineageNode) => ({
                        id: `${node.parentId}-${node.id}`,
                        source: node.parentId!,
                        target: node.id,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: 'hsl(142, 60%, 40%)', strokeWidth: 2 },
                    }))

                // Store full data in refs
                allNodesRef.current = initialNodes
                allEdgesRef.current = initialEdges
                collapsedRef.current = new Set()

                console.log('LineageTree: Applying initial layout')
                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges)
                setNodes(layoutedNodes)
                setEdges(layoutedEdges)
                console.log('LineageTree: Initial layout complete')

                // Fit view after a brief delay to allow rendering
                setTimeout(() => {
                    console.log('LineageTree: Fitting view')
                    fitView()
                }, 100)
            } catch (error) {
                const msg = error instanceof Error ? error.message : 'Unknown error'
                toast.error(`Failed to load lineage tree: ${msg}`)
                console.error(error)
                Sentry.captureException(error, {
                    tags: { component: 'LineageTree', action: 'initial-load' }
                })
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [fitView, setNodes, setEdges]) // Removed handleToggle to prevent re-fetching on toggle-handler updates

    // Keep onToggle callback fresh in allNodesRef when handleToggle changes
    useEffect(() => {
        allNodesRef.current = allNodesRef.current.map(n => ({
            ...n,
            data: { ...n.data, onToggle: handleToggle },
        }))
    }, [handleToggle])

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) =>
                addEdge({ ...params, type: 'smoothstep', animated: true }, eds)
            ),
        [setEdges]
    )

    const onLayout = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            nodes,
            edges
        )
        setNodes([...layoutedNodes])
        setEdges([...layoutedEdges])
        fitView({ duration: 800 })
    }, [nodes, edges, setNodes, setEdges, fitView])

    return (
        <div className="h-[80vh] w-full border rounded-xl bg-slate-50 dark:bg-slate-950 shadow-inner relative group overflow-hidden">
            {/* Loading skeleton */}
            {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                        <span className="text-5xl animate-sway">🌴</span>
                        <div className="space-y-3 w-48">
                            <div className="h-2 bg-primary/20 rounded-full animate-shimmer" />
                            <div className="h-2 bg-primary/10 rounded-full animate-shimmer stagger-1 w-3/4 mx-auto" />
                            <div className="h-2 bg-primary/10 rounded-full animate-shimmer stagger-2 w-1/2 mx-auto" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">جاري تحميل الشجرة...</p>
                    </div>
                </div>
            )}

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-50 dark:bg-slate-950"
            >
                <Controls className="!bg-background/80 !backdrop-blur-sm !border-border/50 !rounded-lg !shadow-md" />
                <Background gap={16} size={1} color="hsl(142, 20%, 85%)" />
                <Panel position="top-right">
                    <Button onClick={onLayout} variant="secondary" size="sm" disabled={loading} className="rounded-lg shadow-sm">
                        {loading ? 'جاري التحميل...' : 'إعادة ترتيب'}
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    )
}

export default function LineageTree() {
    return (
        <ReactFlowProvider>
            <LineageTreeInner />
        </ReactFlowProvider>
    )
}
