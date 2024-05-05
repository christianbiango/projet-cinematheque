import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DeleteAccountModal from "../../components/DeleteAccountModal";

const AccountHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasLastUpdate, setHasLastUpdate] = useState(null);
  const [deleteAccountMessage, setDeleteAccountMessage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { getUserInformations, deleteAccount, logout } =
    useContext(AuthContext);
  useEffect(() => {
    const fetchUserInformations = async () => {
      const response = await getUserInformations();
      setCurrentUser(response);

      if (response) {
        const result = checkLastAccountUpdate(response);
        setHasLastUpdate(result);
      }
    };
    fetchUserInformations();
  }, []);

  const checkLastAccountUpdate = (response) => {
    const timeDifference =
      new Date(response.lastAccountUpdate).getTime() -
      new Date(response.createdAt).getTime();

    // Convertir la différence en minutes
    const minutesDifference = timeDifference / (1000 * 60); // 1000 millisecondes par seconde, 60 secondes par minute

    // Vérifier si la différence est inférieure à 1 minute
    return minutesDifference > 1;
  };
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
    const response = await deleteAccount(currentUser._id);
    if (response && response?.message) setDeleteAccountMessage(response);

    setTimeout(async () => {
      await logout();
    }, 2000);
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
                  {currentUser?.lastAccountUpdate && hasLastUpdate
                    ? formatDate(currentUser.lastAccountUpdate)
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
        deleteAccountMessage={deleteAccountMessage}
      />
    </div>
  );
};

export default AccountHome;
