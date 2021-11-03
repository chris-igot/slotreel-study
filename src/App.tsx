import React, { /* useState, useEffect,  */ useContext } from "react";
import "./App.css";

import SpinButton from "./components/spinbutton";
import Base from "./screens/base";

import { actionContext } from "./context/actioncontext";

function App() {
  const { slotState } = useContext(actionContext);

  return (
    <div className="App">
      <Base
        gameState={{ reelStates: slotState.reelStates, stops: slotState.stops }}
      />
      <SpinButton />
    </div>
  );
}

export default App;
