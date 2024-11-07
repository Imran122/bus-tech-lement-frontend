import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import SectionWrapper from "./SectionWrapper";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { cn } from "@/lib/utils";

const toolbarVariants = cva("flex w-full space-x-4 my-2", {
  variants: {
    alignment: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    },
  },
  defaultVariants: {
    alignment: "start",
  },
});

export interface TableToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toolbarVariants> {
  asChild?: boolean;
  alignment?: "start" | "center" | "end";
}

const TableToolbar = React.forwardRef<HTMLDivElement, TableToolbarProps>(
  ({ className, alignment, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(
          toolbarVariants({ alignment }),
          useFontShifter(),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
TableToolbar.displayName = "TableToolbar";

interface TableWrapperProps {
  children: React.ReactNode;
  heading: string;
  subHeading?: string;
  className?: string;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
  children,
  heading,
  subHeading,
  className,
}) => {
  return (
    <SectionWrapper className="w-full my-8">
      <Heading position="start" size="h3">
        {heading}
      </Heading>
      {subHeading && <Paragraph size="sm">{subHeading}</Paragraph>}
      <TableToolbar />
      <div className={cn("w-full", className)}>{children}</div>
    </SectionWrapper>
  );
};

export { TableWrapper, TableToolbar };
