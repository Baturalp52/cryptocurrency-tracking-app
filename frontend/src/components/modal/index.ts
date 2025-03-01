import Modal from "./modal";
import ModalHeader from "./header";
import ModalBody from "./body";
import ModalFooter from "./footer";

// Type augmentation for Modal component
type ModalComponentType = typeof Modal & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

// Cast Modal to the augmented type
const ModalWithSubcomponents = Modal as ModalComponentType;

// Attach subcomponents
ModalWithSubcomponents.Header = ModalHeader;
ModalWithSubcomponents.Body = ModalBody;
ModalWithSubcomponents.Footer = ModalFooter;

export { ModalWithSubcomponents as Modal };
