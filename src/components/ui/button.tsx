import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-lg font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:shadow-glow shadow-premium",
                destructive:
                    "bg-alert text-white hover:bg-alert/90 shadow-md",
                outline:
                    "border-2 border-input bg-background hover:bg-muted hover:text-foreground",
                secondary:
                    "bg-charcoal text-white hover:bg-charcoal/80 shadow-md",
                ghost: "hover:bg-muted hover:text-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                premium: "bg-gradient-to-br from-primary to-[#D4A017] text-primary-foreground shadow-premium hover:shadow-glow",
            },
            size: {
                default: "h-14 px-8 min-w-[140px]",
                sm: "h-11 rounded-xl px-4 text-sm",
                lg: "h-16 rounded-3xl px-10 text-xl",
                icon: "h-14 w-14 rounded-2xl",
                full: "w-full h-14",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
