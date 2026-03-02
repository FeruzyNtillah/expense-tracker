import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                destructive:
                    "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]",
                secondary:
                    "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
                link: "text-primary underline-offset-4 hover:underline hover:scale-[1.02]",
                success:
                    "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                warning:
                    "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-10 rounded-lg px-8",
                icon: "h-9 w-9 rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }
