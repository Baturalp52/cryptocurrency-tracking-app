import React from "react";

function CryptoLoading() {
  return (
    <div className="d-flex flex-column w-100 placeholder-glow">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="placeholder my-2 rounded"
          style={{ width: "100%", height: 20 }}
        ></div>
      ))}
    </div>
  );
}

export default CryptoLoading;
