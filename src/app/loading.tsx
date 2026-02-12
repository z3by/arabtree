import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse text-lg font-medium">
                جاري التحميل...
            </p>
        </div>
    )
}
