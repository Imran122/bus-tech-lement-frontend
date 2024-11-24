import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

const ClientNote = () => {
  const { translate } = useCustomTranslator();
  const { data: singleCms } = useGetSingleCMSQuery({});
  return (
    <div className="min-h-[70vh] mx-auto border-2 rounded-lg border-secondary p-5 w-full flex flex-col items-center justify-between">
      <Heading size={"h4"} className="text-center">"Iconic Express"</Heading>

      <Paragraph size={"md"} className="text-center w-11/12 lg:w-5/6">
        {translate(
          singleCms?.data?.homePageDescriptionBangla,
          singleCms?.data?.homePageDescription
        )}
      </Paragraph>
    </div>
  );
};

export default ClientNote;
