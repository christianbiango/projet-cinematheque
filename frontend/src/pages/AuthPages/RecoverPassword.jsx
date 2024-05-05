import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UpdatePasswordForm from "../../components/UpdatePasswordForm";

const RecoverPassword = () => {
  const { checkRecoverPasswordToken, updatePassword } = useContext(AuthContext);
  const [tokenError, setTokenError] = useState(null);
  const { ptoken } = useParams();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const verifyToken = async () => {
      const response = await checkRecoverPasswordToken(ptoken);

      if (response?.status === 200) {
        setUserId(response.data);
      } else if (response?.message) {
        setTokenError(response.message);
      }
    };
    verifyToken();
  }, []);

  return (
    <>
      {userId && tokenError === null ? (
        <UpdatePasswordForm
          userId={userId}
          updatePassword={updatePassword}
          lostPassword={true}
        />
      ) : (
        <p>{tokenError ? tokenError : "Chargement..."}</p>
      )}
      <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
        Se connecter
      </Link>
    </>
  );
};

export default RecoverPassword;
