import React, { useEffect, createContext, useContext } from "react";

import { ReelStateTypes, ReelStripsType } from "../configs/commonreeltypes";

import { reelStrips } from "../configs/reelstrips";

import { slotContext, defaultSlotContextValues } from "./slotcontext";
const INTER_REEL_DELAY = 50;

let defaultActionContextValues = {
  slotState: defaultSlotContextValues.slotState,
  spin: () => {},
  setReelSpinState: (
    reelIndex: number,
    state: ReelStateTypes["spinState"]
  ) => {},
  setStops: () => {},
  forceStop: () => {},
};

const actionContext = createContext(defaultActionContextValues);

export { actionContext };

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getStops(reelStrips: ReelStripsType) {
  let stops: number[] = reelStrips.map((strip, index) =>
    randomNumber(0, strip.length - 1)
  );
  return stops;
}

interface PropTypes {
  children?: React.ReactNode;
}

function ActionContextProvider(props: PropTypes) {
  const { slotState, dispatch } = useContext(slotContext);
  useEffect(() => {
    dispatch({ type: "SET_REELS", payload: reelStrips });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function staggeredSpin() {
    function spinReel(reelIndex: number) {
      let reelStates = [...slotState.reelStates];
      for (let index = 0; index <= reelIndex; index++) {
        reelStates[index] = "start";
      }
      dispatch({ type: "SET_SPIN_STATE", payload: reelStates });
    }
    for (let index = 0; index < reelStrips.BASE_GAME.length; index++) {
      setTimeout(spinReel, INTER_REEL_DELAY * index, index);
    }
  }

  function setStops() {
    dispatch({ type: "SET_STOPS", payload: getStops(reelStrips.BASE_GAME) });
  }
  function setReelSpinState(
    reelIndex: number,
    state: ReelStateTypes["spinState"]
  ) {
    let tempReelState = [...slotState.reelStates];
    tempReelState[reelIndex] = state;
    dispatch({ type: "SET_SPIN_STATE", payload: tempReelState });
  }

  function forceStop() {
    let tempReelState: ReelStateTypes["spinState"][] = [];
    slotState.reelStates.forEach((state) => {
      tempReelState.push("forcestop");
    });
    console.log("forceStop", tempReelState);
    dispatch({ type: "SET_SPIN_STATE", payload: tempReelState });
  }
  return (
    <actionContext.Provider
      value={{
        slotState,
        spin: staggeredSpin,
        setReelSpinState,
        setStops,
        forceStop,
      }}
    >
      {props.children}
    </actionContext.Provider>
  );
}

export default ActionContextProvider;
