interface DeleteWatchlistDialogProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

export default function DeleteWatchlistDialog({
  show,
  onHide,
  onConfirm,
}: DeleteWatchlistDialogProps) {
  const handleConfirm = () => {
    onHide();
    onConfirm();
  };

  if (!show) return null;
  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Watchlist</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              />
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this watchlist? This action
                cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
