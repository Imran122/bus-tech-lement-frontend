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

interface IDetailsCoachConfigurationProps {
  id: number | null;
}

const DetailsCoachConfiguration: FC<IDetailsCoachConfigurationProps> = ({
  id,
}) => {
  const { data: coachConfigurationData, isLoading: coachConfigurationLoading } =
    useGetSingleCoachConfigurationQuery(id);
  const { translate } = useCustomTranslator();

  if (coachConfigurationLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }
  return (
    <DetailsWrapper
      heading={translate(
        "কোচ কনফিগারেইশন ওভারভিউ",
        "Coach Configuration Overview"
      )}
      subHeading={translate(
        "আপনার কনফিগারেইশন ওভারভিউ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your coach configuration information and recent activities."
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
          heading={translate("ইমেইল", "Registration No")}
          paragraph={coachConfigurationData?.data?.registrationNo}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Seat Plan")}
          paragraph={coachConfigurationData?.data?.seatPlan}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Coach Type")}
          paragraph={coachConfigurationData?.data?.coachType}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Schedule")}
          paragraph={coachConfigurationData?.data?.schedule}
        />
        <LabelDescription
          heading={translate("টোকেন পরিমাণ", "Token Availabe")}
          paragraph={coachConfigurationData?.data?.tokenAvailable}
        />
        <LabelDescription
          heading={translate("ভূমিকা", "Departure Date")}
          paragraph={formatter({
            type: "date",
            dateTime: coachConfigurationData?.data?.departureDate,
          })}
        />

        <LabelDescription
          heading={translate("ইমেইল", "Type")}
          paragraph={coachConfigurationData?.data?.type}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Sale Status")}
          paragraph={
            coachConfigurationData?.data?.saleStatus ? "Activate" : "Deactivate"
          }
        />
        <LabelDescription
          heading={translate("ইমেইল", "Holding Time")}
          paragraph={coachConfigurationData?.data?.holdingTime}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Fare Allowed")}
          paragraph={coachConfigurationData?.data?.fareAllowed}
        />
        <LabelDescription
          heading={translate("ইমেইল", "VIP TimeOut")}
          paragraph={coachConfigurationData?.data?.vipTimeOut}
        />

        <LabelDescription
          heading={translate("যোগাযোগ নম্বর", "Staring Point")}
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
          heading={translate("যোগাযোগ নম্বর", "Ending Point")}
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
          heading={translate("আসন", "Seats")}
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

export default DetailsCoachConfiguration;
