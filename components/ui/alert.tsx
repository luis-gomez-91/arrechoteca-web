import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full items-start gap-3 rounded-lg border p-4 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-foreground [&>svg~*]:grid-area-[content] [&>svg]:grid-area-[icon] grid has-[AlertAction]:grid-cols-[1fr_auto]",
  {
    variants: {
      variant: {
        default:
          "border-border bg-card text-card-foreground",
        destructive:
          "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20 [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed text-muted-foreground", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-center justify-self-end",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
