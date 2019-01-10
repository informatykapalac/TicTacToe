import React, { Component } from 'react';
import Konva from 'konva';
import { Image } from 'react-konva';

class Circle extends Component {
  constructor() {
    super();
    this.state = {
      image: null
    };
  }

  componentDidMount() {
    const img = new window.Image();
    img.src = 'public/circle.png';
    img.onload = () => {
      this.setState({
        image: img
      });
    };
  }

  render() {
    return(
		  <Image
			  image={this.state.image}
        width={this.props.x}
        height={this.props.x}
        x={0}
        y={0}
			/>
    );
  }
}

export default Circle;
