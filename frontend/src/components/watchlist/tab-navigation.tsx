import React from "react";
import { Watchlist } from "@/services/watchlist/interface";
import { Plus } from "lucide-react";

interface TabNavigationProps {
  watchlists: Watchlist[];
  activeWatchlistId: number | null;
  onSelectWatchlist: (id: number) => void;
  onShowCreateModal: () => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  watchlists,
  activeWatchlistId,
  onSelectWatchlist,
  onShowCreateModal,
}) => {
  return (
    <ul
      className="nav nav-tabs flex-nowrap overflow-auto mb-4 border-bottom"
      style={{ scrollbarWidth: "none" }} // Hide scrollbar in Firefox
    >
      {watchlists.map((watchlist) => (
        <li className="nav-item" key={watchlist.id}>
          <a
            className={`nav-link d-flex align-items-center ${
              watchlist.id === activeWatchlistId ? "active" : ""
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectWatchlist(watchlist.id);
            }}
          >
            {watchlist.name}
            {watchlist.is_default && (
              <span className="badge bg-primary ms-2 rounded-pill">
                Default
              </span>
            )}
          </a>
        </li>
      ))}
      <li className="nav-item">
        <a
          className="nav-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onShowCreateModal();
          }}
          title="Create new watchlist"
        >
          <Plus size={16} />
        </a>
      </li>
    </ul>
  );
};

export default TabNavigation;
