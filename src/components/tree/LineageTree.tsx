'use client'

import { useCallback, useEffect, useState } from 'react'
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

function LineageTreeInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const { fitView } = useReactFlow()
    const [loading, setLoading] = useState(false)

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
    }, [fitView, setNodes, setEdges]) // Added dependencies

    const onNodeClick = useCallback(async (event: React.MouseEvent, node: Node) => {
        // If already expanded, maybe collapse? For now, let's just ignore or toggle.
        // Implementing toggle off is complex because we need to remove descendants.
        // Let's just focus on expanding for now.

        if (node.data.expanded) {
            // Optional: Implement collapse logic here in future
            return
        }

        if (!node.data.childCount || node.data.childCount === 0) {
            return
        }

        setLoading(true)
        try {
            const { data: children } = await getLineageNodes({ parentId: node.id })

            if (children.length === 0) {
                toast.info('No children found')
                return
            }

            // Create new nodes
            const newNodes: Node[] = children.map((child: LineageNode) => ({
                id: child.id,
                type: 'custom',
                position: { x: 0, y: 0 }, // Position will be set by layout
                data: {
                    label: child.name,
                    nameAr: child.nameAr,
                    title: child.title,
                    epithet: child.epithet,
                    type: child.type,
                    birthYear: child.birthYear,
                    deathYear: child.deathYear,
                    childCount: child.childCount,
                    expanded: false,
                },
            }))

            // Create new edges
            const newEdges: Edge[] = children.map((child) => ({
                id: `${node.id}-${child.id}`,
                source: node.id,
                target: child.id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#94a3b8' }
            }))

            // Update parsed nodes to mark parent as expanded
            const updatedNodes = nodes.map(n =>
                n.id === node.id ? { ...n, data: { ...n.data, expanded: true } } : n
            )

            // Merge and Layout
            const allNodes = [...updatedNodes, ...newNodes] // Be careful of duplicates if we implement collapse/expand toggle
            const allEdges = [...edges, ...newEdges]

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(allNodes, allEdges)

            setNodes(layoutedNodes)
            setEdges(layoutedEdges)

        } catch (error) {
            toast.error('Failed to load descendants')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [nodes, edges, setNodes, setEdges])

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
                onNodeClick={onNodeClick}
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
