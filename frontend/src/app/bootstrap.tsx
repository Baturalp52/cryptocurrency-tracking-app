"use client";

import { useEffect } from "react";

export default function Bootstrap() {
  useEffect(() => {
    // eslint-disable-next-line
    void import("bootstrap/dist/js/bootstrap.bundle.min.js" as string);
  }, []);

  return <></>;
}
