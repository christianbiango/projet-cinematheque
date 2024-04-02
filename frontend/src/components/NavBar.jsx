import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="bg-gray-800 text-white fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto py-4">
        <ul className="flex justify-center">
          <li className="mx-4">
            <Link to="/" className="hover:text-gray-300">
              Accueil
            </Link>
          </li>
          <li className="mx-4">
            <Link to="/favoris" className="hover:text-gray-300">
              Favoris ⭐
            </Link>
          </li>
          <li className="mx-4">
            <Link to="/films-vus" className="hover:text-gray-300">
              Films vus
            </Link>
          </li>
          <li className="mx-4">
            <Link to="/films-a-voir" className="hover:text-gray-300">
              Films à voir
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
