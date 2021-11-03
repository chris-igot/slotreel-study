import React from 'react';

import './reelscreen.css';

interface PropsTypes {
	children: React.ReactNode;
}

function ReelScreen(props: PropsTypes) {
	return <div className='reel-screen'>{props.children}</div>;
}

export default ReelScreen;
