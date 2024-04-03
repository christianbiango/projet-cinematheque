import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFailure, sendMovies } from "../redux/movies.reducer.js";
import * as USER_ACTION from "../redux/users.reducer.js"; // Nécessite un import contrairement à movies.reducer
import SuggestionsMap from "../components/SuggestionsMap.jsx";

const FavouriteMovies = ({ props }) => {
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const {
    getMoviesPreferences,
    getMoviePreference,
    user,
    patchMoviePreference,
    getTMDBMovie,
  } = useContext(AuthContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);

  useEffect(() => {
    const pageFirstMovie = currentPage * moviesPerPage - moviesPerPage;
    const pageLastMovie = currentPage * moviesPerPage;

    const fetchMovies = async () => {
      try {
        const moviesPreferences = await getMoviesPreferences(
          "seenMovies favouriteMovies seeLaterMovies"
        );

        const moviesPreference = await getMoviePreference({
          preferenceKey: props,
          pageFirstMovie: pageFirstMovie,
          pageLastMovie: pageLastMovie,
          currentPage: currentPage,
        });
        console.log(moviesPreference);
        const apiImages = moviesPreference.movies.map(async (movie) => {
          return {
            titre: movie.titre,
            url: await movieImage(movie.titre, movie.anneeProduction),
          };
        });

        moviesPreference.images = await Promise.all(apiImages);
        dispatch(USER_ACTION.sendMoviesPreferences(moviesPreferences));

        dispatch(sendMovies(moviesPreference));
      } catch (err) {
        console.error(err);
        dispatch(fetchFailure());
        dispatch(USER_ACTION.fetchFailure());
      }
    };
    fetchMovies();
  }, [currentPage, moviesPerPage, dispatch]);

  const movieImage = async (title, year) => {
    const movieImg = await getTMDBMovie(title, year);
    return movieImg || undefined;
  };

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
      <SuggestionsMap />
      <div className="movie-container">
        {store ? (
          store.movies.data.map((movie, index) => {
            return (
              <div key={index}>
                {/* Conteneur du film */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  {/* Image du film par TMDB */}
                  <img
                    height={600}
                    width={600}
                    src={
                      store.movies.images.filter(
                        (image) => image.titre === movie.titre
                      )[0].url || "/unknown-image.png"
                    }
                  ></img>

                  {/* Reste du film*/}
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
                            ? "/heart-solid.svg"
                            : "/heart-regular.svg"
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
                            ? "/toggle-on-solid.svg"
                            : "/toggle-off-solid.svg"
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
      ) : store && store.movies.totalMovies === 0 ? (
        <span>Aucun film à afficher :) </span>
      ) : (
        <span>Chargement...</span>
      )}
    </>
  );
};

export default FavouriteMovies;
