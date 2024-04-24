import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UpdatePasswordForm from "../../components/UpdatePasswordForm";

const RecoverPassword = () => {
  const { checkRecoverPasswordToken, updatePassword } = useContext(AuthContext);
  const { ptoken } = useParams();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    checkRecoverPasswordToken(ptoken).then((id) => setUserId(id));
  }, []);
  return userId ? (
    <UpdatePasswordForm userId={userId} updatePassword={updatePassword} />
  ) : (
    <p>Chargement...</p>
  );
};

export default RecoverPassword;
