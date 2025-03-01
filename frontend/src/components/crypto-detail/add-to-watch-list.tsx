import { Star, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Popover } from "react-tiny-popover";
import { getWatchlists } from "@/services/watchlist/client";
import {
  addCryptocurrency,
  removeCryptocurrency,
} from "@/services/watchlist/cryptocurrencies/client";
import { Watchlist } from "@/services/watchlist/interface";
import { CryptocurrencyDetail } from "@/services/cryptocurrency/interface";

interface AddToWatchListProps {
  cryptoData: CryptocurrencyDetail;
}

export default function AddToWatchList({ cryptoData }: AddToWatchListProps) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWatchlists, setSelectedWatchlists] = useState<number[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchWatchlists = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWatchlists();
      setWatchlists(data);

      // Check which watchlists already contain this crypto
      const containingWatchlists = data
        .filter((watchlist) =>
          watchlist.cryptocurrencies.some(
            (crypto) => crypto.symbol === cryptoData.symbol
          )
        )
        .map((watchlist) => watchlist.id);

      setSelectedWatchlists(containingWatchlists);
    } catch (error) {
      console.error("Error fetching watchlists:", error);
    } finally {
      setLoading(false);
    }
  }, [cryptoData.symbol]);

  const toggleWatchlist = async (watchlistId: number) => {
    const isSelected = selectedWatchlists.includes(watchlistId);
    const previousSelectedWatchlists = selectedWatchlists;

    if (isSelected) {
      setSelectedWatchlists(
        selectedWatchlists.filter((id) => id !== watchlistId)
      );
      try {
        await removeCryptocurrency(watchlistId, cryptoData.symbol);
      } catch (error) {
        console.error("Error removing from watchlist:", error);
        setSelectedWatchlists(previousSelectedWatchlists);
      }
    } else {
      setSelectedWatchlists([...selectedWatchlists, watchlistId]);
      try {
        await addCryptocurrency(watchlistId, {
          symbol: cryptoData.symbol,
          name: cryptoData.name,
          cmc_id: cryptoData.id,
        });
      } catch {
        setSelectedWatchlists(previousSelectedWatchlists);
      }
    }
  };

  const handleOpenPopover = () => {
    setIsPopoverOpen(true);
    fetchWatchlists();
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  return (
    <div className="position-relative">
      <Popover
        isOpen={isPopoverOpen}
        positions={["bottom", "top", "left", "right"]} // Preferred positions in order
        padding={8} // 0.5rem spacing
        onClickOutside={handleClosePopover}
        content={
          <div className="p-3 card shadow rounded border">
            <h6 className="mb-3">
              Select Watchlists to add{" "}
              <span className="badge bg-primary">{cryptoData.symbol}</span>
            </h6>

            {loading ? (
              <div className="d-flex justify-content-center p-3">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : watchlists.length === 0 ? (
              <div className="text-center text-muted">
                <p>No watchlists found</p>
                <small>Create a watchlist to add cryptocurrencies</small>
              </div>
            ) : (
              <div className="watchlist-options">
                {watchlists.map((watchlist) => (
                  <div key={watchlist.id} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`watchlist-${watchlist.id}`}
                      checked={selectedWatchlists.includes(watchlist.id)}
                      onChange={() => toggleWatchlist(watchlist.id)}
                    />
                    <label
                      className="form-check-label d-flex justify-content-between align-items-center"
                      htmlFor={`watchlist-${watchlist.id}`}
                    >
                      <span>{watchlist.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        }
      >
        <button
          ref={buttonRef}
          className="btn btn-primary"
          onClick={handleOpenPopover}
          aria-expanded={isPopoverOpen}
          type="button"
        >
          <Star className="me-2" size={16} />
          Add to Watchlist
        </button>
      </Popover>
    </div>
  );
}
