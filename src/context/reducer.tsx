import { SlotStateTypes } from "./commontypes";

import {
  ActionTypes,
  SET_SPIN_STATE,
  SET_STOPS,
  SET_REELS,
} from "./commontypes";

function reducer(state: SlotStateTypes, action?: ActionTypes) {
  let tempState = { ...state };
  if (action !== undefined) {
    switch (action.type) {
      case SET_REELS:
        tempState.reelStrips = action.payload;
        return tempState;
      case SET_STOPS:
        tempState.stops = action.payload;
        return tempState;
      case SET_SPIN_STATE:
        tempState.reelStates = action.payload;
        return tempState;
      default:
        return state;
    }
  } else {
    return state;
  }
}

export default reducer;
