export default function Loading() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-background">
            <div className="relative">
                <span className="text-6xl animate-sway block">🌴</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary/10 rounded-full blur-sm animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                    جاري التحميل...
                </p>
            </div>
        </div>
    )
}
