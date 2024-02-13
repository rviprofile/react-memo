import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useState } from "react";
import { store } from "../../store/store";
import { easyModeOffCreator, easyModeOnCreator } from "../../store/actions/creators/creators";

export function SelectLevelPage() {
  const [checkboxValue, setCheckboxValue] = useState(true);
  const toggleEasyMode = () => {
    setCheckboxValue(!checkboxValue);
    checkboxValue ? store.dispatch(easyModeOnCreator()) : store.dispatch(easyModeOffCreator());
  };
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
                toggleEasyMode();
              }}
            />
            <span className={styles.slider}></span>
          </label>
          <p>Легкий режим (3 жизни)</p>
        </div>
        <Link to="/leaderboard">
          <p className={styles.link}>Перейти к лидерборду</p>
        </Link>
      </div>
    </div>
  );
}
