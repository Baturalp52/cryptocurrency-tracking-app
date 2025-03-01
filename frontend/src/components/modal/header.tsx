import React from "react";

interface ModalHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export default function ModalHeader({
  children,
  className = "",
}: ModalHeaderProps) {
  return (
    <div className={`modal-header ${className}`}>
      {typeof children === "string" ? (
        <h5 className="modal-title">{children}</h5>
      ) : (
        children
      )}
    </div>
  );
}
