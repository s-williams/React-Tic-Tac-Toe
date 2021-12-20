import React from 'react';
import './style.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isLocalMultiplayer: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    // vs Computer mode
    if (!this.state.isLocalMultiplayer && !calculateWinner(squares)) {
      let done = false;
      while (!done) {
        let j = Math.floor(Math.random() * 9);
        if (!squares[j]) {
          squares[j] = "O";
          done = true;
        }
      }
    }

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: this.state.isLocalMultiplayer ? !this.state.xIsNext : this.state.xIsNext
    });
  }

  restart() {
    this.jumpTo(0);
  }

  undo() {
    if (this.state.stepNumber > 0) {
      this.jumpTo(this.state.stepNumber - 1)
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: this.state.isLocalMultiplayer ? (step % 2) === 0 : this.state.xIsNext,
    });
  }

  switchMultiplayer() {
    this.setState({
      isLocalMultiplayer: !this.state.isLocalMultiplayer
    });
    this.restart();
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9) {
      status = "It's a draw"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let vsWho;
    if (this.state.isLocalMultiplayer) {
      vsWho = "vs Player";
    } else {
      vsWho = "vs Computer";
    }

    return (
      <div className="game">
        <div className="status">{status}</div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.undo()}>Undo</button>
          <button onClick={() => this.restart()}>Restart</button>
          <button onClick={() => this.switchMultiplayer()}>{vsWho}</button>
        </div>
      </div>
    );
  }
}

export default Game;