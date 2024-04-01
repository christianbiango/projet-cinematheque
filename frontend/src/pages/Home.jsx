import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFailure, sendMovies } from "../redux/movies.reducer.js";
import * as USER_ACTION from "../redux/users.reducer.js"; // Nécessite un import contrairement à movies.reducer

const Home = () => {
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const { getHomeMovies, getMoviesPreferences, user, patchMoviePreference } =
    useContext(AuthContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(50);

  useEffect(() => {
    const pageFirstMovie = currentPage * moviesPerPage - moviesPerPage;
    const pageLastMovie = currentPage * moviesPerPage;

    const fetchMovies = async () => {
      try {
        const moviesPreferences = await getMoviesPreferences(
          "seenMovies favouriteMovies seeLaterMovies"
        );

        const homeMovies = await getHomeMovies(
          pageFirstMovie,
          pageLastMovie,
          currentPage
        );
        dispatch(USER_ACTION.sendMoviesPreferences(moviesPreferences));
        dispatch(sendMovies(homeMovies.data));
      } catch (err) {
        console.error(err);
        dispatch(fetchFailure());
      }
    };
    fetchMovies();
  }, [currentPage, moviesPerPage, dispatch]);

  const toggleLike = async (movie) => {
    const patchKeyName = "favouriteMovies";
    const data = await patchMoviePreference(movie, patchKeyName);
    dispatch(USER_ACTION.sendMoviePreference({ data, patchKeyName }));
  };
  const toggleWatched = async (movie) => {
    const patchKeyName = "seenMovies";
    const data = await patchMoviePreference(movie, patchKeyName);
    dispatch(USER_ACTION.sendMoviePreference({ data, patchKeyName }));
  };
  const toggleSeeLater = async (movie) => {
    const patchKeyName = "seeLaterMovies";
    const data = await patchMoviePreference(movie, patchKeyName);
    dispatch(USER_ACTION.sendMoviePreference({ data, patchKeyName }));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-left">
        Bienvenue,
        <br />
        {user.username.toUpperCase()}
      </h1>
      <div className="movie-container">
        {store.movies.data ? (
          store.movies.data.map((movie, index) => {
            return (
              <div key={index}>
                {/* Conteneur du film */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-bold mb-2">{movie.titre}</h2>
                  {movie?.genre ? (
                    <p className="text-sm text-gray-700">{movie.genre}</p>
                  ) : (
                    ""
                  )}
                  <p className="text-sm text-gray-700">{movie.realisateurs}</p>
                  <p className="text-sm text-gray-700">
                    {movie.anneeProduction}
                  </p>
                  <p className="text-sm text-gray-700">{movie.nationalite}</p>
                  <p className="text-sm text-gray-700">{movie.duree}</p>
                  <p className="text-sm text-gray-700">{movie.synopsis}</p>
                  {/* Autres détails du film */}
                  <div className="flex items-center">
                    {/* Icone Like */}
                    <button onClick={() => toggleLike(movie)}>
                      <img
                        src={
                          store.users.favouriteMovies.some(
                            (favouriteMovie) => movie.id === favouriteMovie.id
                          )
                            ? "/public/heart-solid.svg"
                            : "/public/heart-regular.svg"
                        }
                        alt="Like"
                        height={20}
                        width={20}
                      />
                    </button>
                    {/* Icone Vu */}
                    <button onClick={() => toggleWatched(movie)}>
                      <img
                        src={
                          store.users.seenMovies.some(
                            (seenMovie) => movie.id === seenMovie.id
                          )
                            ? "/public/toggle-on-solid.svg"
                            : "/public/toggle-off-solid.svg"
                        }
                        alt="Vu"
                        height={20}
                        width={20}
                        className="ml-2"
                      />
                    </button>
                    {/* Icone à voir */}
                    <button onClick={() => toggleSeeLater(movie)}>
                      <img
                        src={
                          store.users.seeLaterMovies.some(
                            (seeLaterMovie) => movie.id === seeLaterMovie.id
                          )
                            ? "/public/toggle-on-solid.svg"
                            : "/public/toggle-off-solid.svg"
                        }
                        alt="À voir"
                        height={20}
                        width={20}
                        className="ml-2"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <span>Chargement...</span>
        )}
      </div>
      {/* Pagination */}
      {store.movies.totalMovies ? (
        <ul className="flex justify-center mt-4">
          {[...Array(Math.ceil(store.movies.totalMovies / moviesPerPage))].map(
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
