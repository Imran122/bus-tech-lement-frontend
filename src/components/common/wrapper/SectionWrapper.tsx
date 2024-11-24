import { ReactNode, FC } from "react";
import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
interface ISectionWrapperProps {
  children: ReactNode;
  className?: string;
}
const SectionWrapper: FC<ISectionWrapperProps> = ({ children, className }) => {
  return (
    <section
      className={cn(
        "max-w-[1300px] flex flex-col items-center my-[150px]",
        className,
        useFontShifter()
      )}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
