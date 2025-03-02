"use client";

import { useState, useEffect } from "react";
import { Ban, Loader2, Check } from "lucide-react";
import { Popover } from "react-tiny-popover";
import { CryptocurrencyDetail } from "@/services/cryptocurrency/interface";
import { blacklistCryptocurrency } from "@/services/admin/blacklisted-cryptocurrencies/client";
import { removeFromBlacklist } from "@/services/admin/blacklisted-cryptocurrencies";
import { useAuth } from "@/contexts/auth-context";
import UserRole from "@/enums/user-role";

interface BlacklistCryptoProps {
  cryptoData: CryptocurrencyDetail;
}

export default function BlacklistCrypto({ cryptoData }: BlacklistCryptoProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const { user } = useAuth();

  // Only admin users can blacklist cryptocurrencies
  const isAdmin = user?.role === UserRole.ADMIN;

  // Check if the cryptocurrency is already blacklisted
  useEffect(() => {
    if (cryptoData.blacklisted) {
      setIsBlacklisted(true);
    } else {
      setIsBlacklisted(false);
    }
  }, [cryptoData]);

  if (!isAdmin) {
    return null;
  }

  const handleBlacklist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await blacklistCryptocurrency({
        symbol: cryptoData.symbol,
        name: cryptoData.name,
        cmc_id: cryptoData.id.toString(),
        reason: reason.trim() || undefined,
      });

      setSuccess(true);
      setReason("");
      setIsBlacklisted(true);

      // Close popover after a delay
      setTimeout(() => {
        setIsPopoverOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error blacklisting cryptocurrency:", error);
      setError("Failed to blacklist cryptocurrency. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromBlacklist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await removeFromBlacklist(cryptoData.id);
      setSuccess(true);
      setIsBlacklisted(false);
      setSuccess(false);

      // Close popover after a delay if it's open
      if (isPopoverOpen) {
        setTimeout(() => {
          setIsPopoverOpen(false);
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error removing cryptocurrency from blacklist:", error);
      setError("Failed to remove from blacklist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="position-relative">
      {!isBlacklisted ? (
        <Popover
          isOpen={isPopoverOpen}
          positions={["bottom", "top", "left", "right"]}
          padding={8}
          onClickOutside={() => setIsPopoverOpen(false)}
          content={
            <div
              className="p-3 card shadow rounded border"
              style={{ width: "300px" }}
            >
              <h6 className="mb-3">
                Blacklist{" "}
                <span className="badge bg-danger">{cryptoData.symbol}</span>
              </h6>

              {success ? (
                <div className="alert alert-success">
                  Successfully blacklisted {cryptoData.symbol}
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor="blacklist-reason" className="form-label">
                      Reason for blacklisting (optional)
                    </label>
                    <textarea
                      id="blacklist-reason"
                      className="form-control"
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Provide a reason for blacklisting this cryptocurrency (optional)"
                      disabled={isLoading}
                    />
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => setIsPopoverOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleBlacklist}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin me-2" size={16} />
                          Blacklisting...
                        </>
                      ) : (
                        "Blacklist"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          }
        >
          <button
            className="btn btn-outline-danger"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            type="button"
            title="Blacklist this cryptocurrency"
          >
            <Ban size={16} className="me-2" />
            Blacklist
          </button>
        </Popover>
      ) : (
        <button
          className="btn btn-outline-success"
          onClick={handleRemoveFromBlacklist}
          type="button"
          title="Remove from blacklist"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin me-2" size={16} />
          ) : (
            <Check size={16} className="me-2" />
          )}
          Remove from Blacklist
        </button>
      )}
    </div>
  );
}
