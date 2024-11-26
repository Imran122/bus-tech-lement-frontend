import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddFuelPayment from "@/pages/dashboard/admin/fuel/AddFuelPayment";

const ModalSystem = ({
  activeModal,
  setActiveModal,
}: {
  activeModal: any;
  setActiveModal: any;
}) => {
  return (
    <Dialog
      open={!!activeModal}
      onOpenChange={(open) => !open && setActiveModal(null)}
    >
      <DialogContent>
        {activeModal === "AddFuelPayment" && (
          <AddFuelPayment setPaymentOpen={() => setActiveModal(null)} />
        )}
        {/* Add other modals dynamically */}
      </DialogContent>
    </Dialog>
  );
};

export default ModalSystem;
