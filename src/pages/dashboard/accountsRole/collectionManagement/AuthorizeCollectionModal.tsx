import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuthorizeCollectionMutation } from "@/store/api/accounts/accountsDashboardApi";
import { useGetAccountsQuery } from "@/store/api/finance/accountApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";

interface AuthorizeCollectionModalProps {
  collectionId: number;
  editStatus: boolean;
  closeModal: () => void;
  amount: number; // Required amount
}

interface Account {
  accountId: string;
  amount: string;
}

const AuthorizeCollectionModal: FC<AuthorizeCollectionModalProps> = ({
  collectionId,
  editStatus,
  closeModal,
  amount,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const [authorizeCollection, { isLoading: submitting, error: errorsubmit }] =
    useAuthorizeCollectionMutation();
  const { data: accountList, isLoading: accountListLoading } =
    useGetAccountsQuery("All");

  const [accounts, setAccounts] = useState<Account[]>([
    { accountId: "", amount: "" },
  ]);
  const [edit, setEdit] = useState(editStatus);
  const [amountError, setAmountError] = useState<string | null>(null);

  const onSubmit = async () => {
    const totalAmount = accounts.reduce(
      (sum, acc) => sum + Number(acc.amount),
      0
    );
    if (!edit) {
      if (totalAmount !== amount) {
        setAmountError(
          translate(
            "মোট পরিমাণ অবশ্যই নির্ধারিত পরিমাণের সমান হতে হবে।",
            "Total amount must match the required amount."
          )
        );
        return;
      }
    }

    const result = await authorizeCollection({
      collectionId,
      body: edit
        ? { edit }
        : {
            edit,
            accounts: accounts.map((acc) => ({
              accountId: Number(acc.accountId), // Ensure accountId is a number
              amount: Number(acc.amount),
            })),
          },
    });

    if (result.data?.success) {
      toast({
        title: translate("সংগ্রহ অনুমোদিত", "Collection Authorized"),
        description: translate(
          "আপনার পরিবর্তনগুলি সফলভাবে সংরক্ষিত হয়েছে।",
          "Your changes were saved successfully."
        ),
      });
      closeModal();
    } else {
      toast({
        title: translate(
          "অনুমোদন সংগ্রহ ব্যর্থ",
          "Collection Authorization Failed"
        ),
        description: translate(
          "দয়া করে আবার চেষ্টা করুন।",
          "Please try again."
        ),
        variant: "destructive",
      });
    }
  };

  const addAccountField = () =>
    setAccounts([...accounts, { accountId: "", amount: "" }]);
  const removeAccountField = (index: number) =>
    setAccounts(accounts.filter((_, i) => i !== index));

  const handleInputChange = (
    index: number,
    field: "accountId" | "amount",
    value: string
  ) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
    setAmountError(null); // Clear error on input change
  };

  if (accountListLoading) return <DetailsSkeleton columns={3} items={10} />;

  return (
    <FormWrapper
      heading={translate("অনুমোদন সংগ্রহ", "Authorize Collection")}
      subHeading={translate(
        "সংগ্রহ অনুমোদনের জন্য নিচের তথ্য পূরণ করুন।",
        "Fill out the details below to authorize the collection."
      )}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Edit Mode Checkbox */}
        <div className="space-y-4 mt-4">
          <label>
            <input
              type="checkbox"
              checked={edit}
              onChange={() => setEdit(!edit)}
            />
            {translate("এডিট মোড", "Edit Mode")}
          </label>

          {/* Conditionally render account fields based on edit status */}
          {!edit &&
            accounts.map((account, index) => (
              <div key={index} className="flex gap-2 items-center">
                <InputWrapper
                  label={translate(
                    "অ্যাকাউন্ট নির্বাচন করুন",
                    "Select Account"
                  )}
                  error={undefined}
                >
                  <Select
                    value={account.accountId}
                    onValueChange={(value) =>
                      handleInputChange(index, "accountId", value)
                    }
                  >
                    <SelectTrigger id={`account-select-${index}`}>
                      <SelectValue
                        placeholder={translate(
                          "অ্যাকাউন্ট নির্বাচন করুন",
                          "Select Account"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {accountList?.data.map((acc: any) => (
                        <SelectItem key={acc.id} value={acc.id.toString()}>
                          {acc.bankName} - {acc.accountHolderName} (
                          {acc.accountNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputWrapper>

                <InputWrapper
                  label={translate("পরিমাণ", "Amount")}
                  error={amountError || undefined} // Convert null to undefined for typing
                >
                  <Input
                    value={account.amount}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                    placeholder={translate("পরিমাণ", "Amount")}
                  />
                </InputWrapper>

                {index > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => removeAccountField(index)}
                  >
                    {translate("সরান", "Remove")}
                  </Button>
                )}
              </div>
            ))}

          {!edit && (
            <Button onClick={addAccountField} variant="outline">
              {translate("আরও যোগ করুন", "Add More")}
            </Button>
          )}
        </div>

        {/* Submit button */}
        <Submit
          loading={submitting}
          errors={errorsubmit}
          submitTitle={translate("জমা দিন", "Submit")}
          errorTitle={translate("অনুমোদন ব্যর্থ", "Authorization Failed")}
        />
      </form>
    </FormWrapper>
  );
};

export default AuthorizeCollectionModal;
