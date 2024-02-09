const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  let token = req.header("Authorization");

  // Si le token n'est pas dans l'en-tête, essayez de le récupérer du cookie
  if (!token) {
    token = req.cookies.token;
  }

  // Supprimez le préfixe "Bearer " s'il est présent
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  jwt.verify(
    token,
    "844f4b3bf504d6511e1c147ce9e5895233783bceb34dad9081ba3e0f92a376b8",
    (err, decoded) => {
      if (err) {
        console.error("Erreur lors de la vérification du token:", err);
        return res.status(401).json({ message: "Token non valide" });
      }

      // Ajouter l'utilisateur au req pour qu'il soit accessible dans les routes suivantes
      req.user = decoded;

      next();
    }
  );
};

exports.authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  jwt.verify(
    token,
    "844f4b3bf504d6511e1c147ce9e5895233783bceb34dad9081ba3e0f92a376b8",
    (err, decoded) => {
      if (err) {
        console.error("Erreur lors de la vérification du token :", err);
        return res.status(401).json({ message: "Token non valide" });
      }

      // Ajoutez l'utilisateur au req pour qu'il soit accessible dans les routes suivantes
      req.user = decoded;

      next();
    }
  );
};
