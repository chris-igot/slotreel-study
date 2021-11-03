export interface ReelViewTypes {
	reelCountWidth: number;
	reelSymHeight: number;
	symOffset: number;
	symHeight: number;
	spinTime: number;
	topViewableCountLimit: number;
	bottomViewableCountLimit: number;
}

const baseReelView: ReelViewTypes = {
	reelCountWidth: 5,
	reelSymHeight: 3,
	symOffset: -10,
	symHeight: 40,
	spinTime: 1000,
	topViewableCountLimit: -5,
	bottomViewableCountLimit: 3,
};

const reelViews = { BASE_GAME: baseReelView };

export { reelViews };
