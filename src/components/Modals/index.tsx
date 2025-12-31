import React from "react";
import AuthModal from "./AuthModal";
import EmailConfigModal from "./EmailConfigModal";
import SubscriberConfigModal from "./SubscriberConfigModal";

function ModalComponents() {
  return (
    <React.Fragment>
      <AuthModal />
      <EmailConfigModal />
      <SubscriberConfigModal />
    </React.Fragment>
  );
}

export default ModalComponents;
