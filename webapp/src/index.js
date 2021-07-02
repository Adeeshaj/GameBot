import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var moveTree = {
  root: {
    value: 0,
    state: "",
    decendents: []
  }
}

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
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
        };
    }

    botplay(botTurn, newHistory){
        const history = newHistory.slice();
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let rand = nextMove(squares) // create logic
        if (calculateWinner(squares)){
            this.setState({
                history: newHistory,
                stepNumber: newHistory.length-1,
                xIsNext: !botTurn,
            });
        } else if(squares[rand]){
            this.botplay(botTurn, newHistory);
        } else {
            squares[rand] = 'O';

            this.setState({
                history: newHistory.concat([{
                    squares: squares,
                }]),
                stepNumber: newHistory.length,
                xIsNext: botTurn,
            });
        }
            
    }

    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let botTurn = this.state.xIsNext
        let newHistory = history.concat([{squares: squares}]).slice()
        
        if(botTurn){
            this.botplay(botTurn, newHistory)
            
        }
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
        });

        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        if (winner) {
          updateTree(history, winner)
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
        }
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  
function calculateWinner(squares) {
    if(!squares.includes(null)){
      return "DRAW"
    }
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

function nextMove(currentSquares){
  let decendents = []
  if(isEmpty(currentSquares)){
    decendents = moveTree["root"].decendents
  } else {
    let key = getkey(currentSquares)
    decendents = moveTree[key] ? moveTree[key].decendents : []
  }
  let value = Number.MIN_VALUE
  let candidateDecendent = null
  decendents.forEach(decendent => {
    if (decendent.value> value){
      value = decendent.value
      candidateDecendent = decendent
    }
  });

  let candidateSquares = candidateDecendent ? candidateDecendent.state.split("") : null
  let move = getMove(candidateSquares, currentSquares)
  if(!move)
    move = Math.floor(Math.random()*9);
  return move
}

function isEmpty(array){
  let empty = true
  array.forEach(element => {
    if(element){
      empty=false
      return empty
    }
  });
  return empty;
}

function getMove(future, current) {
  if(future && current){
    for(let i=0; i< future.length; i++){
      if(future[i]!==current[i])
        return i;
    }
  }
  
  return null;
}

function getkey(squares){
  let string = ""
  squares.forEach(element => {
    if(element){
      string += element
    } else {
      string += "-"
    }
  });
  if(string === "---------"){
    string = "root"
  }
  return string;
}

function updateTree(history, winner){
  let point;
  if(winner === "O"){
    point = 1
  } else if (winner === "X") {
    point = -1
  } else {
    point = 0
  }
  console.log(point)
  for(let i=0; i< history.length; i++){
    let key = getkey(history[i].squares)
    if(moveTree[key]){
      moveTree[key].value += point
    } else {
      moveTree[key] = {
        value: point,
        state: key,
        decendents: []
      }
    }
    if(i<history.length-1){
      moveTree[key].decendents.push(getkey(history[i+1].squares))
    }
  }
  console.log(moveTree)
}

