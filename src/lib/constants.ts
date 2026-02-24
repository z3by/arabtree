/**
 * Shared constants for the application to ensure consistency and avoid drift.
 */

export const NODE_TYPE_LABELS_AR: Record<string, string> = {
    ROOT: 'جذر',
    TRIBE: 'قبيلة',
    CLAN: 'عشيرة',
    FAMILY: 'عائلة',
    INDIVIDUAL: 'فرد',
};

export const NODE_TYPE_LABELS_EN: Record<string, string> = {
    ROOT: 'Root',
    TRIBE: 'Tribe',
    CLAN: 'Clan',
    FAMILY: 'Family',
    INDIVIDUAL: 'Individual',
};

/**
 * Combined labels for forms that need both Arabic and English with more descriptive labels for some types.
 */
export const NODE_TYPE_LABELS = {
    ROOT: { ar: 'جذر', en: 'Root' },
    TRIBE: { ar: 'قبيلة', en: 'Tribe' },
    CLAN: { ar: 'عشيرة / بطن', en: 'Clan' },
    FAMILY: { ar: 'عائلة / فخذ', en: 'Family' },
    INDIVIDUAL: { ar: 'فرد', en: 'Individual' },
} as const;

/**
 * Consistent colors for different node types.
 * Used for badges and rings in the UI.
 */
export const NODE_TYPE_COLORS: Record<string, { badge: string; ring: string }> = {
    ROOT: {
        badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
        ring: 'ring-amber-400/50'
    },
    TRIBE: {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
        ring: 'ring-emerald-400/50'
    },
    CLAN: {
        badge: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
        ring: 'ring-blue-400/50'
    },
    FAMILY: {
        badge: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
        ring: 'ring-purple-400/50'
    },
    INDIVIDUAL: {
        badge: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
        ring: 'ring-rose-400/50'
    },
};

/**
 * HEX colors for components that don't use Tailwind (like Leaflet markers).
 */
export const NODE_TYPE_HEX: Record<string, string> = {
    ROOT: '#d97706',       // amber/gold
    TRIBE: '#16a34a',      // green
    CLAN: '#2563eb',       // blue
    FAMILY: '#7c3aed',     // violet
    INDIVIDUAL: '#dc2626', // red
};

/**
 * Event type labels in Arabic.
 */
export const EVENT_TYPE_LABELS_AR: Record<string, string> = {
    MIGRATION: 'هجرة',
    BATTLE: 'معركة',
    FOUNDING: 'تأسيس',
    ALLIANCE: 'تحالف',
    GENEALOGICAL: 'أنساب',
    CULTURAL: 'ثقافة',
    OTHER: 'أخرى',
};
