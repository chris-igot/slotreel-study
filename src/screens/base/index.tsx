import React, { useContext } from "react";
import { slotContext } from "../../context/slotcontext";

import { ReelStateTypes } from "../../configs/commonreeltypes";
import { symbolLU } from "../../configs/reelstrips";
import { reelViews } from "../../configs/screen";

import ReelScreen from "../../components/reelscreen";
import Reel from "../../components/reel";

import "./base.css";

const REELSET = "BASE_GAME";

interface PropTypes {
  gameState: { stops: number[]; reelStates: ReelStateTypes["spinState"][] };
}

function Base(props: PropTypes) {
  const { slotState } = useContext(slotContext);
  return (
    <div className="base-game-screen">
      <div>base game</div>
      <ReelScreen>
        {slotState.reelStrips[REELSET].map((reelStrip, index) => (
          <Reel
            key={index}
            maxViewable={reelViews[REELSET].reelSymHeight}
            reelState={slotState.reelStates[index]}
            type="string"
            reelIndex={index}
            reelStrip={reelStrip}
            reelLU={symbolLU[REELSET]}
            reelStop={slotState.stops[index]}
          />
        ))}
      </ReelScreen>
    </div>
  );
}

export default Base;
