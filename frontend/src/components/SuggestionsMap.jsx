import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

/**
 * Ce component contient toute la logique d'affichage d'une carte suggérant des films proches de l'utilisateur.
 * Il effectue également l'appel API nécessaire à l'affichage des données
 *  */
const SuggestionsMap = () => {
  const { getMoviesNearUser } = useContext(AuthContext);
  const [position, setPosition] = useState(null);
  const [movies, setMovies] = useState([]);
  const firstMarkerRef = useRef(null);

  // Demander la localisation de l'utilsiateur
  useEffect(() => {
    askForLocation();
  }, []);

  useEffect(() => {
    // Ouvrir la popup du premier marqueur après le chargement de la map
    if (firstMarkerRef.current) {
      firstMarkerRef.current.openPopup();
    }
  }, [movies]);

  const askForLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          fetchMoviesNearUser(latitude, longitude);
        },
        (err) => {
          console.log("Erreur de géolocalisation :", err);
        }
      );
    } else {
      console.log("Ce navigateur ne prend pas en charge la navigation.");
    }
  };

  /**
   * Cette fonction effectue  un appel asynchrone vers la fonction de l'AuthContext effectuant une requête au serveur d'appel à l'API des films proches de l'utilisateur
   * @param {Integer} latitude
   * @param {Integer} longitude
   */
  const fetchMoviesNearUser = async (latitude, longitude) => {
    try {
      const movies = await getMoviesNearUser(latitude, longitude);
      setMovies(movies);
    } catch (err) {
      console.log("Erreur lors de la récupération des films :", err);
    }
  };

  /**
   * Ce Custom Hook déplace la carte là où l'utilisateur se trouve une fois la géolocalisation activée
   */
  function FlyToUserLocation() {
    const map = useMap();
    map.flyTo([position[0], position[1]], 13); // 13 : niveau de zoom
  }

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "60vh", zIndex: "1" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && <FlyToUserLocation />}
      {movies.length === 0 ? (
        <span>Aucun événement à afficher dans un périmètre de 50KM</span>
      ) : (
        movies.map((movie, index) => (
          <Marker
            key={index}
            ref={index === 0 ? firstMarkerRef : null}
            position={[movie.geocodage_xy.lat, movie.geocodage_xy.lon]}
          >
            <Popup>
              <div className="max-h-48 overflow-y-auto">
                <strong>Nom du festival :</strong>
                <br />
                {movie.nom_du_festival}
                <br />
                <br />
                {/* Lieu : addresse postale -> code postal -> ville -> région*/}
                <strong>Lieux :</strong>
                <br />
                {movie.adresse_postale ? `${movie.adresse_postale},` : ""}{" "}
                {movie.code_postal_de_la_commune_principale_de_deroulement}{" "}
                {movie.commune_principale_de_deroulement},{" "}
                {movie.region_principale_de_deroulement}
                <br />
                <br />
                {/* Période annuelle */}
                <strong>
                  Période annuelle principale de déroulement du festival :
                </strong>
                <br />
                {movie.periode_principale_de_deroulement_du_festival}
                <br />
                <br />
                {/* Site web */}
                <strong>Site internet du festival :</strong>
                <br />
                {movie.site_internet_du_festival ? (
                  <Link
                    to={`\\${movie.site_internet_du_festival}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {movie.site_internet_du_festival}
                  </Link>
                ) : (
                  "Non renseigné"
                )}
                <br />
                <br />
                {/* Discipline */}
                <strong>Discipline dominante :</strong>
                <br />
                {movie.discipline_dominante}
                <br />
                <br />
                {/* Fin du conteneur de la description de la popup */}
              </div>
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
};

export default SuggestionsMap;
