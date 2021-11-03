import { ReactNode } from 'react';

export interface ReelStateTypes {
	spinState: 'start' | 'spin' | 'slow' | 'jiggle' | 'stop' | 'forcestop';
}

export interface ReelViewTypes {
	reelCountWidth: number;
	reelSymHeight: number;
	symOffset: number;
	symHeight: number;
	spinTime: number;
	topViewableCountLimit: number;
	bottomViewableCountLimit: number;
}

export interface SymbolLUTypes {
	[key: string]: ReactNode;
}

export type ReelStripsType = string[][];
