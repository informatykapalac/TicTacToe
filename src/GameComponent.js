import React, { Component } from 'react';
import Konva from 'konva';

class Game extends Component {
  constructor() {
    this.state = {
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

        </Layer>
      </Stage>
    );
  }
}

export default Game;
