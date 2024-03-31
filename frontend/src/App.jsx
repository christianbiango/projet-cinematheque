import { Route, Routes } from "react-router-dom";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import Home from "./pages/Home";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Routes privées */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />}></Route>
        </Route>

        {/* Routes de connexion */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </>
  );
}

export default App;
