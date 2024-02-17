import styles from "./LeaderboardPage.module.css";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button.jsx";
import getLeaderboard from "../../components/API/getLeaderBoard.js";
import { useEffect, useState } from "react";
import formatTime from "./../../components/helpers/FomatTime.js";
import puzzleUrl from "./images/Puzzle.svg";
import ballUrl from "./images/Ball.svg";

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
          <p>Достижения</p>
          <p>Время</p>
        </li>
        {items.map(item => (
          <li className={styles.boardlines} key={item.id}>
            <p># {items.indexOf(item) + 1}</p>
            <p>{item.name}</p>
            <div className={styles.achievements}>
              {item.achievements
                ? item.achievements.map(item => {
                    if (item === 1) {
                      return (
                        <div className={styles.achievement_block}>
                          <img src={puzzleUrl} alt="puzzle" className={styles.achivment_svg} />
                          <span className={styles.achievement_description}>
                            Игра пройдена <br /> в сложном режиме
                          </span>
                        </div>
                      );
                    }
                    if (item === 2) {
                      return (
                        <div className={styles.achievement_block}>
                          <img src={ballUrl} alt="ball" className={styles.achivment_svg} />
                          <span className={styles.achievement_description}>
                            Игра пройдена <br />
                            без супер-сил
                          </span>
                        </div>
                      );
                    }
                  })
                : ""}
            </div>
            <p>{formatTime(item.time)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
