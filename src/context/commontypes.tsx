import { ReelStateTypes, ReelStripsType } from '../configs/commonreeltypes';

export interface SlotStateTypes {
	reelStrips: { [key: string]: ReelStripsType };
	reelStates: ReelStateTypes['spinState'][];
	stops: number[];
}

export interface SlotContextTypes {
	slotState: SlotStateTypes;
	dispatch: React.Dispatch<ActionTypes>;
}

export type ActionTypes =
	| {
			type: 'SET_SPIN_STATE';
			payload: SlotStateTypes['reelStates'];
	  }
	| {
			type: 'SET_STOPS';
			payload: SlotStateTypes['stops'];
	  }
	| {
			type: 'SET_REELS';
			payload: SlotStateTypes['reelStrips'];
	  };

const SET_SPIN_STATE = 'SET_SPIN_STATE';
const SET_STOPS = 'SET_STOPS';
const SET_REELS = 'SET_REELS';

export { SET_SPIN_STATE, SET_STOPS, SET_REELS };
