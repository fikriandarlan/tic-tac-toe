import { useState, useEffect } from 'react';

function Square({ value, onSquareClick, isWinning, isClicked }) {
  const className = `square ${isWinning ? 'winning' : ''} ${isClicked ? 'click-animation' : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  const [clickedIndex, setClickedIndex] = useState(null);

  useEffect(() => {
    const result = calculateWinner(squares);
    setWinnerInfo(result);
  }, [squares]);

  function handleClick(i) {
    if (winnerInfo.winner || squares[i]) return;

    setClickedIndex(i);
    setTimeout(() => setClickedIndex(null), 200);

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
  }

  let status;
  if (winnerInfo.winner) {
    status = `🎉 Pemenang: ${winnerInfo.winner} 🎉`;
  } else if (squares.every(square => square !== null)) {
    status = `🤝 Seri! 🤝`;
  } else {
    status = `Giliran: ${xIsNext ? 'X' : 'O'}`;
  }

  const isWinningSquare = (index) => {
    return winnerInfo.line && winnerInfo.line.includes(index);
  };

  return (
    <>
      <div className="game-container">
        <div className="status">{status}</div>
        <div className="board">
          {squares.map((value, index) => (
            <Square
              key={index}
              value={value}
              onSquareClick={() => handleClick(index)}
              isWinning={isWinningSquare(index)}
              isClicked={clickedIndex === index}
            />
          ))}
        </div>
        <button className="reset-button" onClick={resetGame}>
          Mulai Ulang
        </button>
        
        {/* Lisensi Pembuat */}
        <div className="license">
          Made with by <strong>Fikri Andarlan</strong>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}