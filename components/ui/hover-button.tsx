"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative isolate px-8 py-3 rounded-3xl",
        "text-foreground font-medium text-base leading-6",
        "backdrop-blur-lg bg-[rgba(43,55,80,0.1)]",
        "cursor-pointer overflow-hidden",
        "before:content-[''] before:absolute before:inset-0",
        "before:rounded-[inherit] before:pointer-events-none",
        "before:z-[0]",
        "before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
        "before:mix-blend-multiply before:transition-transform before:duration-300",
        "active:before:scale-[0.975]",
        className
      )}
      {...props}
    >
      <span className="relative z-[2]">{children}</span>
    </button>
  )
)

HoverButton.displayName = "HoverButton"

export { HoverButton }
