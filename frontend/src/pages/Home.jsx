import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { sendMovies } from "../redux/movies.reducer.js";

const Home = () => {
  const storeMovies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const { getHomeMovies, user } = useContext(AuthContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(50);

  useEffect(() => {
    const pageFirstMovie = currentPage * moviesPerPage - moviesPerPage;
    const pageLastMovie = currentPage * moviesPerPage;

    const fetchMovies = async () => {
      try {
        const res = await getHomeMovies(
          pageFirstMovie,
          pageLastMovie,
          currentPage
        );
        dispatch(sendMovies(res.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, [currentPage, moviesPerPage, dispatch]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-left">
        Bienvenue,
        <br />
        {user.username.toUpperCase()}
      </h1>
      <div className="movie-container">
        {storeMovies.data ? (
          storeMovies.data.map((movie, index) => {
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md mb-8"
              >
                <h2 className="text-xl font-bold mb-2">
                  {movie.titre} {movie.titreOriginal ? movie.titreOriginal : ""}
                </h2>
                <p className="text-sm text-gray-700">
                  {movie?.genre ? movie.genre : ""}
                </p>
                <p className="text-sm text-gray-700">{movie.realisateurs}</p>
                <p className="text-sm text-gray-700">{movie.anneeProduction}</p>
                <p className="text-sm text-gray-700">{movie.nationalite}</p>
                <p className="text-sm text-gray-700">{movie.duree}</p>
                <p className="text-sm text-gray-700">{movie.synopsis}</p>
              </div>
            );
          })
        ) : (
          <span>Chargement...</span>
        )}
      </div>
      {/* Pagination */}
      {storeMovies.totalMovies ? (
        <ul className="flex justify-center mt-4">
          {[...Array(Math.ceil(storeMovies.totalMovies / moviesPerPage))].map(
            (_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 rounded-md ${
                    index + 1 === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      ) : (
        <span>Chargement...</span>
      )}
    </>
  );
};

export default Home;
