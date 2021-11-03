import React from 'react';

import './button.css';

interface PropTypes {
	name: string;
	label?: React.ReactNode;
	handler: Function;
}

function Button(props: PropTypes) {
	return (
		<button
			className='button'
			type='button'
			name={props.name}
			onClick={() => {
				props.handler(props.name);
			}}
		>
			{'label' in props ? props.label : props.name}
		</button>
	);
}

export default Button;
