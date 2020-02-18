import React from 'react';
import './App.scss';
import PlayerComponent from './components/PlayerComponent/PlayerComponent';

function App() {
  return (
    <div className="app">
      <section className="main-container">
        <div className="bg-artwork" />
        <div className="bg-layer" />
        <PlayerComponent />
      </section>
    </div>
  );
}

export default App;
