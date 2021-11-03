import React, { createContext, useReducer } from 'react';

// import { ReelStateTypes, ReelStripsType } from '../configs/commonreeltypes';
import { SlotContextTypes, ActionTypes } from './commontypes';

import { reelStrips } from '../configs/reelstrips';

import reducer from './reducer';

let defaultSlotContextValues: SlotContextTypes = {
	slotState: {
		reelStrips: reelStrips,
		reelStates: ['stop', 'stop', 'stop', 'stop', 'stop'],
		stops: [0, 0, 0, 0, 0],
	},
	dispatch: (() => {}) as React.Dispatch<ActionTypes>,
};

export { defaultSlotContextValues };

const slotContext = createContext(defaultSlotContextValues);

export { slotContext };

interface PropTypes {
	children?: React.ReactNode;
}

function SlotContextProvider(props: PropTypes) {
	const [slotState, dispatch] = useReducer(
		reducer,
		defaultSlotContextValues.slotState
	);

	return (
		<slotContext.Provider value={{ slotState, dispatch }}>
			{props.children}
		</slotContext.Provider>
	);
}

export default SlotContextProvider;
