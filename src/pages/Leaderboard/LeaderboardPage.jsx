import styles from "./LeaderboardPage.module.css";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button.jsx";
import getLeaderboard from "../../components/API/getLeaderBoard.js";
import { useEffect, useState } from "react";
import formatTime from "./../../components/helpers/FomatTime.js";

export function LeaderboardPage() {
  // Массив обьектов для рендера
  const [items, setItems] = useState([]);
  // Получаем массив из API при рендере компонента, сортируем по времени игры, кидаем в items
  useEffect(() => {
    getLeaderboard().then(data => {
      setItems(data.sort((a, b) => a.time - b.time));
    });
  }, []);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3 className={styles.title}>Лидерборд</h3>
        <Link to={"/"}>
          <Button>Начать игру</Button>
        </Link>
      </header>
      <ul className={styles.list}>
        <li className={styles.firstline} key="0">
          <p>Позиция</p>
          <p>Пользователь</p>
          <p>Время</p>
        </li>
        {items.map(item => (
          <li className={styles.boardlines} key={item.id}>
            <p># {items.indexOf(item) + 1}</p>
            <p>{item.name}</p>
            <p>{formatTime(item.time)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
