/**
 * Format a number as currency (USD)
 * @param value Number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

/**
 * Format a number with thousands separators
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param value Number to format (e.g., 0.05 for 5%)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never",
  }).format(value / 100)}`;
};
