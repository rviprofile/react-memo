import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { store } from "../../store/store";
import eyeUrl from "./images/Eye.svg";
import cardsUrl from "./images/Cards.svg";
import lifesUrl from "./images/Lifes.svg";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate, secondsOnPause) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000) - secondsOnPause;
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  // Выбран ли упрощенный режим. true или false.
  const easyModeStatus = store.getState().easyMode.status;
  // Состояние с остатком попыток
  const [lifesCounter, setLifesCounter] = useState(3);
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);
  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);
  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });
  // Запас суперспособностей
  const [awakening, setAwakening] = useState(1);
  const [alohomora, setAlohomora] = useState(1);
  // Функция возвращает массив с достижениями для POST запроса в Лидерборд
  const formatAchievements = () => {
    const arr = [];
    if (easyModeStatus === false) {
      arr.push(1);
    }
    if (awakening === 1 && alohomora === 1) {
      arr.push(2);
    }
    return arr;
  };

  // Попал ли игрок в лидерборд
  const [isLeader, setIsLeader] = useState(false);

  // “Алохомора”. Открывается случайная пара карт.
  function powerAlohomora() {
    // Если способоность еще не использована
    if (alohomora > 0) {
      // Ищем все закрытые карты на поле
      const closedCards = cards.filter(card => card.open === false);
      // Находим случайную карту из закрытых
      const randomCard = closedCards[Math.floor(Math.random() * closedCards.length)];
      // Находим пару для случайной карты
      const twoRandomCards = closedCards.filter(card => card.suit === randomCard.suit && card.rank === randomCard.rank);
      // Меняем open у случайной пары карт
      const newCards = cards.map(card => {
        if (card.id === twoRandomCards[0].id) {
          return { ...card, open: true };
        }
        if (card.id === twoRandomCards[1].id) {
          return { ...card, open: true };
        }
        return card;
      });
      setCards(newCards);
      // Уменьшаем счетчик, способности больше нет
      setAlohomora(alohomora - 1);
    }
  }
  // Cостояние паузы для таймера
  const [isPaused, setIsPaused] = useState(false);

  // “Прозрение”. На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.
  function powerAwakening() {
    if (awakening > 0) {
      // Меняем состояние паузы для таймера
      setIsPaused(true);
      // Исходный массив карт
      const Originalcards = cards;
      // Меняем массив, все карты теперь открыты
      const allCardsOpen = cards.map(card => (card.open === false ? { ...card, open: true } : card));
      setCards(allCardsOpen);
      // Ждем 5 секунд и возвращаем исходный массив
      setTimeout(() => {
        setCards(Originalcards);
        setIsPaused(false);
      }, 5000);
      // Уменьшаем счетчик, способности больше нет
      setAwakening(awakening - 1);
    }
  }

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    setLifesCounter(3);
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setLifesCounter(3);
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setAlohomora(1);
    setAwakening(1);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходить в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      if (window.location.pathname === "/react-memo/game/9") {
        setIsLeader(!isLeader);
      }
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      // Если включен упрощенный режим
      if (easyModeStatus) {
        // Если счетчик стал равен нулю - игра окончена
        if (lifesCounter === 1) {
          finishGame(STATUS_LOST);
          return;
        } else {
          // Уменьшаем счетчик попыток
          setLifesCounter(lifesCounter - 1);
          setCards(
            nextCards.map(item =>
              openCardsWithoutPair.includes(item)
                ? { id: item.id, suit: item.suit, rank: item.rank, open: false }
                : item,
            ),
          );
          setStatus(STATUS_IN_PROGRESS);
          return;
        }
      }
      finishGame(STATUS_LOST);
      return;
    }
    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    // Если таймер на паузе, ничего не делаем
    if (isPaused) {
      return;
    } else {
      // Если было использовано "Прозрение"
      if (awakening === 0) {
        const intervalId = setInterval(() => {
          setTimer(getTimerValue(gameStartDate, gameEndDate, 5));
        }, 300);
        return () => {
          clearInterval(intervalId);
        };
      } else {
        const intervalId = setInterval(() => {
          setTimer(getTimerValue(gameStartDate, gameEndDate, 0));
        }, 300);
        return () => {
          clearInterval(intervalId);
        };
      }
    }
  }, [gameStartDate, gameEndDate, isPaused]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>
      <div className={styles.bottom_line}>
        {easyModeStatus ? (
          <div className={styles.lifes}>
            <img src={lifesUrl} alt="lifes" />
            <p className={styles.lifes_counter}>{lifesCounter}</p>
            <span className={styles.lifes_description}>Запас попыток</span>
          </div>
        ) : (
          ""
        )}

        <div className={styles.powers_block}>
          {awakening > 0 ? (
            <div
              className={styles.power}
              onClick={() => {
                if (status !== STATUS_PREVIEW) {
                  powerAwakening();
                }
              }}
            >
              <img className={styles.power_img} src={eyeUrl} alt="eye" />
              <span className={styles.power_description}>
                <b>Прозрение</b>
                <br></br>На 5 секунд показываются все карты
              </span>
            </div>
          ) : (
            ""
          )}
          {alohomora > 0 ? (
            <div
              className={styles.power}
              onClick={() => {
                if (status !== STATUS_PREVIEW) {
                  powerAlohomora();
                }
              }}
            >
              <img className={styles.power_img} src={cardsUrl} alt="cards" />
              <span className={styles.power_description}>
                <b>Алохомора</b>
                <br></br>Открывается случайная пара карт
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            isLeader={isLeader}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            achievements={formatAchievements()}
          />
        </div>
      ) : null}
    </div>
  );
}
