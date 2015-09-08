import React, { Component } from 'react';

import '../styles/App.css';

export default class App extends Component {
  render() {
    return <AppContent />;
  }
}

function AppContent() {
  return <h1>Hello, world!</h1>;
}
