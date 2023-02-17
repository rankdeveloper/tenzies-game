import React from 'react';
import { nanoid } from 'nanoid';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import Die from './Die';
import './style.css';

function generateNewDie() {
  return {
    value: Math.ceil(Math.random() * 6),
    isHeld: false,
    id: nanoid(),
  };
}
function allNewDice() {
  let newArray = [];

  for (let i = 0; i < 10; i++) {
    newArray.push(generateNewDie());
  }

  console.log(newArray);

  return newArray;
}
console.log(allNewDice());

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const { width, height } = useWindowSize();
  React.useEffect(() => {
    console.log('dice state changed');
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const sameValue = dice.every((die) => die.value == firstValue);

    if (allHeld && sameValue) {
      setTenzies(true);
      console.log('You win');
    }
  }, [dice]);

  const dices = dice.map((die, i) => {
    return (
      <Die
        value={die.value}
        key={die.id}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
    }
  }
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  return (
    <main>
      {tenzies && <Confetti width={width} height={height} />}
      <div className="description">
        <h1 className="title">Tenzies</h1>
        <p className="instruct">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </div>
      <div className="container">{dices}</div>

      <button className="rollDice" onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  );
}
