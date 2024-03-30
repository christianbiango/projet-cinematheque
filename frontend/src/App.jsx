import { Route, Routes } from "react-router-dom";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Routes privées */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />}></Route>
        </Route>

        {/* Routes de connexion */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </>
  );
}

export default App;
