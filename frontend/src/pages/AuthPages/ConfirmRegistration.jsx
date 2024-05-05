import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ConfirmRegistration = () => {
  const { vtoken } = useParams();
  const { register } = useContext(AuthContext);
  const [registrationResult, setRegistrationResult] = useState(null);

  useEffect(() => {
    const confirmRegistration = async () => {
      const result = await register(vtoken);
      setRegistrationResult(result);
    };

    confirmRegistration();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {registrationResult && (
          <div>
            {registrationResult.status === 201 ? (
              <div className="text-green-500 text-2xl mb-4">
                Inscription réussie!{" "}
                <span>
                  Vous pouvez à présent vous rendre sur la{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    page de connexion
                  </Link>
                </span>
              </div>
            ) : (
              <div className="text-red-500 text-2xl mb-4">
                L&apos;inscription n&apos;a pas pu être validée.
              </div>
            )}
            <p className="text-gray-700">
              {registrationResult.message || registrationResult}
            </p>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
              Se rendre à la page de connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmRegistration;
