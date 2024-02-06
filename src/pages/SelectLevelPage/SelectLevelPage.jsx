import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useEffect, useState } from "react";

export function SelectLevelPage() {
  const [checkboxValue, setCheckboxValue] = useState(false);
  useEffect(() => {
    console.log(checkboxValue);
  });
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div className={styles.checkbox}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              onClick={() => {
                setCheckboxValue(!checkboxValue);
              }}
            />
            <span className={styles.slider}></span>
          </label>
          <p>До трёх ошибок</p>
        </div>
      </div>
    </div>
  );
}
