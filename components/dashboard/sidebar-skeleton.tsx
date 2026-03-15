export function SidebarSkeleton() {
    return (
        <div className="w-70 h-screen border-r bg-sidebar animate-pulse flex flex-col p-4 space-y-4">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="flex-1 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-full bg-muted rounded" />
                ))}
            </div>
            <div className="h-12 w-full bg-muted rounded-lg" />
        </div>
    );
}