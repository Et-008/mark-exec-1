import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import EmailConfigForm from "../NewsLetterBuilder/components/Forms/EmailConfigForm";
import { useUserStore } from "../../stores";

function EmailConfigModal() {
  const {
    newEmailConfigModalOpen,
    newEmailConfigModalId,
    setNewEmailConfigModalOpen,
  } = useUserStore();

  if (!newEmailConfigModalOpen) {
    return null;
  }

  return (
    <Modal
      show={newEmailConfigModalOpen}
      onClose={() => setNewEmailConfigModalOpen(false)}
      size="6xl"
    >
      <ModalHeader>
        {newEmailConfigModalId
          ? "Edit Email Config"
          : "Create New Email Config"}
      </ModalHeader>
      <ModalBody>
        <EmailConfigForm
          id={newEmailConfigModalId}
          handleClose={() => setNewEmailConfigModalOpen(false)}
        />
      </ModalBody>
    </Modal>
  );
}

export default EmailConfigModal;
