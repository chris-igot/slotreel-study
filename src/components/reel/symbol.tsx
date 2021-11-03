import React, { ReactNode } from 'react';

interface PropTypes {
	index: number;
	children: ReactNode;
}

function Symbol(props: PropTypes) {
	return <div className={`sym sym-index-${props.index}`}>{props.children}</div>;
}

export default Symbol;
