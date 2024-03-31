import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { sendMovies } from "../redux/movies.reducer.js";

const Home = () => {
  const store = useSelector((state) => state.movies.data);
  const dispatch = useDispatch();
  const { getDBMovies } = useContext(AuthContext);

  useEffect(() => {
    getDBMovies()
      .then((res) => {
        dispatch(sendMovies(res.movies));
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(store);
  return (
    <>
      <h1>Home</h1>

      {store ? (
        store.map((movie, index) => {
          return (
            <div key={index}>
              <h2>{movie.titre}</h2>
            </div>
          );
        })
      ) : (
        <span>Chargement...</span>
      )}
    </>
  );
};

export default Home;
