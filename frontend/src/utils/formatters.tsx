function formatNumber(num: number | null | undefined) {
  if (num === null || num === undefined) return "N/A";

  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
  return new Intl.NumberFormat("en-US").format(num);
}

// Format currency
function formatCurrency(num: number | null | undefined) {
  if (num === null || num === undefined) return "N/A";

  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    return "$" + (num / 1e9).toFixed(1) + "B";
  } else if (absNum >= 1e6) {
    return "$" + (num / 1e6).toFixed(1) + "M";
  } else if (absNum >= 1e3) {
    return "$" + (num / 1e3).toFixed(1) + "K";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Format percentage
function formatPercentage(num: number | null | undefined) {
  if (num === null || num === undefined) return "N/A";

  const absNum = Math.abs(num);
  let formattedValue;
  if (absNum >= 1e9) {
    formattedValue = (num / 1e9).toFixed(1) + "B%";
  } else if (absNum >= 1e6) {
    formattedValue = (num / 1e6).toFixed(1) + "M%";
  } else if (absNum >= 1e3) {
    formattedValue = (num / 1e3).toFixed(1) + "K%";
  } else {
    formattedValue = num.toFixed(1) + "%";
  }

  return (
    <span className={num >= 0 ? "text-success" : "text-danger"}>
      {num >= 0 ? "+" : ""}
      {formattedValue}
    </span>
  );
}

export { formatNumber, formatCurrency, formatPercentage };
