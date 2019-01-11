import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layer, Stage, Line, Rect, Image } from 'react-konva';
import { setScreenSize, setCurrentPlayer } from './Redux/reduxActions';


const mapStateToProps = state => {
  return {
    size: state.size,
    cP: state.currentPlayer,
    players: state.players,
    shapes: state.shapes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setScreenSize: (width, height) => dispatch(setScreenSize(width, height)),
    setCurrentPlayer: (value) => dispatch(setCurrentPlayer(value))
  };
};

class _Game extends Component {
  constructor() {
    super();
    this.state = {
		  currentPlayer: 0,
		  width: window.innerWidth,
		  height: window.innerHeight,
      lines: [],
      squares: [],
      images: [],
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    };

    this.handleResize = this.handleResize.bind(this);
    this.makeMove = this.makeMove.bind(this);
    this.draw = this.draw.bind(this);
  }

  makeMove(e) {
	  const cP = this.state.currentPlayer;
    let gameWidth = this.state.width / 4;
    let gameHeight = this.state.height / 4;
    let cols = this.props.size.cols;
    let rows = this.props.size.rows;
    let x0 = gameWidth + this.state.minX;
    let x1 = gameWidth + this.state.maxX;
    let y0 = gameHeight + this.state.minY;
    let y1 = gameHeight + this.state.maxY;
    let diffX = (x1 - x0) / cols;
    let diffY = (y1 - y0) / rows;

    const x = parseInt((e.evt.layerX - x0) / diffX); // "x" myszy
    const y = parseInt((e.evt.layerY - y0) / diffY); // "y" myszy

    const fieldNumber = (rows * y) + x; // numer pola

    let images = this.state.images // pobieramy obecne grafiki

    for(let i = 0; i < images.length; i++) { // Czy pole jest puste ?
      if(images[i].field === fieldNumber) {
        return;
      }
    }

    const img = new window.Image();
    img.src = "public/" + this.props.shapes.cP;

    images.push({ // wstawiamy grafikę -> POTRZEBNE X, Y, szerokość i wysokość
      image: img
    });

    console.log(fieldNumber);

  }

  draw() {
    let lines = []; // linie
    let squares = []; // pola
    let diff; // różnica rozmiarów ekranu
    let minX, maxX, minY, maxY; // rozmiary całego pola gry
    let width = this.state.width;
    let height = this.state.height;
    let rows = this.props.size.rows;
    let cols = this.props.size.cols;
    const heightLine = (height/2) / rows; // dla linii poziomych
    const widthLine = (width/2) / cols; // dla linii pionowych

    if(width > height) {
      diff = (width-height) / 4; // ((width/2)-(height/2)) / 2

      for(let i = 1; i < rows; i++) {
        lines.push({
          x1: diff,
          y1: i * heightLine,
          x2: (width / 2) - diff,
          y2: i * heightLine
        });
      }

      for(let j = 1; j < cols; j++) {
        lines.push({
          x1: j * heightLine + diff,
          y1: 0,
          x2: j * heightLine + diff,
          y2: height / 2
        });
      }

      minX = diff;
      maxX = (width / 2) - diff;
      minY = 0;
      maxY = height / 2;

    } else {
      diff = (height-width) / 4; // ((height/2)-(width/2)) / 2

      for(let i = 1; i < rows; i++) {
        lines.push({
          x1: 0,
          y1: i * widthLine + diff,
          x2: (width / 2),
          y2: i * widthLine + diff
        });
      }

      for(let j = 1; j < cols; j++) {
        lines.push({
          x1: j * widthLine,
          y1: diff,
          x2: j * widthLine,
          y2: (height / 2) - diff
        });
      }

      minX = 0;
      maxX = width / 2;
      minY = diff;
      maxY = (height / 2) - diff;

    }

    //console.log(minX + (width/4), minY + (height/4), maxX + (width/4), maxY + (height/4))

    let deltaX = (maxX - minX) / rows; // różnica szerokości
    let deltaY = (maxY - minY) / cols; // różnica wysokości

    // minX, ... -> DO WYRZUCENIA ZE STANU
    // deltaX, deltaY -> DO DODANIA DO STANU

    for(let x = 0; x < rows; x++) {
      for(let y = 0; y < cols; y++) {
        squares.push({
          x: x * deltaX + minX,
          y: y * deltaY + minY,
          width: deltaX,
          height: deltaY
        });
      }
    }

    this.setState({
      lines: lines,
      squares: squares,
      minX: minX,
      maxX: maxX,
      minY: minY,
      maxY: maxY
    });
  }

  handleResize() {
		this.setState({
		  width: window.innerWidth,
		  height: window.innerHeight
    });
	}

  componentDidMount() {
		window.addEventListener('resize', this.handleResize);
    window.addEventListener('resize', this.draw);
    this.draw();
  }

  componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
  }

  render() {

    const lines = this.state.lines.map((line) => {
      return(
        <Line
          x={0}
          y={0}
          points={[line.x1, line.y1, line.x2, line.y2]}
          stroke="black"
        />
      );
    });

    const squares = this.state.squares.map((square, i) => {
      return(
        <Rect
          x={square.x}
          y={square.y}
          width={square.width}
          height={square.height}
          onClick={this.makeMove}
        />
      );
    });

    return(
      <Stage width={this.state.width} height={this.state.height} x={this.state.width/4} y={this.state.height/4}>
		    <Layer>
          {lines}
          {squares}
        </Layer>
      </Stage>
    );
  }
}

const Game = connect(mapStateToProps, mapDispatchToProps)(_Game);

export default Game;
