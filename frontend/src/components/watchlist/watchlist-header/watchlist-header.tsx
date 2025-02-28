import React, { useEffect, useState } from "react";
import { Watchlist } from "@/services/watchlist/interface";
import { Pencil, Trash } from "lucide-react";
import EditWatchlistHeader from "./edit";
import DeleteWatchlistDialog from "./delete-watchlist-dialog";

interface WatchlistHeaderProps {
  watchlist: Watchlist;
  onUpdate: (watchlist: Watchlist) => void;
  onDelete: () => void;
}

const WatchlistHeader: React.FC<WatchlistHeaderProps> = ({
  watchlist: _watchlist,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [watchlist, setWatchlist] = useState<Watchlist>(_watchlist);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onEdit = async (data: Watchlist) => {
    onUpdate(data);
    setIsEditing(false);
  };

  useEffect(() => {
    setWatchlist(_watchlist);
  }, [_watchlist]);

  return (
    <>
      <div className="mb-4">
        {isEditing ? (
          <EditWatchlistHeader initialWatchlist={watchlist} onEdit={onEdit} />
        ) : (
          <div className="row align-items-center">
            <div className="col">
              <h2 className="mb-0">{watchlist.name}</h2>
              {watchlist.description && (
                <p className="text-muted mt-2 mb-0">{watchlist.description}</p>
              )}
              {watchlist.is_default && (
                <span className="badge bg-primary mt-2">Default</span>
              )}
            </div>
            {!watchlist.is_default && (
              <div className="col-auto d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm d-flex align-items-center"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash className="me-1" size={16} /> Delete
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm d-flex align-items-center"
                  onClick={handleEdit}
                >
                  <Pencil className="me-1" size={16} /> Edit
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <DeleteWatchlistDialog
        show={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        onConfirm={onDelete}
      />
    </>
  );
};

export default WatchlistHeader;
