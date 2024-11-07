import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import {
  ITagSelectDataProps,
  TagSelect,
} from "@/components/common/form/TagSelect";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
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
import {
  useGetSingleRouteQuery,
  useUpdateRouteMutation,
} from "@/store/api/vehiclesSchedule/routeApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { addUpdateRouteForm } from "@/utils/constants/form/addUpdateRouteForm";
import formatter from "@/utils/helpers/formatter";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateRouteProps {
  id: number | null;
}

const UpdateRoute: FC<IUpdateRouteProps> = ({ id }) => {
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
  }, [tags, setValue, setError, watch, watch("to"), watch("from")]);

  const { data: routeData, isLoading: routeLoading } =
    useGetSingleRouteQuery(id);

  const [
    updateRoute,
    { isLoading: updateRouteLoading, error: updateRouteError },
  ] = useUpdateRouteMutation({});

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationsQuery({}) as any;

  useEffect(() => {
    setValue("from", routeData?.data?.from);
    setValue("isPassengerInfoRequired", routeData?.data?.removeFalsyProperties);
    setValue("kilo", routeData?.data?.kilo || 0);
    setValue("routeDirection", routeData?.data?.routeDirection);
    setValue("routeName", routeData?.data?.routeName);
    setValue("routeType", routeData?.data?.routeType);
    setValue("to", routeData?.data?.to);
    setValue("via", routeData?.data?.via || "");
    setValue(
      "viaStations",
      routeData?.data?.viaRoute?.map(
        (singleStation: any) => singleStation?.station?.name
      )
    );
    setTags(
      routeData?.data?.viaRoute?.map((singleStation: any) => ({
        key: singleStation?.station.id,
        label: singleStation?.station.name,
      }))
    );
  }, [routeData, setValue]);

  const onSubmit = async (data: AddUpdateRouteDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "routeType",
      "routeDirection",
      "kilo",
      "isPassengerInfoRequired",
      "via",
    ]);

    const result = await updateRoute({ data: updateData, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "রুট সম্পাদনা করার বার্তা",
          "Message for updating route"
        ),
        description: toastMessage("update", translate("রুট", "route")),
      });
    }
  };

  if (routeLoading) {
    return <FormSkeleton columns={3} inputs={9} />;
  }

  return (
    <FormWrapper
      heading={translate("রুট সম্পাদনা করুন", "Update Route")}
      subHeading={translate(
        "সিস্টেমে রুট সম্পাদনা  করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update the existing route to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
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
              defaultValue={watch("kilo")}
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
              defaultValue={watch("isPassengerInfoRequired") ? "Yes" : "No"}
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
              setTags={(newTags) => {
                setTags(newTags);
                setValue(
                  "viaStations",
                  tags.map((singleTag: ITagSelectDataProps) => +singleTag.key)
                );
              }}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={updateRouteLoading}
          errors={updateRouteError}
          submitTitle={translate("রুট সম্পাদনা করুন", "Update Route")}
          errorTitle={translate(
            "রুট সম্পাদনা করতে ত্রুটি",
            "Update Route Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateRoute;
