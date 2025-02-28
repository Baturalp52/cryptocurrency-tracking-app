import Image from "next/image";
import { CryptocurrencyData } from "@/services/cryptocurrency";
import { formatMarketCap, formatPrice, getSymbolImage } from "./utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

type TableRowProps = {
  crypto: CryptocurrencyData;
};

export default function TableRow({ crypto }: TableRowProps) {
  const router = useRouter();

  return (
    <tr
      role="button"
      onClick={() => router.push(`/cryptocurrencies/${crypto.id}`)}
    >
      <td className="ps-3 sticky-column">
        <div className="d-flex align-items-center">
          <div className="me-2 bg-light rounded-circle text-center w-4 h-4">
            <Image
              src={getSymbolImage(crypto.id)}
              width={64}
              height={64}
              alt={crypto.name}
              className="w-100 h-100"
            />
          </div>
          <div className="d-flex flex-column align-items-start">
            <div className="fw-medium text-nowrap">{crypto.name}</div>
            <small className="text-muted">{crypto.symbol}</small>
          </div>
        </div>
      </td>
      <td className="text-end fw-medium">
        {formatPrice(crypto.quote.USD.price)}
      </td>
      <td className="text-end">
        <span
          className={`badge ${
            crypto.quote.USD.percent_change_24h >= 0
              ? "bg-success bg-opacity-10 text-success"
              : "bg-danger bg-opacity-10 text-danger"
          }`}
        >
          {crypto.quote.USD.percent_change_24h >= 0 ? (
            <ArrowUp size={14} className="me-1" />
          ) : (
            <ArrowDown size={14} className="me-1" />
          )}
          {Math.abs(crypto.quote.USD.percent_change_24h).toFixed(2)}%
        </span>
      </td>
      <td className="text-end pe-3">
        {formatMarketCap(crypto.quote.USD.market_cap)}
      </td>
    </tr>
  );
}
