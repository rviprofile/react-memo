import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link } from "react-router-dom";
import postLeaderboard from "../API/postLeaderboard";
import { useState } from "react";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, isLeader, achievements }) {
  const title = isWon ? "Вы победили!" : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  // Значение инпута с именем пользователя
  const [name, setName] = useState();
  // Время игры для пост запроса
  const time = gameDurationMinutes * 60 + gameDurationSeconds;

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{isLeader ? "Вы попали на Лидерборд!" : title}</h2>
      {isLeader ? (
        <input
          type="text"
          className={styles.input}
          placeholder="Пользователь"
          onChange={event => setName(event.target.value)}
        />
      ) : (
        ""
      )}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Link to="/">
        <Button onClick={() => postLeaderboard({ name, time, achievements })}>Начать сначала</Button>
      </Link>
      <Link to="/leaderboard" onClick={() => postLeaderboard({ name, time, achievements })}>
        <p className={styles.link}>Перейти к лидерборду</p>
      </Link>
    </div>
  );
}
