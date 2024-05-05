import React from "react";

const DeleteAccountModal = ({
  isOpen,
  onClose,
  onDelete,
  deleteAccountMessage,
}) => {
  const handleDelete = () => {
    onDelete();
    //onClose();
  };

  return (
    <div
      className={`modal ${
        isOpen ? "block" : "hidden"
      } fixed inset-0 z-10 overflow-y-auto`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container fixed top-0 left-0 right-0 mx-auto max-w-sm p-6 rounded-lg shadow-lg bg-white">
        <div className="modal-content">
          <div className="modal-header">
            {deleteAccountMessage && (
              <span
                className={`text-${
                  deleteAccountMessage?.status === 204 ? "green" : "red"
                }-500 text-sm`}
              >
                {deleteAccountMessage.message}
              </span>
            )}
            <h3 className="modal-title text-lg font-semibold">
              Supprimer le compte
            </h3>
            <button
              className="modal-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              irréversible.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>
              Supprimer
            </button>
            <button
              disabled={deleteAccountMessage?.status === 204}
              className="btn"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
