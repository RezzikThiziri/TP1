// LoginForm.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./LoginForm.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie";

const LoginForm = () => {
  const validationSchema = yup.object({
    email: yup
      .string()
      .required("L'e-mail est obligatoire")
      .email("L'e-mail n'est pas valide"),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire")
      .min(8, "Le mot de passe doit avoir au moins 8 caractères"),
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

  const onSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/users/connexion",
        {
          user: { email, password },
        }
      );

      // Vérifiez si la connexion est réussie
      if (response.data.token) {
        // Stockez le token dans un cookie
        Cookies.set("token", response.data.token, { expires: 7 }); // Expire après 7 jours

        console.log("Token stocké avec succès!");

        // Vous pouvez également rediriger l'utilisateur vers une autre page après la connexion réussie
        // history.push("/dashboard");
      } else {
        console.log("La connexion a échoué");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
        <button onClick={onSubmit} type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
