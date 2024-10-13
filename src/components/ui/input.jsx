import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, width, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex   rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        width ? `w-[${width}px]` : 'w-full',
        height ? `h-[${height}px]` : 'h-10',  // use custom width if provided, otherwise full width
        className
      )}
      ref={ref}
      {...props}
    />
  );
})
Input.displayName = "Input"

export { Input }
