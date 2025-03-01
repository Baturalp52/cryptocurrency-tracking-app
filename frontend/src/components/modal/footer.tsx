import React from "react";

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModalFooter({
  children,
  className = "",
}: ModalFooterProps) {
  return <div className={`modal-footer ${className}`}>{children}</div>;
}
