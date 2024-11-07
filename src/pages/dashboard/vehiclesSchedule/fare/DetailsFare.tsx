import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleFareQuery } from "@/store/api/vehiclesSchedule/fareApi";
import {
  ISeatPlanOptionsProps,
  seatPlanOptions,
} from "@/utils/constants/common/seatPlanOptions";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsFareProps {
  id: number | null;
}

const DetailsFare: FC<IDetailsFareProps> = ({ id }) => {
  const { data: fareRoute, isLoading: fareLoading } = useGetSingleFareQuery(id);
  const { translate } = useCustomTranslator();

  if (fareLoading) {
    return <DetailsSkeleton columns={3} items={7} />;
  }

  return (
    <DetailsWrapper
      heading={translate("ভাড়া ওভারভিউ", "Fare Overview")}
      subHeading={translate(
        "আপনার ভাড়া তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your fare information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: fareRoute?.data?.createdAt,
          })}
        />
        <LabelDescription
          heading={translate("হালনাগাদ হয়েছে", "Update At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: fareRoute?.data?.updatedAt,
          })}
        />
        <LabelDescription
          heading={translate("রুটের ", "Route")}
          paragraph={fareRoute?.data?.route.replace(/->|,|\s|-|_|>|\./, " ➜ ")}
        />
        <LabelDescription
          heading={translate("ভাড়ার পরিমাণ", "Fare Amount")}
          paragraph={
            seatPlanOptions?.find(
              (singlePlan: ISeatPlanOptionsProps) =>
                singlePlan.key === fareRoute?.data?.seatPlan
            )?.en || ""
          }
        />

        <LabelDescription
          heading={translate("কোচের ধরন", "Coach Type")}
          paragraph={fareRoute?.data?.type}
        />
        <LabelDescription
          heading={translate("শুরুর তারিখ", "Starting Date")}
          paragraph={formatter({
            type: "date",
            dateTime: fareRoute?.data?.fromDate,
          })}
        />
        <LabelDescription
          heading={translate("শেষের তারিখ", "Ending Date")}
          paragraph={formatter({
            type: "date",
            dateTime: fareRoute?.data?.toDate,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsFare;
