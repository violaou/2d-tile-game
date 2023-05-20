/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Tile = (props) => {
  // const [clicked, setClicked] = useState(false);
  const { value } = props;
  return (
    <div
      className={`tile ${value.correct ? "correct" : "wrong"} ${
        value.clicked ? null : "neutral"
      }`}
      onClick={props.onClick}
    />
  );
};

function App() {
  const [boardSize, setSize] = useState(3);
  const [board, setBoard] = useState([[]]);
  const [wrongCounter, setWrongCounter] = useState(0);
  const [solutionCounter, setSolutionCounter] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [inPlay, setPlay] = useState(false);

  function newGameBoard() {
    const newBoard = [];
    for (let y = 0; y < boardSize; y++) {
      newBoard[y] = [];
      for (let x = 0; x < boardSize; x++) {
        newBoard[y][x] = {
          correct: Math.random() > 0.6,
          clicked: false,
        };
      }
    }
    const correct = newBoard.flat().filter(({ correct }) => correct).length;
    // clear all the other states
    setCorrect(correct);
    setWrongCounter(0);
    setSolutionCounter(0);
    return newBoard;
  }

  useEffect(() => {
    setBoard(newGameBoard());
  }, [boardSize]);

  function setBoardSize(e) {
    setSize(e.target.value);
  }

  function clickedTile(tile, i, j) {
    if (solutionCounter !== correct) {
      let { correct, clicked } = tile;
      if (!clicked) {
        correct
          ? setSolutionCounter(solutionCounter + 1)
          : setWrongCounter(wrongCounter + 1);
        const clickedTileChanged = [...board];
        clickedTileChanged[i][j].clicked = true;
        setBoard(clickedTileChanged);
      }
    }
  }

  function newGame(e) {
    e.preventDefault();
    setPlay(true);
    const newGame = newGameBoard();
    const solutionBoard = structuredClone(newGame);

    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        solutionBoard[y][x].clicked = true;
      }
    }
    setBoard(solutionBoard);
    setTimeout(() => {
      setBoard(newGame);
      console.log("newGame", newGame);
    }, 3000);
  }

  return (
    <div className="App">
      <h2>tile game</h2>
      <div className="slideContainer">
        <label>size: {boardSize}</label>
        <input
          type="range"
          min="2"
          max="11"
          name="boardSize"
          defaultValue={boardSize}
          onChange={setBoardSize}
        />
      </div>
      <p>You have {wrongCounter} incorrect guesses.</p>
      {solutionCounter === correct && <p>You win!</p>}
      {!inPlay && (
        <button onClick={newGame}>
          {solutionCounter === correct ? "Replay" : "Start Game"}
        </button>
      )}
      <p></p>
      {boardSize > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {board.map((row, i) => {
            return (
              <div style={{ display: "flex" }} key={uuidv4()}>
                {row.map((ele, j) => {
                  return (
                    <Tile
                      key={uuidv4()}
                      value={ele}
                      onClick={() => clickedTile(ele, i, j)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
