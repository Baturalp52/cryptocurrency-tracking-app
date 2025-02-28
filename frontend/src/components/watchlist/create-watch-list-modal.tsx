import React, { useState } from "react";
import { CreateWatchlistRequest } from "@/services/watchlist/interface";

interface CreateWatchlistModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreateWatchlistRequest) => Promise<void>;
  isCreating: boolean;
}

const CreateWatchlistModal: React.FC<CreateWatchlistModalProps> = ({
  show,
  onHide,
  onSubmit,
  isCreating,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSubmit({
      name,
      description: description || undefined,
    });

    // Reset form
    setName("");
    setDescription("");
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Watchlist</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="watchlistName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="watchlistName"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                    placeholder="My Watchlist"
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="watchlistDescription" className="form-label">
                    Description (optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="watchlistDescription"
                    rows={3}
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(e.target.value)
                    }
                    placeholder="A description for my watchlist"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isCreating || !name.trim()}
                >
                  {isCreating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    "Create Watchlist"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateWatchlistModal;
