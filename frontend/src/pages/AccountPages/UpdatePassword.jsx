import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UpdatePasswordForm from "../../components/UpdatePasswordForm";

const UpdatePassword = () => {
  const { updatePassword, user } = useContext(AuthContext);
  return (
    <UpdatePasswordForm updatePassword={updatePassword} userId={user.id} />
  );
};

export default UpdatePassword;
