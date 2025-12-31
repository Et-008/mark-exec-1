import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import SubscriberConfigForm from "../NewsLetterBuilder/components/Forms/SubscriberConfigForm";
import { useUserStore } from "../../stores";

function SubscriberConfigModal() {
  const {
    subscriberConfig,
    newSubscriberConfigModalOpen,
    setNewSubscriberConfigModalOpen,
  } = useUserStore();

  const handleClose = () => setNewSubscriberConfigModalOpen(false);

  return (
    <Modal
      show={newSubscriberConfigModalOpen}
      onClose={() => setNewSubscriberConfigModalOpen(false)}
      size="6xl"
    >
      <ModalHeader>
        {subscriberConfig?.id
          ? "Update Subscriber Details"
          : "Add New Subscriber"}
      </ModalHeader>
      <ModalBody>
        <SubscriberConfigForm
          subscriber={subscriberConfig}
          handleClose={handleClose}
        />
      </ModalBody>
    </Modal>
  );
}

export default SubscriberConfigModal;
