import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConfigureStore } from './Redux/configureStore';
import Game from './GameComponent';
import './App.css';

const store = ConfigureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Game/>
      </Provider>
    );
  }
}

export default App;
