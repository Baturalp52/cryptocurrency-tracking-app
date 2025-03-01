import React from "react";

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModalBody({
  children,
  className = "",
}: ModalBodyProps) {
  return <div className={`modal-body ${className}`}>{children}</div>;
}
