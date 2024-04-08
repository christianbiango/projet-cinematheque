import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const ConfirmRegistration = () => {
  const { vtoken } = useParams();
  const { register } = useContext(AuthContext);

  useEffect(() => {
    register(vtoken);
  }, []);
  return <div>ConfirmRegistration</div>;
};

export default ConfirmRegistration;
