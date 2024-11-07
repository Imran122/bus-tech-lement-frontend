import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import {
  ITagSelectDataProps,
  TagSelect,
} from "@/components/common/form/TagSelect";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AddUpdateRouteDataProps,
  addUpdateRouteSchema,
} from "@/schemas/vehiclesSchedule/addUpdateRouteSchema";
import { useAddRouteMutation } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { addUpdateRouteForm } from "@/utils/constants/form/addUpdateRouteForm";
import formatter from "@/utils/helpers/formatter";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IRouteStateProps } from "./RouteList";

interface IAddRouteProps {
  setRouteState: (
    userState: (routeState: IRouteStateProps) => IRouteStateProps
  ) => void;
}

const AddRoute: FC<IAddRouteProps> = ({ setRouteState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [tags, setTags] = useState<ITagSelectDataProps[]>([]);

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateRouteDataProps>({
    resolver: zodResolver(addUpdateRouteSchema),
  });

  const [addRoute, { isLoading: addRouteLoading, error: addRouteError }] =
    useAddRouteMutation({});

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationsQuery({}) as any;

  useEffect(() => {
    setValue(
      "viaStations",
      tags?.map((singleTag: ITagSelectDataProps) => +singleTag.key) || []
    );
    if (tags?.length > 0) {
      setError("viaStations", { type: "custom", message: "" });
    }

    setValue(
      "routeName",
      formatter({
        type: "words",
        words: stationsData?.data?.find(
          (singleStation: any) => singleStation?.id === watch("from")
        )?.name,
      }) +
        " ➜ " +
        formatter({
          type: "words",
          words: stationsData?.data?.find(
            (singleStation: any) => singleStation?.id === watch("to")
          )?.name,
        })
    );
  }, [
    tags,
    setValue,
    setError,
    stationsData?.data,
    watch,
    watch("to"),
    watch("from"),
  ]);

  const onSubmit = async (data: AddUpdateRouteDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "routeType",
      "routeDirection",
      "kilo",
      "isPassengerInfoRequired",
      "via",
    ]);

    const result = await addRoute(updateData);
    if (result?.data?.success) {
      toast({
        title: translate("রুট যোগ করার বার্তা", "Message for adding route"),
        description: toastMessage("add", translate("রুট", "route")),
      });
      setRouteState((prevState: IRouteStateProps) => ({
        ...prevState,
        addRouteOpen: false,
      }));
    }
  };

  return (
    <FormWrapper
      heading={translate("রুট যোগ করুন", "Add Route")}
      subHeading={translate(
        "সিস্টেমে নতুন রুট যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new route to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* FROM */}
          <InputWrapper
            labelFor="from"
            error={errors?.from?.message}
            label={translate(
              addUpdateRouteForm?.from.label.bn,
              addUpdateRouteForm?.from.label.en
            )}
          >
            <Select
              value={watch("from")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("from", +value);
                setError("from", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="from" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateRouteForm.from.placeholder.bn,
                    addUpdateRouteForm.from.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!stationsLoading &&
                  stationsData?.data?.length > 0 &&
                  stationsData?.data
                    ?.filter((target: any) => target.id !== watch("to"))
                    ?.map((singleStation: any, stationIndex: number) => (
                      <SelectItem
                        key={stationIndex}
                        value={singleStation?.id?.toString()}
                      >
                        {singleStation?.name}
                      </SelectItem>
                    ))}

                {stationsLoading && !stationsData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* TO */}
          <InputWrapper
            labelFor="to"
            error={errors?.to?.message}
            label={translate(
              addUpdateRouteForm?.to.label.bn,
              addUpdateRouteForm?.to.label.en
            )}
          >
            <Select
              value={watch("to")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("to", +value);
                setError("to", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="to" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateRouteForm.to.placeholder.bn,
                    addUpdateRouteForm.to.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!stationsLoading &&
                  stationsData?.data?.length > 0 &&
                  stationsData?.data
                    ?.filter((target: any) => target.id !== watch("from"))
                    ?.map((singleStation: any, stationIndex: number) => (
                      <SelectItem
                        key={stationIndex}
                        value={singleStation?.id?.toString()}
                      >
                        {singleStation?.name}
                      </SelectItem>
                    ))}

                {stationsLoading && !stationsData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* ROUTE NAME */}
          <InputWrapper
            labelFor="routeName"
            error={errors.routeName?.message}
            label={translate(
              addUpdateRouteForm?.routeName.label.bn,
              addUpdateRouteForm.routeName.label.en
            )}
          >
            <Input
              className="text-muted-foreground"
              readOnly
              id="routeName"
              type="text"
              value={watch("routeName") || ""}
              placeholder={translate(
                addUpdateRouteForm.routeName.placeholder.bn,
                addUpdateRouteForm.routeName.placeholder.en
              )}
            />
          </InputWrapper>

          {/* VIA STATIONS */}
          <InputWrapper
            className={cn(tags?.length > 0 && "col-span-3")}
            labelFor="viaStations"
            error={errors?.viaStations?.message}
            label={translate(
              addUpdateRouteForm?.viaStations.label.bn,
              addUpdateRouteForm.viaStations.label.en
            )}
          >
            <TagSelect
              data={stationsData?.data.map((singleStation: any) => ({
                key: singleStation?.id,
                label: singleStation?.name,
              }))}
              loading={stationsLoading}
              placeholder={translate(
                addUpdateRouteForm?.viaStations.placeholder.bn,
                addUpdateRouteForm.viaStations.placeholder.en
              )}
              tags={tags}
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTags(newTags);
                setValue(
                  "viaStations",
                  tags.map((singleTag: ITagSelectDataProps) => +singleTag.key)
                );
              }}
            />
          </InputWrapper>
          {/* ROUTE TYPE */}
          <InputWrapper
            labelFor="routeType"
            error={errors?.routeType?.message}
            label={translate(
              addUpdateRouteForm?.routeType.label.bn,
              addUpdateRouteForm.routeType.label.en
            )}
          >
            <Select
              value={watch("routeType") || ""}
              onValueChange={(value: "Local" | "International") => {
                setValue("routeType", value);
                setError("routeType", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="routeType" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateRouteForm.routeType.placeholder.bn,
                    addUpdateRouteForm.routeType.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Local">
                  {translate("স্থানীয়", "Local")}
                </SelectItem>
                <SelectItem value="International">
                  {translate("আন্তর্জাতিক", "International")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* ROUTE DIRECTION */}
          <InputWrapper
            labelFor="routeDirection"
            error={errors?.routeDirection?.message}
            label={translate(
              addUpdateRouteForm?.routeDirection.label.bn,
              addUpdateRouteForm.routeDirection.label.en
            )}
          >
            <Select
              value={watch("routeDirection") || ""}
              onValueChange={(value: "Up_Way" | "Down_Way") => {
                setValue("routeDirection", value);
                setError("routeDirection", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="routeDirection" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateRouteForm.routeDirection.placeholder.bn,
                    addUpdateRouteForm.routeDirection.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Up_Way">
                  {translate("উর্ধ্বগামী", "Up Way")}
                </SelectItem>
                <SelectItem value="Down_Way">
                  {translate("নিম্নগামী", "Down Way")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* DISTANCE BY KILO */}
          <InputWrapper
            labelFor="kilo"
            error={errors?.kilo?.message}
            label={translate(
              addUpdateRouteForm?.kilo.label.bn,
              addUpdateRouteForm.kilo.label.en
            )}
          >
            <Input
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setValue("kilo", +e.target.value);
                setError("kilo", { type: "custom", message: "" });
              }}
              id="kilo"
              type="number"
              placeholder={translate(
                addUpdateRouteForm.kilo.placeholder.bn,
                addUpdateRouteForm.kilo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* PERMISSION FOR ADDING PASSENGER INFORMATION */}
          <InputWrapper
            labelFor="isPassengerInfoRequired"
            error={errors?.isPassengerInfoRequired?.message}
            label={translate(
              addUpdateRouteForm?.isPassengerInfoRequired.label.bn,
              addUpdateRouteForm.isPassengerInfoRequired.label.en
            )}
          >
            <Select
              onValueChange={(value: "Yes" | "No") => {
                setValue(
                  "isPassengerInfoRequired",
                  value?.toLowerCase() === "yes" ? true : false
                );
                setError("isPassengerInfoRequired", {
                  type: "custom",
                  message: "",
                });
              }}
            >
              <SelectTrigger id="isPassengerInfoRequired" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateRouteForm.isPassengerInfoRequired.placeholder.bn,
                    addUpdateRouteForm.isPassengerInfoRequired.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">{translate("হ্যাঁ", "Yes")}</SelectItem>
                <SelectItem value="No">{translate("না", "No")}</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* VIA */}
          <InputWrapper
            labelFor="via"
            error={errors?.via?.message}
            label={translate(
              addUpdateRouteForm?.via.label.bn,
              addUpdateRouteForm.via.label.en
            )}
          >
            <Input
              {...register("via")}
              id="via"
              type="text"
              placeholder={translate(
                addUpdateRouteForm.via.placeholder.bn,
                addUpdateRouteForm.via.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>
        <Submit
          loading={addRouteLoading}
          errors={addRouteError}
          submitTitle={translate("রুট যুক্ত করুন", "Add Route")}
          errorTitle={translate("রুট যোগ করতে ত্রুটি", "Add Route Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddRoute;
