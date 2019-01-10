import React, { Component } from 'react';
import { Image } from 'react-konva';

class Cross extends Component {
  constructor() {
    super();
    this.state = {
      image: null
    };
  }

  componentDidMount() {
    let x = 200;
    const img = new window.Image(x, x);
    img.src = 'public/cross.png';
    this.setState({
      image: img
    });
  }

  render() {
    return(
		  <Image
			  image = {this.state.image}
			/>
    );
  }
}

export default Cross;
