import React, { Component } from 'react';

class Square extends Component {
  constructor() {
	this.state = {
		x: 200
	};
	this.makeMove = this.makeMove.bind(this);
  }
  
  makeMove(e){
	  e.preventDefault();
	  const cP = this.props.currentPlayer;
	  if(cP==0){
		  
	  }else{
		  
	  }
  }

  render() {
    return(
      <div></div>
    );
  }
}

export default Square;
