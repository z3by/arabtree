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
            setLoading(true)
            try {
                const { data } = await getLineageNodes({ all: true })

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
                        style: { stroke: '#94a3b8' },
                    }))

                // Store full data in refs
                allNodesRef.current = initialNodes
                allEdgesRef.current = initialEdges
                collapsedRef.current = new Set()

                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges)
                setNodes(layoutedNodes)
                setEdges(layoutedEdges)

                // Fit view after a brief delay to allow rendering
                setTimeout(() => fitView(), 100)
            } catch (error) {
                toast.error('Failed to load lineage tree')
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [fitView, setNodes, setEdges, handleToggle]) // Added dependencies

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
        <div className="h-[80vh] w-full border rounded-lg bg-slate-50 dark:bg-slate-950 shadow-inner relative group">
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
                <Controls />
                <Background gap={12} size={1} />
                <Panel position="top-right">
                    <Button onClick={onLayout} variant="secondary" size="sm" disabled={loading}>
                        {loading ? 'Processing...' : 'Reset Layout'}
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
