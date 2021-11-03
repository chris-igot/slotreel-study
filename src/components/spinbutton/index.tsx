import React, { useState, useEffect, useContext } from 'react';
import Button from '../button';
import { actionContext } from '../../context/actioncontext';

// import { ReelStateTypes } from '../../configs/commonreeltypes';
type ButtonStateType = 'SPIN' | 'NONE' | 'STOP';
interface StateCountTypes {
	start: number;
	spin: number;
	forcestop: number;
	stop: number;
}

const defaultStateCount: StateCountTypes = {
	start: 0,
	spin: 0,
	forcestop: 0,
	stop: 0,
};

function SpinButton() {
	const { slotState, spin, setStops, forceStop } = useContext(actionContext);

	const [buttonState, setButtonState] = useState<ButtonStateType>('SPIN');
	const [stateCount, setStateCount] = useState(defaultStateCount);
	useEffect(() => {
		let tempStateCount: StateCountTypes = {
			start: 0,
			spin: 0,
			forcestop: 0,
			stop: 0,
		};

		for (let index = 0; index < slotState.reelStates.length; index++) {
			const element = slotState.reelStates[index] as keyof StateCountTypes;
			tempStateCount[element] = ++tempStateCount[element];
		}

		setStateCount(tempStateCount);

		if (
			tempStateCount.start > 0 ||
			(tempStateCount.spin > 0 && tempStateCount.spin < 5)
		) {
			setButtonState('NONE');
		} else if (tempStateCount.stop === 5) {
			setButtonState('SPIN');
		} else if (tempStateCount.spin === 5) {
			setButtonState('STOP');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slotState.reelStates]);
	return (
		<>
			<Button
				name='spin'
				label={buttonState}
				handler={() => {
					if (buttonState === 'SPIN') {
						setStops();
						spin();
					} else if (buttonState === 'NONE') {
					} else if (buttonState === 'STOP') {
						console.log('FORCE STOP');
						forceStop();
					}
				}}
			/>
			<div>
				{Object.keys(stateCount).map((key) => (
					<div key={key}>
						{key}:{stateCount[key as keyof StateCountTypes]}
					</div>
				))}
			</div>
		</>
	);
}

export default SpinButton;
