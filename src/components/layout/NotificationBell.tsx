'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Notification {
    id: string
    type: string
    title: string
    titleAr: string
    message: string | null
    messageAr: string | null
    read: boolean
    link: string | null
    createdAt: string
}

const TYPE_ICONS: Record<string, string> = {
    CONTRIBUTION_APPROVED: '✅',
    CONTRIBUTION_REJECTED: '❌',
    CONTRIBUTION_PENDING: '📝',
    CONTRIBUTION_COMMENT: '💬',
    ROLE_CHANGED: '🔑',
    SYSTEM_ANNOUNCEMENT: '📢',
}

function timeAgo(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'الآن'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `منذ ${hours} ساعة`
    const days = Math.floor(hours / 24)
    if (days < 7) return `منذ ${days} يوم`
    return date.toLocaleDateString('ar-SA')
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/api/notifications?limit=10')
            if (!res.ok) return
            const json = await res.json()
            setNotifications(json.data || [])
            setUnreadCount(json.meta?.unreadCount || 0)
        } catch {
            // silently fail — user might not be logged in
        }
    }, [])

    useEffect(() => {
        fetchNotifications()
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [fetchNotifications])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const markAllRead = async () => {
        setLoading(true)
        try {
            await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true }),
            })
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch {
            // ignore
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [id] }),
            })
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, read: true } : n))
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch {
            // ignore
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="الإشعارات"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-slate-600 dark:text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute left-0 md:right-0 md:left-auto top-full mt-2 w-80 max-h-[420px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <button
                            onClick={markAllRead}
                            disabled={loading || unreadCount === 0}
                            className="text-xs text-emerald-600 hover:text-emerald-700 disabled:text-slate-400 disabled:cursor-not-allowed font-medium"
                        >
                            قراءة الكل
                        </button>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            🔔 الإشعارات
                        </h3>
                    </div>

                    {/* Notification items */}
                    <div className="overflow-y-auto max-h-[340px]">
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center text-sm text-slate-400">
                                لا توجد إشعارات
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!notification.read ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''
                                        }`}
                                    dir="rtl"
                                    onClick={() => {
                                        if (!notification.read) markAsRead(notification.id)
                                        if (notification.link) {
                                            window.location.href = notification.link
                                        }
                                        setIsOpen(false)
                                    }}
                                >
                                    {/* Icon */}
                                    <span className="text-lg mt-0.5 flex-shrink-0">
                                        {TYPE_ICONS[notification.type] || '🔔'}
                                    </span>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-snug ${!notification.read
                                                ? 'font-semibold text-slate-800 dark:text-white'
                                                : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {notification.titleAr}
                                        </p>
                                        {notification.messageAr && (
                                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                {notification.messageAr}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400 mt-1">
                                            {timeAgo(notification.createdAt)}
                                        </p>
                                    </div>

                                    {/* Unread dot */}
                                    {!notification.read && (
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
