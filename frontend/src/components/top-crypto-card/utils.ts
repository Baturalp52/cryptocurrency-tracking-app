function getSymbolImage(id: number) {
  return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  } else if (price >= 1) {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 4,
    });
  } else {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 6,
    });
  }
}

function formatMarketCap(marketCap: number) {
  if (marketCap >= 1_000_000_000) {
    return `$${(marketCap / 1_000_000_000).toFixed(1)}B`;
  } else if (marketCap >= 1_000_000) {
    return `$${(marketCap / 1_000_000).toFixed(1)}M`;
  } else {
    return `$${(marketCap / 1_000).toFixed(1)}K`;
  }
}

export { getSymbolImage, formatPrice, formatMarketCap };
