import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  size?: "default" | "small" | "large";
}

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6",
        {
          "max-w-screen-lg": size === "default",
          "max-w-screen-md": size === "small",
          "max-w-screen-xl": size === "large",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}