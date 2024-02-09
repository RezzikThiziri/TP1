import React, { useEffect, useState } from "react";

import styles from "./Profile.module.scss";

export function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
}

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = `${getCookie("token")}`; // Remplacez par votre token
        console.log(`Token : ${getCookie("token")}`);

        const response = await fetch("http://localhost:4000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Inclure les cookies
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.error("Erreur Fetch :", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Mon Profile</h2>
      <p className={styles.userInfo}>Nom: {userData.nom}</p>
      <p className={styles.userInfo}>Prénom: {userData.prenom}</p>
      <p className={styles.userInfo}>Email: {userData.email}</p>
    </div>
  );
};

export default Profile;
