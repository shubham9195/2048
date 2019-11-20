import React, { Component } from 'react';
import './App.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      points: 0,
      gameOver: false,
      message: null
    }
  }
  //Creating the board//
  mainBoard() {
    let board = [];
    let cr = 4 // this is for size of the board
    for (let i = 0; i < cr; i++) {
      const row = [];
      for (let j = 0; j < cr; j++) {
        row.push(0);
      }
      board.push(row);
    }
    board = this.placeRandom(this.placeRandom(board));
    this.setState({ board, points: 0, gameOver: false, message: null });
  }
  // get all the empty coodinates from board
  getEmptyCoordinates(board) {
    const blankCoordinates = [];

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 0) {
          blankCoordinates.push([r, c])
        }
      }
    }

    return blankCoordinates;
  }

  //Get Random Number 

  randomStartingNumber() {
    const startingNumbers = [2, 4];
    const randomNumber = startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
    return randomNumber;
  }

  // Place random starting number on an empty coordinates
  placeRandom(board) {
    const blankCoordinates = this.getEmptyCoordinates(board);
    const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
    const randomNumber = this.randomStartingNumber();
    board[randomCoordinate[0]][randomCoordinate[1]] = randomNumber;
    console.log('check randomplace number board', board);
    return board;
  }


  boardMoved(original, updated) {
    return (JSON.stringify(updated) !== JSON.stringify(original)) ? true : false;
  }

  move(direction) {
    const existingBoard = this.state.board;
    let winNumber= 2048// variable number for winning game
    if (!this.state.gameOver && !(this.check2048(existingBoard,winNumber ))) {
      if (direction === 'up') {
        const movedUp = this.moveUp(existingBoard);
        if (this.boardMoved(existingBoard, movedUp.board)) {
          const upWithRandom = this.placeRandom(movedUp.board);
          if (this.checkForGameOver(upWithRandom)) {
            this.setState({ board: upWithRandom, gameOver: true, message: 'Game over!' });
          } else {
            this.setState({ board: upWithRandom, points: this.state.points += movedUp.points });
          }
        }
      } else if (direction === 'right') {
        const movedRight = this.moveRight(existingBoard);
        if (this.boardMoved(existingBoard, movedRight.board)) {
          const rightWithRandom = this.placeRandom(movedRight.board);

          if (this.checkForGameOver(rightWithRandom)) {
            this.setState({ board: rightWithRandom, gameOver: true, message: 'Game over!' });
          } else {
            this.setState({ board: rightWithRandom, points: this.state.points += movedRight.points });
          }
        }
      } else if (direction === 'down') {
        const movedDown = this.moveDown(existingBoard);
        if (this.boardMoved(this.state.board, movedDown.board)) {
          const downWithRandom = this.placeRandom(movedDown.board);

          if (this.checkForGameOver(downWithRandom)) {
            this.setState({ board: downWithRandom, gameOver: true, message: 'Game over!' });
          } else {
            this.setState({ board: downWithRandom, points: this.state.points += movedDown.points });
          }
        }
      } else if (direction === 'left') {
        const movedLeft = this.moveLeft(this.state.board);
        if (this.boardMoved(existingBoard, movedLeft.board)) {
          const leftWithRandom = this.placeRandom(movedLeft.board);

          if (this.checkForGameOver(leftWithRandom)) {
            this.setState({
              board: leftWithRandom,
              gameOver: true,
              message: 'Game over!'
            });
          } else {
            this.setState({ board: leftWithRandom, points: this.state.points += movedLeft.points });
          }
        }
      }
    } else if (this.check2048(existingBoard, 2048)) {
      this.setState({ message: "You Win", gameOver: true })
    } else {
      this.setState({ message: 'Game over. Please start a new game.' });
    }
  }

  moveUp(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = [];
    let points = 0;

    // Shift all numbers to the right
    for (let r = 0; r < rotatedRight.length; r++) {
      let row = [];
      for (let c = 0; c < rotatedRight[r].length; c++) {
        let current = rotatedRight[r][c];
        (current === 0) ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }

    //add the number and shift to the right
    for (let r = 0; r < board.length; r++) {
      for (let c = board[r].length - 1; c >= 0; c--) {
        if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c - 1] = 0;
          points += board[r][c];
        } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
        }
      }
    }
    // Rotate the board back upRight
    board = this.rotateLeft(board);

    return { board, points };
  }

  moveRight(inputBoard) {
    let board = [];
    let points = 0;

    //shift all numbers to the right
    for (let r = 0; r < inputBoard.length; r++) {
      let row = [];
      for (let c = 0; c < inputBoard[r].length; c++) {
        let current = inputBoard[r][c];
        (current === 0) ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }
    //add number and shift to right
    for (let r = 0; r < board.length; r++) {
      for (let c = board[r].length - 1; c >= 0; c--) {
        if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c - 1] = 0;
          points += board[r][c];
        } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
        }
      }
    }

    return { board, points };
  }

  moveDown(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = [];
    let points = 0;

    //shift all number to the left
    for (let r = 0; r < rotatedRight.length; r++) {
      let row = [];
      for (let c = rotatedRight[r].length - 1; c >= 0; c--) {
        let current = rotatedRight[r][c];
        (current === 0) ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }
    //add numbers and shift to left
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board.length; c++) {
        if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c + 1] = 0;
          points += board[r][c];
        } else if (board[r][c] === 0 && board[r][c + 1] > 0) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
        }
      }
    }
    // Rotate board back upRight
    board = this.rotateLeft(board);

    return { board, points };
  }

  moveLeft(inputBoard) {
    let board = [];
    let points = 0;
    //shift all numbers to the left
    for (let r = 0; r < inputBoard.length; r++) {
      let row = [];
      for (let c = inputBoard[r].length - 1; c >= 0; c--) {
        let current = inputBoard[r][c];
        (current === 0) ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }
    // add  number and shift to left
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board.length; c++) {
        if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c + 1] = 0;
          points += board[r][c];
        } else if (board[r][c] === 0 && board[r][c + 1] > 0) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
        }
      }
    }
    console.log('check board on move left', board);

    return { board, points };
  }

  rotateRight(matrix) {
    let result = [];

    for (let c = 0; c < matrix.length; c++) {
      let row = [];
      for (let r = matrix.length - 1; r >= 0; r--) {
        row.push(matrix[r][c]);
      }
      result.push(row);
    }

    return result;
  }

  rotateLeft(matrix) {
    let result = [];

    for (let c = matrix.length - 1; c >= 0; c--) {
      let row = [];
      for (let r = matrix.length - 1; r >= 0; r--) {
        row.unshift(matrix[r][c]);
      }
      result.push(row);
    }

    return result;
  }
  // check to see if there are any moves left
  checkForGameOver(board) {
    let moves = [
      this.boardMoved(board, this.moveUp(board).board),
      this.boardMoved(board, this.moveRight(board).board),
      this.boardMoved(board, this.moveDown(board).board),
      this.boardMoved(board, this.moveLeft(board).board)
    ];

    return (moves.includes(true)) ? false : true;
  }
  //function to check for 2048 value
  check2048(arr, search) {
    return arr.some(row => row.includes(search))
  }
  UNSAFE_componentWillMount() {
    this.mainBoard();
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    const up = 38;
    const right = 39;
    const down = 40;
    const left = 37
    const n = 78;

    if (e.keyCode === up) {
      this.move('up');
    } else if (e.keyCode === right) {
      this.move('right');
    } else if (e.keyCode === down) {
      this.move('down');
    } else if (e.keyCode === left) {
      this.move('left');
    } else if (e.keyCode === n) {
      this.mainBoard();
    }
  }
  render() {
    return (
      <div>
        <h1>2048</h1>
        <div className="button" onClick={() => { this.mainBoard() }}>New Game</div>
        <p>Use Arrow Keys to move and Press N for New Game</p>

        <div className="score">points: {this.state.points}</div>
        <h2 style={{textAlign:'center'}}>{this.state.message}</h2>
        <table>
          <tbody>
          {this.state.board.map((row, i) => (<Row key={i} row={row} />))}
          </tbody>
        </table>

        
      </div>
    );

  }
};
const Row = ({ row }) => {
  return (
    <tr>
      {row.map((cell, i) => (<Cell key={i} cellValue={cell} />))}
    </tr>
  );
};

const Cell = ({ cellValue }) => {
  let color = 'cell';
  let value = (cellValue === 0) ? '' : cellValue;
  if (value) {
    color += ` color-${value}`;
  }

  return (
    <td>
      <div className={color}>
        <div className="number">{value}</div>
      </div>
    </td>
  );
};

export default App;