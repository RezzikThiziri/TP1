// Home.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenue sur notre site</h1>
      <div className={styles.buttonContainer}>
        <Link to="/login" className={styles.button}>
          Connexion
        </Link>
        <Link to="/signup" className={styles.button}>
          Inscription
        </Link>
      </div>
    </div>
  );
};

export default Home;
