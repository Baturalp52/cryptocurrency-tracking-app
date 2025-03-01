"use client";

import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl" | "fullscreen";
  staticBackdrop?: boolean;
  scrollable?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  size,
  staticBackdrop = false,
  scrollable = false,
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !staticBackdrop) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, staticBackdrop]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen &&
        !staticBackdrop
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, staticBackdrop]);

  if (!isOpen) return null;

  const modalSizeClass = size ? `modal-${size}` : "";
  const modalScrollableClass = scrollable ? "modal-dialog-scrollable" : "";

  return (
    <>
      <div
        className={`modal fade show d-block ${className}`}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div
          className={`modal-dialog modal-fullscreen-md-down modal-dialog-centered ${modalSizeClass} ${modalScrollableClass}`}
          ref={modalRef}
        >
          <div className="modal-content">{children}</div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
