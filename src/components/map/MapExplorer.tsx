'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Types ──
interface MapNode {
    id: string
    name: string
    nameAr: string
    type: string
    era: string | null
    birthYear: number | null
    deathYear: number | null
    birthPlace: string | null
    latitude: number
    longitude: number
    title: string | null
    childCount: number
}

interface MapEvent {
    id: string
    title: string
    titleAr: string | null
    description: string | null
    descriptionAr: string | null
    yearCE: number | null
    yearHijri: number | null
    eventType: string
    location: string | null
    latitude: number
    longitude: number
    node: {
        id: string
        name: string
        nameAr: string
        type: string
    }
}

// ── Marker colors by node type ──
const NODE_COLORS: Record<string, string> = {
    ROOT: '#d97706',       // amber/gold
    TRIBE: '#16a34a',      // green
    CLAN: '#2563eb',       // blue
    FAMILY: '#7c3aed',     // violet
    INDIVIDUAL: '#dc2626', // red
}

const NODE_TYPE_AR: Record<string, string> = {
    ROOT: 'جذر',
    TRIBE: 'قبيلة',
    CLAN: 'عشيرة',
    FAMILY: 'عائلة',
    INDIVIDUAL: 'فرد',
}

// ── Event icons by type ──
const EVENT_ICONS: Record<string, string> = {
    MIGRATION: '🐪',
    BATTLE: '⚔️',
    FOUNDING: '🏗️',
    ALLIANCE: '🤝',
    GENEALOGICAL: '👤',
    CULTURAL: '📜',
    OTHER: '📍',
}

const EVENT_TYPE_AR: Record<string, string> = {
    MIGRATION: 'هجرة',
    BATTLE: 'معركة',
    FOUNDING: 'تأسيس',
    ALLIANCE: 'تحالف',
    GENEALOGICAL: 'أنساب',
    CULTURAL: 'ثقافة',
    OTHER: 'أخرى',
}

// ── Create custom marker icons ──
function createNodeIcon(type: string) {
    const color = NODE_COLORS[type] || '#6b7280'
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 28px; height: 28px; border-radius: 50%;
            background: ${color}; border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            display: flex; align-items: center; justify-content: center;
            font-size: 11px; color: white; font-weight: 700;
        ">${type[0]}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
    })
}

function createEventIcon(eventType: string) {
    const emoji = EVENT_ICONS[eventType] || '📍'
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 32px; height: 32px; border-radius: 6px;
            background: white; border: 2px solid #94a3b8;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
            font-size: 16px;
        ">${emoji}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
    })
}

// ── Timeline slider component ──
function TimelineSlider({
    yearFrom,
    yearTo,
    onYearFromChange,
    onYearToChange,
}: {
    yearFrom: number
    yearTo: number
    onYearFromChange: (y: number) => void
    onYearToChange: (y: number) => void
}) {
    return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 text-right">
                ⏱️ الفترة الزمنية
            </h3>
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <label className="text-xs text-slate-500 block text-right mb-1">من سنة</label>
                    <input
                        type="range"
                        min={-500}
                        max={2000}
                        step={50}
                        value={yearFrom}
                        onChange={(e) => onYearFromChange(parseInt(e.target.value))}
                        className="w-full accent-emerald-600"
                        dir="ltr"
                    />
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 block text-center">
                        {yearFrom < 0 ? `${Math.abs(yearFrom)} ق.م` : `${yearFrom} م`}
                    </span>
                </div>
                <div className="flex-1">
                    <label className="text-xs text-slate-500 block text-right mb-1">إلى سنة</label>
                    <input
                        type="range"
                        min={-500}
                        max={2000}
                        step={50}
                        value={yearTo}
                        onChange={(e) => onYearToChange(parseInt(e.target.value))}
                        className="w-full accent-emerald-600"
                        dir="ltr"
                    />
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 block text-center">
                        {yearTo < 0 ? `${Math.abs(yearTo)} ق.م` : `${yearTo} م`}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ── Legend component ──
function MapLegend() {
    return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 text-right">
                🗺️ دليل الخريطة
            </h3>
            <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 text-right">الأنساب</p>
                {Object.entries(NODE_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-slate-600 dark:text-slate-400">{NODE_TYPE_AR[type]}</span>
                        <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow"
                            style={{ background: color }}
                        />
                    </div>
                ))}
                <hr className="border-slate-200 dark:border-slate-600 my-2" />
                <p className="text-xs font-semibold text-slate-500 text-right">الأحداث</p>
                {Object.entries(EVENT_ICONS).map(([type, emoji]) => (
                    <div key={type} className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-slate-600 dark:text-slate-400">{EVENT_TYPE_AR[type]}</span>
                        <span className="text-sm">{emoji}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── FitBounds helper ──
function FitBoundsController({ nodes, events }: { nodes: MapNode[]; events: MapEvent[] }) {
    const map = useMap()
    useEffect(() => {
        const points: [number, number][] = [
            ...nodes.map((n) => [n.latitude, n.longitude] as [number, number]),
            ...events.map((e) => [e.latitude, e.longitude] as [number, number]),
        ]
        if (points.length > 1) {
            const bounds = L.latLngBounds(points)
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
        }
    }, [map, nodes, events])
    return null
}

// ── Main component ──
export default function MapExplorer() {
    const [nodes, setNodes] = useState<MapNode[]>([])
    const [events, setEvents] = useState<MapEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [yearFrom, setYearFrom] = useState(-500)
    const [yearTo, setYearTo] = useState(2000)
    const [showNodes, setShowNodes] = useState(true)
    const [showEvents, setShowEvents] = useState(true)
    const [typeFilter, setTypeFilter] = useState('')

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (typeFilter) params.set('type', typeFilter)
            if (yearFrom > -500) params.set('yearFrom', yearFrom.toString())
            if (yearTo < 2000) params.set('yearTo', yearTo.toString())

            const res = await fetch(`/api/map?${params}`)
            const json = await res.json()
            setNodes(json.nodes || [])
            setEvents(json.events || [])
        } catch (err) {
            console.error('Failed to fetch map data', err)
        } finally {
            setLoading(false)
        }
    }, [typeFilter, yearFrom, yearTo])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Filter events by timeline slider on the client side
    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            if (!e.yearCE) return true
            return e.yearCE >= yearFrom && e.yearCE <= yearTo
        })
    }, [events, yearFrom, yearTo])

    // ── Node marker icons (memoized) ──
    const nodeIcons = useMemo(() => {
        const icons: Record<string, L.DivIcon> = {}
        Object.keys(NODE_COLORS).forEach((type) => {
            icons[type] = createNodeIcon(type)
        })
        return icons
    }, [])

    const eventIcons = useMemo(() => {
        const icons: Record<string, L.DivIcon> = {}
        Object.keys(EVENT_ICONS).forEach((type) => {
            icons[type] = createEventIcon(type)
        })
        return icons
    }, [])

    return (
        <div className="relative">
            {/* Map Container */}
            <div className="h-[75vh] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
                <MapContainer
                    center={[23.8, 45.1]}
                    zoom={5}
                    className="h-full w-full"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitBoundsController nodes={nodes} events={filteredEvents} />

                    {/* Node markers */}
                    {showNodes &&
                        nodes.map((node) => (
                            <Marker
                                key={`node-${node.id}`}
                                position={[node.latitude, node.longitude]}
                                icon={nodeIcons[node.type] || nodeIcons.ROOT}
                            >
                                <Popup>
                                    <div className="text-right min-w-[200px]" dir="rtl">
                                        <h4 className="font-bold text-base mb-1">{node.nameAr}</h4>
                                        <p className="text-sm text-gray-500">{node.name}</p>
                                        <div className="flex items-center justify-end gap-2 mt-2">
                                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                                                {NODE_TYPE_AR[node.type] || node.type}
                                            </span>
                                            {node.era && (
                                                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                                                    {node.era}
                                                </span>
                                            )}
                                        </div>
                                        {node.birthPlace && (
                                            <p className="text-xs text-gray-500 mt-1">📍 {node.birthPlace}</p>
                                        )}
                                        {(node.birthYear || node.deathYear) && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                {node.birthYear && `${node.birthYear}`}
                                                {node.birthYear && node.deathYear && ' – '}
                                                {node.deathYear && `${node.deathYear}`} م
                                            </p>
                                        )}
                                        <a
                                            href={`/tree/${node.id}`}
                                            className="text-xs text-emerald-600 hover:underline mt-2 inline-block"
                                        >
                                            عرض في الشجرة ←
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                    {/* Event markers */}
                    {showEvents &&
                        filteredEvents.map((event) => (
                            <Marker
                                key={`event-${event.id}`}
                                position={[event.latitude, event.longitude]}
                                icon={eventIcons[event.eventType] || eventIcons.OTHER}
                            >
                                <Popup>
                                    <div className="text-right min-w-[220px]" dir="rtl">
                                        <h4 className="font-bold text-base mb-1">
                                            {event.titleAr || event.title}
                                        </h4>
                                        {event.titleAr && (
                                            <p className="text-sm text-gray-500">{event.title}</p>
                                        )}
                                        <div className="flex items-center justify-end gap-2 mt-2">
                                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                                                {EVENT_TYPE_AR[event.eventType] || event.eventType}
                                            </span>
                                            {event.yearCE && (
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                                    {event.yearCE} م
                                                </span>
                                            )}
                                        </div>
                                        {(event.descriptionAr || event.description) && (
                                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                                {event.descriptionAr || event.description}
                                            </p>
                                        )}
                                        {event.location && (
                                            <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            مرتبط بـ: {event.node.nameAr}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MapContainer>
            </div>

            {/* Controls overlay */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3 max-w-[260px]">
                {/* Toggle controls */}
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 text-right">
                        ⚙️ عرض
                    </h3>
                    <div className="space-y-2">
                        <label className="flex items-center justify-end gap-2 text-sm cursor-pointer">
                            <span className="text-slate-600 dark:text-slate-400">المواقع</span>
                            <input
                                type="checkbox"
                                checked={showNodes}
                                onChange={(e) => setShowNodes(e.target.checked)}
                                className="accent-emerald-600"
                            />
                        </label>
                        <label className="flex items-center justify-end gap-2 text-sm cursor-pointer">
                            <span className="text-slate-600 dark:text-slate-400">الأحداث</span>
                            <input
                                type="checkbox"
                                checked={showEvents}
                                onChange={(e) => setShowEvents(e.target.checked)}
                                className="accent-emerald-600"
                            />
                        </label>
                    </div>
                    {/* Type filter */}
                    <div className="mt-3">
                        <label className="text-xs text-slate-500 block text-right mb-1">تصنيف</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 text-right bg-white dark:bg-slate-700"
                            dir="rtl"
                        >
                            <option value="">الكل</option>
                            {Object.entries(NODE_TYPE_AR).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Timeline slider */}
                <TimelineSlider
                    yearFrom={yearFrom}
                    yearTo={yearTo}
                    onYearFromChange={setYearFrom}
                    onYearToChange={setYearTo}
                />

                {/* Legend */}
                <MapLegend />
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center z-[1001] rounded-xl">
                    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-lg shadow-lg border">
                        <p className="text-sm text-slate-600 dark:text-slate-300 animate-pulse">
                            جاري تحميل الخريطة...
                        </p>
                    </div>
                </div>
            )}

            {/* Stats bar */}
            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <p>
                    {showNodes && `${nodes.length} موقع`}
                    {showNodes && showEvents && ' · '}
                    {showEvents && `${filteredEvents.length} حدث`}
                </p>
                <p>
                    {yearFrom < 0 ? `${Math.abs(yearFrom)} ق.م` : `${yearFrom} م`}
                    {' — '}
                    {yearTo < 0 ? `${Math.abs(yearTo)} ق.م` : `${yearTo} م`}
                </p>
            </div>
        </div>
    )
}
