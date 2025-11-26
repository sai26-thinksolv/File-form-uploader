import * as React from "react"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

const Tooltip = ({ children }: { children: React.ReactNode }) => {
    return <div className="relative inline-block">{children}</div>
}

const TooltipTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
    return (
        <button ref={ref} type="button" {...props}>
            {children}
        </button>
    )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`absolute z-50 w-64 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 ${className || ''}`}
            style={{
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px'
            }}
            {...props}
        >
            {children}
            <div
                className="absolute"
                style={{
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid rgb(17, 24, 39)'
                }}
            />
        </div>
    )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
