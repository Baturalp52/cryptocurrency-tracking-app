import { Metadata } from "next";
import { notFound } from "next/navigation";
import CryptoDetailView from "@/components/crypto-detail/crypto-detail-view";
import { getCryptocurrencyDetail } from "@/services/cryptocurrency";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const cryptoId = parseInt(id);
    const cryptoData = await getCryptocurrencyDetail(cryptoId);

    return {
      title: `${cryptoData.data.name} (${cryptoData.data.symbol}) - Cryptocurrency Tracking App`,
      description: `View detailed information about ${cryptoData.data.name} including price, market cap, volume, and historical data.`,
    };
  } catch {
    return {
      title: "Cryptocurrency Details - Cryptocurrency Tracking App",
      description: "View detailed information about cryptocurrencies.",
    };
  }
}

// Main page component
export default async function CryptocurrencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Artificial delay to test loading state
  const { id } = await params;
  try {
    const cryptoId = parseInt(id);

    // Fetch cryptocurrency data
    const cryptoResponse = await getCryptocurrencyDetail(cryptoId);
    const cryptoData = cryptoResponse.data;

    return (
      <div className="container">
        <CryptoDetailView cryptoData={cryptoData} />
      </div>
    );
  } catch {
    // If cryptocurrency not found or error occurs, return 404
    notFound();
  }
}
