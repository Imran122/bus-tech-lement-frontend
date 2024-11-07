import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import * as React from "react";

const InputWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    error?: string;
    label: string;
    labelFor?: string;
  }
>(({ className, error, label, labelFor, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full flex flex-col p-1", className, useFontShifter())}
    {...props}
  >
    {label && (
      <label
        className="text-sm max-w-none truncate inline-block leading-8"
        htmlFor={labelFor || ""}
      >
        {label.trim() === "#" ? (
          <span className="invisible leading-8">empty</span>
        ) : (
          label
        )}
      </label>
    )}
    {children}
    {error && (
      <label
        className="text-sm text-destructive max-w-none block mt-1"
        htmlFor={labelFor || ""}
      >
        {error}
      </label>
    )}
  </div>
));
InputWrapper.displayName = "InputWrapper";

export { InputWrapper };
