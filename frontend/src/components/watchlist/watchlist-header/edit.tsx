import { Watchlist } from "@/services/watchlist/interface";
import { useState } from "react";

type EditWatchlistHeaderProps = {
  initialWatchlist: Watchlist;
  onEdit: (data: Watchlist) => Promise<void>;
};

const EditWatchlistHeader = ({
  initialWatchlist,
  onEdit,
}: EditWatchlistHeaderProps) => {
  const [name, setName] = useState(initialWatchlist.name);
  const [description, setDescription] = useState(
    initialWatchlist.description || ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onEdit({
      ...initialWatchlist,
      name,
      description: description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="editWatchlistName" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="editWatchlistName"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          placeholder="Watchlist Name"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="editWatchlistDescription" className="form-label">
          Description (optional)
        </label>
        <textarea
          className="form-control"
          id="editWatchlistDescription"
          rows={2}
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="A description for my watchlist"
        ></textarea>
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!name.trim()}
        >
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setName(initialWatchlist.name);
            setDescription(initialWatchlist.description || "");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditWatchlistHeader;
