import React from "react";
import EmailConfigModal from "./EmailConfigModal";
import SubscriberConfigModal from "./SubscriberConfigModal";

function ModalComponents() {
  return (
    <React.Fragment>
      <EmailConfigModal />
      <SubscriberConfigModal />
    </React.Fragment>
  );
}

export default ModalComponents;
