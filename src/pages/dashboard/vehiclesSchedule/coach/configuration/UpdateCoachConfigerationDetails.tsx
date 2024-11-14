import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import DetailsCounter from "@/pages/dashboard/contacts/counter/DetailsCounter";
import { useGetSingleCoachConfigurationQuery } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import {
  ISeatPlanOptionsProps,
  seatPlanOptions,
} from "@/utils/constants/common/seatPlanOptions";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import DetailsFare from "../../fare/DetailsFare";

interface IUpdateCoachConfigarationDetailsProps {
  id: number | null;
}

const UpdateCoachConfigarationDetails: FC<
  IUpdateCoachConfigarationDetailsProps
> = ({ id }) => {
  const { data: coachConfigurationData, isLoading: coachConfigurationLoading } =
    useGetSingleCoachConfigurationQuery(id);
  const { translate } = useCustomTranslator();

  if (coachConfigurationLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }
  return (
    <DetailsWrapper
      heading={translate(
        "হালনাগাদ কোচ কনফিগারেইশন ওভারভিউ",
        "Update Coach Configuration Overview"
      )}
      subHeading={translate(
        "আপনার হালনাগাদ কনফিগারেইশন ওভারভিউ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your update coach configuration information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachConfigurationData?.data?.createdAt,
          })}
        />
        <LabelDescription
          heading={translate("হালনাগাদ হয়েছে", "Update At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachConfigurationData?.data?.updatedAt,
          })}
        />
        <LabelDescription
          heading={translate("নাম", "Coach No")}
          paragraph={coachConfigurationData?.data?.coachNo}
        />
        <LabelDescription
          heading={translate("রেজিস্ট্রেশন নং", "Registration No")}
          paragraph={coachConfigurationData?.data?.registrationNo}
        />
        <LabelDescription
          heading={translate("আসন পরিকল্পনা", "Seat Plan")}
          paragraph={coachConfigurationData?.data?.seatPlan}
        />
        <LabelDescription
          heading={translate("ডিসকাউন্ট পরিমাণ", "Discount")}
          paragraph={coachConfigurationData?.data?.discount}
        />
        <LabelDescription
          heading={translate("কোচ টাইপ", "Coach Type")}
          paragraph={coachConfigurationData?.data?.coachType}
        />
        <LabelDescription
          heading={translate("সময়সূচী", "Schedule")}
          paragraph={coachConfigurationData?.data?.schedule}
        />
        <LabelDescription
          heading={translate("টোকেন পরিমাণ", "Token Availabe")}
          paragraph={coachConfigurationData?.data?.tokenAvailable}
        />
        <LabelDescription
          heading={translate("প্রস্থানের তারিখ", "Departure Date")}
          paragraph={formatter({
            type: "date",
            dateTime: coachConfigurationData?.data?.departureDate,
          })}
        />
        <LabelDescription
          heading={translate("প্রস্থানের তারিখ", "Departure Date")}
          paragraph={formatter({
            type: "date",
            dateTime: coachConfigurationData?.data?.departureDate,
          })}
        />
        <LabelDescription
          heading={translate("গাইডের নাম", "Guide Name")}
          paragraph={coachConfigurationData?.data?.supervisor?.userName}
        />
        <LabelDescription
          heading={translate("গাইড ফোন", "Guide Phone")}
          paragraph={coachConfigurationData?.data?.supervisor?.contactNo}
        />
        <LabelDescription
          heading={translate("ড্রাইভারের নাম", "Driver Name")}
          paragraph={coachConfigurationData?.data?.driver?.name}
        />
        <LabelDescription
          heading={translate("ড্রাইভারের ফোন", "Driver Phone")}
          paragraph={coachConfigurationData?.data?.driver?.contactNo}
        />
        <LabelDescription
          heading={translate("হেল্পারের নাম", "Helper Name")}
          paragraph={coachConfigurationData?.data?.helper?.name}
        />
        <LabelDescription
          heading={translate("হেল্পারের ফোন", "Helper Phone")}
          paragraph={coachConfigurationData?.data?.helper?.contactNo}
        />
        <LabelDescription
          heading={translate("টাইপ", "Type")}
          paragraph={coachConfigurationData?.data?.type}
        />
        <LabelDescription
          heading={translate("বিক্রয় অবস্থা", "Sale Status")}
          paragraph={
            coachConfigurationData?.data?.saleStatus ? "Activate" : "Deactivate"
          }
        />
        <LabelDescription
          heading={translate("হোল্ডিং টাইম", "Holding Time")}
          paragraph={coachConfigurationData?.data?.holdingTime}
        />
        <LabelDescription
          heading={translate("ভাড়া অনুমোদিত", "Fare Allowed")}
          paragraph={coachConfigurationData?.data?.fareAllowed}
        />
        <LabelDescription
          heading={translate("ভিআইপি টাইমআউট", "VIP TimeOut")}
          paragraph={coachConfigurationData?.data?.vipTimeOut}
        />

        <LabelDescription
          heading={translate("স্টার্টিং পয়েন্ট", "Staring Point")}
          paragraph={coachConfigurationData?.data?.fromCounter?.name}
          info={{
            size: "lg",
            component: (
              <DetailsCounter
                id={coachConfigurationData?.data?.fromCounter?.id}
              />
            ),
          }}
        />

        <LabelDescription
          heading={translate("শেষ পয়েন্ট", "Ending Point")}
          paragraph={coachConfigurationData?.data?.destinationCounter?.name}
          info={{
            size: "lg",
            component: (
              <DetailsCounter
                id={coachConfigurationData?.data?.destinationCounter?.id}
              />
            ),
          }}
        />
        <LabelDescription
          heading={translate("ভাড়ার পরিমাণ", "Fare Amount")}
          paragraph={formatter({
            type: "amount",
            amount: coachConfigurationData?.data?.fare?.amount,
          })}
          info={{
            size: "lg",
            component: (
              <DetailsFare id={coachConfigurationData?.data?.fareId} />
            ),
          }}
        />
        <LabelDescription
          heading={translate("আসন পরিকল্পনা", "Seats  Plan")}
          paragraph={
            seatPlanOptions.find(
              (singlePlan: ISeatPlanOptionsProps) =>
                singlePlan.key === coachConfigurationData?.data?.seatPlan
            )?.en || ""
          }
        />
        <LabelDescription
          heading={translate("আসন", "Seats")}
          paragraph={coachConfigurationData?.data?.CoachConfigSeats?.map(
            (singleSeat: any) => singleSeat.seat
          ).join(", ")}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default UpdateCoachConfigarationDetails;
