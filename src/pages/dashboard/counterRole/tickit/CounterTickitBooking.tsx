/* eslint-disable @typescript-eslint/ban-ts-comment */
import DashboardTickitBookingCard from "@/components/common/card/DashboardTickitBookingCard";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { Accordion } from "@/components/ui/accordion";
import { useGetBookingCoachesQuery } from "@/store/api/bookingApi";
import {
  ICounterSearchFilterState,
  selectCounterSearchFilter,
  setBookingCoachesList,
} from "@/store/api/counter/counterSearchFilterSlice";
import { format } from "date-fns";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ITickitBookingProps {}

const CounterTickitBooking: FC<ITickitBookingProps> = () => {
  const bookingState = useSelector(
    selectCounterSearchFilter
  ) as ICounterSearchFilterState;
  const dispatch = useDispatch();

  // Only execute the query if all fields are filled
  const shouldFetchData = Boolean(
    bookingState.fromCounterId &&
      bookingState.destinationCounterId &&
      bookingState.schedule &&
      bookingState.coachType &&
      bookingState.date
  );

  const { data: bookingCoachesData, isLoading: loadingTickitBookingData } =
    useGetBookingCoachesQuery(
      shouldFetchData
        ? {
            fromCounterId: bookingState.fromCounterId,
            destinationCounterId: bookingState.destinationCounterId,
            schedule: bookingState.schedule,
            coachType: bookingState.coachType,
            date: bookingState.date && format(bookingState.date, "yyyy-MM-dd"),
            orderType: "One_Trip",
          }
        : {},
      { skip: !shouldFetchData }
    ) as any;

  useEffect(() => {
    if (shouldFetchData && bookingCoachesData) {
      dispatch(setBookingCoachesList(bookingCoachesData?.data || []));
    } else {
      dispatch(setBookingCoachesList([]));
    }
  }, [shouldFetchData, bookingCoachesData, dispatch]);

  return (
    <SectionWrapper className="px-4">
      {loadingTickitBookingData ? (
        <TableSkeleton columns={7} />
      ) : (
        //@ts-ignore
        bookingState?.bookingCoachesList.length > 0 && (
          <Accordion className="w-full" type="single" collapsible>
            //@ts-ignore
            {bookingState?.bookingCoachesList?.map(
              (singleCoachData: any, coachDataIndex: number) => (
                <DashboardTickitBookingCard
                  key={coachDataIndex}
                  coachData={singleCoachData}
                  index={coachDataIndex}
                />
              )
            )}
          </Accordion>
        )
      )}
    </SectionWrapper>
  );
};

export default CounterTickitBooking;
