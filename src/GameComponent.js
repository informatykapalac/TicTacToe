import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layer, Stage, Line, Rect, Circle, Text } from 'react-konva';
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
      finished: false,
      stalemate: false,
		  width: window.innerWidth,
		  height: window.innerHeight,
      lines: [], // linie
      squares: [], // czujniki kliknięcia
      fields: [], // pola
      filled: [], // info o wypełnionych polach
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    };

    this.handleResize = this.handleResize.bind(this);
    this.makeMove = this.makeMove.bind(this);
    this.draw = this.draw.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset(e) {
    this.setState({
      currentPlayer: 0,
      finished: false,
      stalemate: false,
      fields: [],
      filled: []
    });
  }

  makeMove(e) {

    if(this.state.finished) {
      return;
    }

	  let cP = this.state.currentPlayer;
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

    let fields = this.state.fields; // pobieramy obecne grafiki
    let filled = this.state.filled; // pobieramy wypełnione pola

    for(let i = 0; i < fields.length; i++) { // Czy pole jest puste ?
      if(fields[i].field === fieldNumber) {
        return;
      }
    }

    fields.push({
      shape: cP,
      x: x,
      y: y,
      width: gameWidth,
      height: gameHeight,
      fieldX: x,
      fieldY: y,
      field: fieldNumber
    });

    filled[fieldNumber] = cP;

    // Sprawdź, czy ktoś wygrał

    for(let x = 0; x < rows; x++) {
      const match = filled[x * rows];
      for(let y = 0; y < cols; y++) { // sprawdzanie poziome
        if(filled[(x * rows) + y] !== match || filled[(x * rows) + y] === undefined) {
          break;
        } else if(y === cols-1) {
          this.setState({
            finished: true
          });
        }
      }
    }

    for(let x = 0; x < cols; x++) {
      const match = filled[x];
      for(let y = 0; y < rows; y++) { // sprawdzanie pionowe
        if(filled[x + (y * cols)] !== match || filled[x + (y * cols)] === undefined) {
          break;
        } else if(y === rows-1) {
          this.setState({
            finished: true
          });
        }
      }
    }

    // Jeśli plansza jest kwadratem, sprawdź na skos

    if(rows === cols) {
      const matchLR = filled[0]; // dla skosu lewo -> prawo
      const matchRL = filled[cols-1]; // dla skosu prawo -> lewo
      for(let i = 1; i < cols; i++) { // skos lewo -> prawo
        if(filled[i * (cols+1)] !== matchLR || filled[i * (cols+1)] === undefined) {
          break;
        } else if(i === cols-1) {
          console.log("LR")
          this.setState({
            finished: true
          });
        }
      }
      for(let j = 1; j <= cols; j++) { // skos prawo -> lewo
        if(filled[j * (cols-1)] !== matchRL || filled[j * (cols-1)] === undefined) {
          break;
        } else if(j === cols) {
          this.setState({
            finished: true
          });
        }
      }
    }

    for(let n = 0; n < rows*cols; n++) {
      if(filled[n] === undefined) {
        break;
      } else if(n === (rows * cols) - 1) {
        this.setState({
          stalemate: true,
          finished: true
        });
      }
    }

    if(!this.state.finished) {
      if(cP < (this.props.players-1)) {
        cP += 1;
      } else {
        cP = 0;
      }
    }

    this.setState({
      currentPlayer: cP,
      fields: fields,
      filled: filled
    });

    this.draw();

  }

  draw() {
    let lines = []; // linie
    let squares = []; // pola
    let fields = []; // figury na polach
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

    this.state.fields.map((field) => {
      let radius;
      if(deltaX < deltaY) {
        radius = deltaX/cols; // DO SPRAWDZENIA
      } else {
        radius = deltaY/rows; // DO SPRAWDZENIA
      }
      fields.push({
        shape: field.shape,
        fieldX: field.fieldX,
        fieldY: field.fieldY,
        field: field.field,
        x: (width/4) + ((field.fieldX-1) * deltaX),
        y: (height/4) + ((field.fieldY-1) * deltaY),
        radius: radius
      });
    });

    this.setState({
      lines: lines,
      squares: squares,
      fields: fields,
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

    let text, player;

    if(this.state.stalemate) {
      text =
        <Text
          text="Draw"
          fontSize={32}
          x={-100}
          y={-this.state.height/8}
        />
    } else if(this.state.finished) {
      text =
        <Text
          text="Winner"
          fontSize={32}
          x={-100}
          y={-this.state.height/8}
        />
    } else {
      text =
        <Text
          text="Player:"
          fontSize={32}
          x={-100}
          y={-this.state.height/8}
        />
    }

    if(this.state.currentPlayer === 0 && !this.state.stalemate) {
      player =
        <Circle
          x={30}
          y={-this.state.height/8 + 18}
          radius={16}
          stroke="black"
        />
    } else if(this.state.currentPlayer === 1 && !this.state.stalemate) {
      player =
      <React.Fragment>
        <Line
          x={30}
          y={-this.state.height/8 + 18}
          points={[-16, -16, 16, 16]}
          stroke="black"
        />
        <Line
          x={30}
          y={-this.state.height/8 + 18}
          points={[-16, 16, 16, -16]}
          stroke="black"
        />
      </React.Fragment>
    }

    const reset =
      <React.Fragment>
        <Text
          text="Reset"
          fill="red"
          fontSize={30}
          x={-100}
          y={0}
          onClick={this.reset}
        />
      </React.Fragment>

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

    const squares = this.state.squares.map((square) => {
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

    const fields = this.state.fields.map((field) => {
      if(field.shape === 0) {
        return(
          <Circle
            x={field.x}
            y={field.y}
            radius={field.radius}
            stroke="black"
          />
        );
      } else if(field.shape === 1) {
        return(
          <React.Fragment>
          <Line
            x={field.x}
            y={field.y}
            points={[-field.radius, -field.radius, field.radius, field.radius]}
            stroke="black"
          />
          <Line
            x={field.x}
            y={field.y}
            points={[-field.radius, field.radius, field.radius, -field.radius]}
            stroke="black"
          />
          </React.Fragment>
        );
      }
    });

    return(
      <Stage width={this.state.width} height={this.state.height} x={this.state.width/4} y={this.state.height/4}>
		    <Layer>
          {text}
          {player}
          {lines}
          {reset}
          {squares}
          {fields}
        </Layer>
      </Stage>
    );
  }
}

const Game = connect(mapStateToProps, mapDispatchToProps)(_Game);

export default Game;
