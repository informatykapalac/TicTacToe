import React, { Component } from 'react';
import Konva from 'konva';
import Square from './SquareComponent';
import {Layer, Stage} from './react-konva';

class Game extends Component {
  constructor() {
    this.state = {
		currentPlayer: null,
		width: window.innerWidth,
		height: window.innerHeight
    };

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
		this.setState({
		width: window.innerWidth,
		height: window.innerHeight
    });
	}

  componentDidMount() {
		window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return(
      <Stage width={this.state.width} height={this.state.height}>
		<Layer>
			<Square props = { this.state.currentPlayer }/>
        </Layer>
      </Stage>
    );
  }
}

export default Game;
