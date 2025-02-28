"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getWatchlists,
  createWatchlist,
  deleteWatchlist,
  updateWatchlist,
} from "@/services/watchlist/client";
import {
  Watchlist,
  CreateWatchlistRequest,
} from "@/services/watchlist/interface";
import TabNavigation from "@/components/watchlist/tab-navigation";
import CreateWatchlistModal from "@/components/watchlist/create-watch-list-modal";
import CryptocurrencyTable from "@/components/watchlist/cryptocurrency-table";
import WatchlistHeader from "@/components/watchlist/watchlist-header";
import {
  removeCryptocurrency,
  updateCryptocurrencyNotes,
} from "@/services/watchlist/cryptocurrencies";
import { Plus } from "lucide-react";
import Link from "next/link";
export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<number | null>(
    null
  );
  const [activeWatchlist, setActiveWatchlist] = useState<Watchlist | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  useEffect(() => {
    if (watchlists.length > 0 && !activeWatchlistId) {
      const activeWatchlist = watchlists[0];
      setActiveWatchlistId(activeWatchlist.id);
      setActiveWatchlist(activeWatchlist);
    } else if (watchlists.length > 0 && activeWatchlistId) {
      // Update active watchlist when watchlists change
      const current = watchlists.find((w) => w.id === activeWatchlistId);
      if (current) {
        setActiveWatchlist(current);
      } else {
        // If active watchlist was deleted, select the first one
        setActiveWatchlistId(watchlists[0].id);
        setActiveWatchlist(watchlists[0]);
      }
    }
  }, [watchlists, activeWatchlistId]);

  const fetchWatchlists = async () => {
    try {
      setLoading(true);
      const data = await getWatchlists();
      setWatchlists(data);
      setError(null);
    } catch (err) {
      setError("Failed to load watchlists. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWatchlist = async (data: CreateWatchlistRequest) => {
    try {
      const newWatchlist = await createWatchlist(data);
      setWatchlists([...watchlists, newWatchlist]);
      setShowCreateModal(false);
      setActiveWatchlistId(newWatchlist.id);
    } catch (err) {
      setError("Failed to create watchlist. Please try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectWatchlist = (id: number) => {
    setActiveWatchlistId(id);
    const selected = watchlists.find((w) => w.id === id);
    if (selected) {
      setActiveWatchlist(selected);
    }
  };

  const handleRemoveCryptocurrency = async (symbol: string) => {
    if (!activeWatchlist) return;

    const currentWatchlists = watchlists;

    // Update the active watchlist by removing the cryptocurrency
    const updatedWatchlist = {
      ...activeWatchlist,
      cryptocurrencies: activeWatchlist.cryptocurrencies.filter(
        (c) => c.symbol !== symbol
      ),
    };

    // Update the watchlists array
    setWatchlists(
      watchlists.map((w) =>
        w.id === updatedWatchlist.id ? updatedWatchlist : w
      )
    );

    try {
      await removeCryptocurrency(activeWatchlist.id, symbol);
    } catch {
      // TODO: Add a toast to the user
      setWatchlists(currentWatchlists);
    }
  };

  const handleUpdateCryptocurrencyNotes = async (
    symbol: string,
    notes: string
  ) => {
    if (!activeWatchlist) return;

    const currentWatchlists = watchlists;

    // Update the active watchlist with the updated cryptocurrency
    const updatedWatchlist = {
      ...activeWatchlist,
      cryptocurrencies: activeWatchlist.cryptocurrencies.map((c) =>
        c.symbol === symbol ? { ...c, notes } : c
      ),
    };

    // Update the watchlists array
    setWatchlists(
      watchlists.map((w) =>
        w.id === updatedWatchlist.id ? updatedWatchlist : w
      )
    );
    try {
      await updateCryptocurrencyNotes(activeWatchlist.id, symbol, { notes });
    } catch {
      setWatchlists(currentWatchlists);
      // TODO: Add a toast to the user
    }
  };

  const handleDeleteWatchlist = useCallback(async () => {
    if (!activeWatchlist) return;

    // Keep track of current state in case we need to rollback
    const currentWatchlists = watchlists;
    const currentActiveWatchlist = activeWatchlist;

    // Create filtered watchlists
    const filteredWatchlists = watchlists.filter(
      (w) => w.id !== activeWatchlist.id
    );

    // Apply optimistic updates
    setWatchlists(filteredWatchlists);
    setActiveWatchlist(
      filteredWatchlists.length > 0 ? filteredWatchlists[0] : null
    );

    // Make the API call outside of any state updater function
    try {
      await deleteWatchlist(activeWatchlist.id);
    } catch (error) {
      // Revert changes on error
      console.error("Failed to delete watchlist:", error);
      setWatchlists(currentWatchlists);
      setActiveWatchlist(currentActiveWatchlist);
      // TODO: Add a toast to the user
    }
  }, [activeWatchlist, watchlists]);

  const handleUpdateWatchlist = async (watchlist: Watchlist) => {
    const currentWatchlists = watchlists;
    const currentActiveWatchlist = activeWatchlist;

    const updatedWatchlists = currentWatchlists.map((w) =>
      w.id === watchlist.id ? watchlist : w
    );

    setWatchlists(updatedWatchlists);
    setActiveWatchlist(watchlist);

    try {
      await updateWatchlist(watchlist.id, watchlist);
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      setWatchlists(currentWatchlists);
      setActiveWatchlist(currentActiveWatchlist);
      // TODO: Add a toast to the user
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (watchlists.length === 0) {
    return (
      <div className="container py-4">
        <div className="alert alert-info">
          <h4 className="alert-heading">No Watchlists Found</h4>
          <p>
            You do not have any watchlists yet. Create your first watchlist to
            get started.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create Watchlist
            </button>
          </div>
        </div>

        <CreateWatchlistModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateWatchlist}
          isCreating={isCreating}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <TabNavigation
        watchlists={watchlists}
        activeWatchlistId={activeWatchlistId}
        onSelectWatchlist={handleSelectWatchlist}
        onShowCreateModal={() => setShowCreateModal(true)}
      />

      {activeWatchlist && (
        <>
          <WatchlistHeader
            watchlist={activeWatchlist}
            onDelete={handleDeleteWatchlist}
            onUpdate={handleUpdateWatchlist}
          />

          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3 gap-3">
            <h3 className="mb-0">Cryptocurrencies</h3>
            <Link href={`/cryptocurrencies`} className="btn btn-primary">
              <Plus size={16} className="me-1" /> Add Cryptocurrency
            </Link>
          </div>

          <CryptocurrencyTable
            cryptocurrencies={activeWatchlist.cryptocurrencies}
            onRemove={handleRemoveCryptocurrency}
            onUpdateNotes={handleUpdateCryptocurrencyNotes}
          />
        </>
      )}

      <CreateWatchlistModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSubmit={handleCreateWatchlist}
        isCreating={isCreating}
      />
    </div>
  );
}
