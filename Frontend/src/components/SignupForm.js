// SignupForm.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./SignupForm.module.scss";
import { yupResolver } from "@hookform/resolvers/yup"; // Notez le chemin spécifique ici
import * as yup from "yup";

const SignupForm = () => {
  const validationSchema = yup.object({
    nom: yup
      .string()
      .required("Le nom est obligatoire")
      .min(6, "Le nom doit avoir au moins 6 caractères"),
    prenom: yup
      .string()
      .required("Le prenom est obligatoire")
      .min(6, "Le prenom doit avoir au moins 6 caractères"),
    email: yup
      .string()
      .required("L'e-mail est obligatoire")
      .email("L'e-mail n'est pas valide"),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire")
      .min(8, "Le mot de passe doit avoir au moins 6 caractères"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setprenom] = useState("");

  const handleSignup = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/users/inscription",
        {
          nom,
          prenom,
          email,
          password,
        }
      );
      console.log(response.data);
      // Gérer la réponse du serveur ici
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>

      <form className={styles.form} onSubmit={handleSubmit(handleSignup)}>
        <div className={styles.formGroup}>
          <label>nom:</label>
          <input
            type="text"
            {...register("nom")}
            onChange={(e) => setNom(e.target.value)}
          />
          {errors.email && (
            <p className={styles.formError}>{errors.nom.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>prenom:</label>
          <input
            type="text"
            {...register("prenom")}
            onChange={(e) => setprenom(e.target.value)}
          />
          {errors.email && (
            <p className={styles.formError}>{errors.nom.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="text"
            {...register("email")}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className={styles.formError}>{errors.email.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Mot de passe:</label>
          <input
            type="password"
            {...register("password")}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className={styles.formError}>{errors.password.message}</p>
          )}
        </div>
        <button onClick={handleSignup}>S'inscrire</button>
      </form>
    </div>
  );
};

export default SignupForm;
