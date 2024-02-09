const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.inscription = async (req, res, next) => {
  try {
    // Vérifiez d'abord si l'e-mail existe déjà
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // L'e-mail existe déjà, renvoyez une erreur
      return res.status(400).json({ error: "L'e-mail existe déjà." });
    }

    // L'e-mail n'existe pas, continuez avec la création de l'utilisateur
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hash,
      nom: req.body.nom,
      prenom: req.body.prenom,
    });

    await user.save();

    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (err) {
    if (err.name === "ValidationError" && err.errors && err.errors.email) {
      // Erreur de validation, probablement due à l'absence d'un e-mail
      return res.status(400).json({ error: "L'e-mail est obligatoire." });
    }

    // Gestion d'autres erreurs
    console.error("Erreur lors de la création de l'utilisateur :", err.message);
    res.status(500).json({
      error: "Erreur interne du serveur lors de la création de l'utilisateur.",
    });
  }
};

exports.connexion = (req, res, next) => {
  console.log("je suis la ");
  const { email, password } = req.body.user;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }

      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }

          // Créez un token
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            "844f4b3bf504d6511e1c147ce9e5895233783bceb34dad9081ba3e0f92a376b8",
            { expiresIn: "1h" }
          );

          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
          });

          res.status(200).json({
            token: token,
            message: "Authentification réussie",
          });
        })
        .catch((compareError) => {
          console.error(
            "Erreur lors de la comparaison des mots de passe :",
            compareError
          );
          res.status(500).json({
            error:
              "Erreur interne du serveur lors de la comparaison des mots de passe",
            details: compareError.message,
          });
        });
    })
    .catch((findError) => {
      console.error(
        "Erreur lors de la recherche de l'utilisateur :",
        findError
      );
      res.status(500).json({
        error:
          "Erreur interne du serveur lors de la recherche de l'utilisateur",
        details: findError.message,
      });
    });
};

exports.getProfile = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  jwt.verify(
    token,
    "844f4b3bf504d6511e1c147ce9e5895233783bceb34dad9081ba3e0f92a376b8",
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token non valide" });
      }

      try {
        // Utilisez la méthode getUserById pour récupérer l'utilisateur
        const user = await exports.getUserById(decoded.userId);

        // Retournez les informations du profil de l'utilisateur
        res.status(200).json({
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );
        res.status(500).json({
          error:
            "Erreur interne du serveur lors de la récupération de l'utilisateur",
          details: error.message,
        });
      }
    }
  );
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password").exec();
    return user;
  } catch (error) {
    throw error;
  }
};
