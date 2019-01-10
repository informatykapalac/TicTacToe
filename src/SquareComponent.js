import React, { Component } from 'react';
import { Rect } from 'react-konva';
import Circle from './CircleComponent';
import Cross from './CrossComponent';

class Square extends Component {
  constructor() {
    super();
	  this.state = {
		  x: 200
	  };

	  this.makeMove = this.makeMove.bind(this);
  }

  makeMove(e){
	  e.preventDefault();
	  const cP = this.props.currentPlayer;
	  if(cP === 0) {

	  } else if(cP === 1) {

	  }
  }

  render() {
    return(
      <Circle x={this.state.x}/>
    );
  }
}

export default Square;
