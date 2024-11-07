import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { getPropertyValues } from "@/utils/helpers/getPropertyValues";
import { fallback } from "@/utils/constants/common/fallback";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { Loader } from "../Loader";
import formatter from "@/utils/helpers/formatter";
import PageTransition from "../effect/PageTransition";

interface ISubmitErrorWrapperProps {
  errors: any;
  loading: boolean;
  className?: string;
  submitTitle: string;
  errorTitle: string;
  direction?: "horizontal" | "vertical";
}

const Submit: FC<ISubmitErrorWrapperProps> = ({
  errors: error,
  loading,
  className,
  submitTitle,
  errorTitle,
  direction = "horizontal",
}) => {
  const { translate } = useCustomTranslator();
  return (
    <div
      className={cn(
        "flex justify-between items-center mt-6 w-full",
        className,
        direction === "vertical" && "flex-col"
      )}
    >
      <div
        className={cn(
          "flex justify-start w-full md:max-w-[300px]",
          direction === "vertical" && "justify-center"
        )}
      >
        {error && Object?.keys(error)?.length > 0 && "data" in error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>
              {error?.data?.message?.toLowerCase() === "not found"
                ? translate(fallback.error.bn, fallback.error.en)
                : error?.data?.message?.toLowerCase() === "validation failed"
                ? translate("যাচাইকরণ ব্যর্থ হয়েছে।", "Validation failed")
                : formatter({
                    type: "sentences",
                    sentences: error?.data?.message,
                  }) || translate(fallback.error.bn, fallback.error.en)}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {error &&
              Object?.keys(error)?.length > 0 &&
              getPropertyValues<string>(error, "message").length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{errorTitle}</AlertTitle>
                  <AlertDescription>
                    {getPropertyValues<string[]>(error, "message")[0] ||
                      translate(fallback.error.bn, fallback.error.en)}
                  </AlertDescription>
                </Alert>
              )}
          </>
        )}
      </div>
      <div className="flex justify-end w-1/2">
        <PageTransition>
          <Button
            className="duration-1000 transition-all"
            disabled={loading}
            type="submit"
          >
            {loading && <Loader />}
            {submitTitle}
          </Button>
        </PageTransition>
      </div>
    </div>
  );
};

export default Submit;
