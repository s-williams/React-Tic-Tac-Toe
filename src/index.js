import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';

ReactDOM.render(
  <React.StrictMode>
    <header id="header">
        <h1 className="title">Tic Tac Toe</h1>
    </header>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);
