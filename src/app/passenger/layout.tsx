export default function PassengerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background relative">
            {/* Mobile-first constraints */}
            <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-2xl overflow-hidden">
                {children}
            </div>
        </div>
    )
}
