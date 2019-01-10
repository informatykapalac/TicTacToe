import React, { Component } from 'react';
import { connect } from 'react-redux';
import Konva from 'konva';
import Square from './SquareComponent';
import { Layer, Stage, Line, Rect, Image } from 'react-konva';
import { setScreenSize, setCurrentPlayer } from './Redux/reduxActions';


const mapStateToProps = state => {
  return {
    size: state.size,
    cP: state.currentPlayer
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
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    };

    this.handleResize = this.handleResize.bind(this);
    this.makeMove = this.makeMove.bind(this);
    this.draw = this.draw.bind(this);
    this.getP = this.getP.bind(this);
  }

  makeMove(e) {
	  e.preventDefault();
    console.log(e);
	  const cP = this.state.currentPlayer;
	  if(cP === 0) {

	  } else if(cP === 1) {

	  }
  }

  getP(e) {
    console.log("HI");
  }

  draw() {
    let lines = [];
    let diff;
    let minX, maxX, minY, maxY;
    let width = this.state.width;
    let height = this.state.height;
    let rows = this.props.size.rows;
    let cols = this.props.size.cols;
    const heightLine = (height/2) / rows;
    const widthLine = (width/2) / cols;

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

    this.setState({
      lines: lines,
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

    return(
      <Stage width={this.state.width} height={this.state.height} x={this.state.width/4} y={this.state.height/4}>
		    <Layer>
          {lines}
          <Rect />
        </Layer>
      </Stage>
    );
  }
}

const Game = connect(mapStateToProps, mapDispatchToProps)(_Game);

export default Game;
