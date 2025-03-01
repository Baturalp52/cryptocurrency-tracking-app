"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "../modal";
import { Search, X, XCircle } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";
import {
  CryptocurrencySearchData,
  searchCryptocurrencies,
} from "@/services/cryptocurrency";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    CryptocurrencySearchData[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search cryptocurrencies when debounced query changes
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchCryptos = async () => {
      setIsSearching(true);
      try {
        const results = await searchCryptocurrencies(debouncedSearchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching cryptocurrencies:", error);
      } finally {
        setIsSearching(false);
      }
    };

    searchCryptos();
  }, [debouncedSearchQuery]);

  const handleCryptoClick = (id: number) => {
    router.push(`/cryptocurrencies/${id}`);
    onClose();
  };

  const renderCryptoItem = (crypto: CryptocurrencySearchData) => (
    <button
      key={crypto.id}
      className="list-group-item bg-transparent border-0 list-group-item-action d-flex align-items-center justify-content-between"
      onClick={() => handleCryptoClick(crypto.id)}
    >
      <div className="d-flex align-items-center">
        <div className="me-3">
          <Image
            src={
              crypto.logo ||
              `https://cryptologos.cc/logos/${
                crypto.id
              }-${crypto.symbol.toLowerCase()}-logo.png?v=023`
            }
            alt={crypto.name}
            width="32"
            height="32"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/32";
            }}
          />
        </div>
        <div>
          <h6 className="mb-0">
            {crypto.name.length > 12
              ? crypto.name.substring(0, 12) + "..."
              : crypto.name}
          </h6>
          <small className="text-muted">{crypto.symbol}</small>
        </div>
      </div>
      <div className="text-end">
        <div>{formatCurrency(crypto.price)}</div>
        <small
          className={crypto.change24h >= 0 ? "text-success" : "text-danger"}
        >
          {formatPercentage(crypto.change24h)}
        </small>
      </div>
    </button>
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && debouncedSearchQuery.trim()) {
      const searchCryptos = async () => {
        setIsSearching(true);
        try {
          const results = await searchCryptocurrencies(debouncedSearchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching cryptocurrencies:", error);
        } finally {
          setIsSearching(false);
        }
      };

      searchCryptos();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header className="border-0 pb-0">
        <div className="d-flex align-items-center w-100">
          <Search size={20} className="text-muted me-2" />
          <input
            ref={inputRef}
            type="text"
            className="form-control border-0 shadow-none flex-fill"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => {
              setIsSearching(true);
              setSearchQuery(e.target.value);
            }}
            onKeyDown={handleSearchKeyDown}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn btn-link p-0 text-muted me-2"
              onClick={() => setSearchQuery("")}
            >
              <XCircle size={20} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-link p-0 text-muted"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {isSearching ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="list-group list-group-flush">
            {searchResults.map(renderCryptoItem)}
          </div>
        ) : (
          debouncedSearchQuery && (
            <div className="text-center py-4 text-muted">
              <p>
                No cryptocurrencies found matching &quot;{debouncedSearchQuery}
                &quot;
              </p>
            </div>
          )
        )}
      </Modal.Body>
    </Modal>
  );
}
