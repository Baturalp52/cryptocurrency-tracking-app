import React, { useState } from "react";
import { WatchlistCryptocurrency } from "@/services/watchlist/interface";
import { Trash, Pencil, Check, X } from "lucide-react";
import Image from "next/image";
import { getSymbolImage } from "../top-crypto-card/utils";
import { useRouter } from "next/navigation";

interface CryptocurrencyTableProps {
  cryptocurrencies: WatchlistCryptocurrency[];
  onRemove: (symbol: string) => Promise<void>;
  onUpdateNotes: (symbol: string, notes: string) => Promise<void>;
}

const CryptocurrencyTable: React.FC<CryptocurrencyTableProps> = ({
  cryptocurrencies,
  onRemove,
  onUpdateNotes,
}) => {
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  const handleCryptoClick = (crypto: WatchlistCryptocurrency) => {
    router.push(`/cryptocurrencies/${crypto.cmc_id}`);
  };

  const handleEditNotes = (crypto: WatchlistCryptocurrency) => {
    setEditingSymbol(crypto.symbol);
    setEditingNotes(crypto.notes || "");
  };

  const handleCancelEdit = () => {
    setEditingSymbol(null);
    setEditingNotes("");
  };

  const handleSaveNotes = async (symbol: string) => {
    try {
      setIsUpdating(true);
      await onUpdateNotes(symbol, editingNotes);
      setEditingSymbol(null);
      setEditingNotes("");
    } catch (error) {
      console.error("Error updating notes:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (cryptocurrencies.length === 0) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">
          No cryptocurrencies in this watchlist yet. Add your first
          cryptocurrency to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies.map((crypto) => (
            <tr
              key={crypto.symbol}
              role="button"
              onClick={() => handleCryptoClick(crypto)}
            >
              <td className="align-middle">
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src={getSymbolImage(crypto.cmc_id || 0)}
                    alt={crypto.symbol}
                    width={24}
                    height={24}
                    className="me-2"
                  />
                  <strong>{crypto.symbol}</strong>
                </div>
              </td>
              <td className="align-middle">{crypto.name}</td>
              <td className="align-middle" style={{ minWidth: "200px" }}>
                {editingSymbol === crypto.symbol ? (
                  <div className="d-flex gap-2">
                    <textarea
                      className="form-control form-control-sm"
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      rows={2}
                      placeholder="Add notes about this cryptocurrency"
                      disabled={isUpdating}
                    ></textarea>
                    <div className="d-flex flex-column gap-1">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleSaveNotes(crypto.symbol)}
                        disabled={isUpdating}
                      >
                        <Check className="me-1" size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        <X className="me-1" size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted text-wrap">
                      {(crypto.notes || "No notes added").length > 20
                        ? `${(crypto.notes || "No notes added").substring(
                            0,
                            20
                          )}...`
                        : crypto.notes || "No notes added"}
                    </span>
                    <button
                      className="btn btn-sm btn-link p-0 ms-2 text-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNotes(crypto);
                      }}
                    >
                      <Pencil className="me-1" size={16} /> Edit
                    </button>
                  </div>
                )}
              </td>
              <td className="align-middle">
                <button
                  className="btn btn-sm btn-outline-danger text-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(crypto.symbol);
                  }}
                >
                  <Trash className="me-1" size={16} /> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptocurrencyTable;
