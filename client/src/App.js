import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Pokedex from "./components/pokedex/pokedex";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          alt=""
          src={require("../src/assets/react-pokeball.svg")}
          width="130"
          height="130"
        />
        <h1>React Pokedex</h1>
      </header>
    </div>
  );
}

export default App;
