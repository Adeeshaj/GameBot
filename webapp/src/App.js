import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div class="menu-box">tic-tac-toi</div>
        <div class="menu-box"> chess</div>
        <div class="menu-box"> developer</div>
      </div>
      <div className="App-body">
        <Counter />
      </div>
    </div>
  );
}

export default App;
