import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DeleteAccountModal from "../../components/DeleteAccountModal";

const AccountHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { getUserInformations, deleteAccount, logout } =
    useContext(AuthContext);
  useEffect(() => {
    getUserInformations().then((user) => setCurrentUser(user));
  }, []);

  const formatDate = (date) => {
    const jsDate = new Date(date);
    const day = jsDate.getDate();
    const month = jsDate.getMonth();
    const year = jsDate.getFullYear();

    const hour = jsDate.getHours();
    const minutes = jsDate.getMinutes();

    const dateString = `Le ${day}/${month}/${year} à ${hour}h${minutes}`;

    return dateString;
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount(currentUser._id);
    await logout();
  };

  return (
    <div className="container mx-auto mt-20">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Informations de compte
          </h1>
          {currentUser ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nom d&apos;utilisateur:
                </label>
                <p className="text-gray-900">{currentUser.username}</p>
              </div>

              {/* MAIL  */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Adresse email:
                </label>
                <p className="text-gray-900">{currentUser.email}</p>
              </div>

              {/* Date de création du compte  */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date de création du compte:
                </label>
                <p className="text-gray-900">
                  {currentUser?.createdAt
                    ? formatDate(currentUser.createdAt)
                    : "Aucune"}
                </p>
              </div>

              {/* Date de modification du compte  */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date de dernière modification du compte:
                </label>
                <p className="text-gray-900">
                  {currentUser?.updatedAt
                    ? formatDate(currentUser.updatedAt)
                    : "Aucune"}
                </p>
              </div>
            </>
          ) : (
            <p>Chargement...</p>
          )}
          {/*nom d'utilisateur  */}
        </div>
      </div>

      {/* Modifier le compte  */}
      <div>
        <ul>
          <li className="mx-4">
            <Link to="/account/modifier-compte" className="hover:text-gray-300">
              Modifier les informations du compte
            </Link>
          </li>
          <li className="mx-4">
            <Link
              to="/account/modifier-mot-de-passe"
              className="hover:text-gray-300"
            >
              Modifier le mot de passe
            </Link>
          </li>
          <li className="mx-4">
            <button
              onClick={handleDeleteModalOpen}
              className="hover:text-gray-300"
            >
              Supprimer le compte
            </button>
          </li>
        </ul>
      </div>
      {/* Fenêtre modale de suppression de compte */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default AccountHome;
