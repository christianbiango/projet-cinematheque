/**
 * Ce middleware vérifie que l'utilisateur est connecté pour toute requête sur la route user de l'API
 * Ne retourne aucune donnée : utilisateur connecté
 * Status 401 : Accès renié (non authentifié)
 */
export default function checkSessionMiddleware(req, res, next) {
  // Vérifier qu'une session authentifiée existe
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      isLoggedIn: false,
      message: "Veuillez-vous connecter pour accéder à la Cinémathèque",
    });
  }

  // Vérifier que la date d'expiration n'est pas passée
  const now = new Date();
  const expiresDate = new Date(req.session.cookie._expires);
  if (now > expiresDate) {
    return res.status(401).json({
      isLoggedIn: false,
      message:
        "Votre session a expiré. Veuillez vous reconnecter pour accéder à la Cinémathèque",
    });
  }

  next(); // Passer à la fonction suivante
}
