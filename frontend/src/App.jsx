import { Route, Routes, useLocation, useParams } from "react-router-dom";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import Home from "./pages/Home";
import FavouriteMovies from "./pages/FavouriteMovies.jsx";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import ConfirmRegistration from "./pages/AuthPages/ConfirmRegistration";

function App() {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Forcer le re-render du component FavouriteMovies
    setKey((prevKey) => prevKey + 1);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* Routes privées */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/favoris"
            element={<FavouriteMovies key={key} props={"favouriteMovies"} />}
          ></Route>
          <Route
            path="/films-vus"
            element={<FavouriteMovies key={key} props={"seenMovies"} />}
          ></Route>
          <Route
            path="/films-a-voir"
            element={<FavouriteMovies key={key} props={"seeLaterMovies"} />}
          ></Route>
        </Route>

        {/* Routes de connexion */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/validate-email/:vtoken"
          element={<ConfirmRegistration />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
