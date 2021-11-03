import React, {
  ReactNode,
  useState,
  useEffect,
  useContext,
  CSSProperties,
} from "react";
import { ReelStateTypes } from "../../configs/commonreeltypes";
import { actionContext } from "../../context/actioncontext";

import "./reel.css";

const SYM_HEIGHT = 100;
const SYM_BORDER_OFFSET = 3;
const SYM_HEIGHT_CSS = `${SYM_HEIGHT - 2 * SYM_BORDER_OFFSET}px`;
const TOP_VIEWABLE_COUNT_LIMIT = -4;
const BOTTOM_VIEWABLE_COUNT_LIMIT = 5;

const SYM_OFFSET = -10;
const TOTAL_SPIN_TIME = 400;

const SPIN_STATE_ORDER: ReelStateTypes["spinState"][] = [
  "start",
  "spin",
  "slow",
  "jiggle",
  "stop",
];
interface transitionDurationsTypes {
  [key: string]: number;
}

const TRANSITION_DURATIONS: transitionDurationsTypes = {
  start: 200,
  spin: 100,
  slow: 400,
  jiggle: 200,
  stop: 100,
  corrected: 50,
};
interface PropTypes {
  type: string;
  reelStrip: string[];
  reelLU: { [key: string]: ReactNode };
  reelIndex: number;
  reelState: ReelStateTypes["spinState"];
  maxViewable: number;
  reelStop: number;
}

interface SymStateTypes {
  index: number;
  pos: number;
  symbol: string;
  display: CSSProperties["display"];
}

interface ReelDimTypes {
  [key: string]: number;
}

type TransitionDurationCSSType = `${number}s`;

function Reel(props: PropTypes) {
  const { setReelSpinState } = useContext(actionContext);
  const [reelDimensions, setReelDimensions] = useState<ReelDimTypes>({
    y0: 0,
    height: props.reelStrip.length,
    topLimit: 0,
    bottomLimit: 10 * SYM_HEIGHT,
    topViewable: 0,
    bottomViewable: 3 * SYM_HEIGHT,
  });
  const [reelTransitionDuration, _setReelTransitionDuration] =
    useState<TransitionDurationCSSType>("0.1s");
  function setReelTransitionDuration(time: number) {
    _setReelTransitionDuration(
      `${(time / 1000).toFixed(3)}s` as TransitionDurationCSSType
    );
    return time;
  }

  const [transitionTimingFunction, setTransitionTimingFunction] =
    useState<CSSProperties["transitionTimingFunction"]>("linear");
  const [internalSpinState, setInternalSpinState] =
    useState<ReelStateTypes["spinState"]>("stop");
  const [shiftedBy, setShiftedBy] = useState(0);
  const [symStates, setSymStates] = useState<SymStateTypes[]>([
    { index: 0, pos: 0, symbol: "SYM01", display: "block" },
  ]);
  const [SpinnerID, setSpinnerID] = useState<number>(0);

  useEffect(() => {
    let tempSymStates: SymStateTypes[] = [];
    props.reelStrip.forEach((symbol, index) => {
      tempSymStates.push({
        index,
        pos: (index + SYM_OFFSET) * SYM_HEIGHT,
        symbol,
        display: "block",
      });
    });
    setSymStates(tempSymStates);
    setReelDimensions({
      y0: 0,
      height: props.reelStrip.length * SYM_HEIGHT,
      topLimit: SYM_OFFSET * SYM_HEIGHT,
      bottomLimit: (props.reelStrip.length + SYM_OFFSET) * SYM_HEIGHT,
      topViewable: TOP_VIEWABLE_COUNT_LIMIT * SYM_HEIGHT,
      bottomViewable:
        (props.maxViewable + BOTTOM_VIEWABLE_COUNT_LIMIT) * SYM_HEIGHT,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reelStrip]);
  useEffect(() => {
    clearTimeout(SpinnerID);
    switch (internalSpinState) {
      case "start":
        setTransitionTimingFunction("ease-in");
        setTimeout(
          setInternalSpinState,
          setReelTransitionDuration(TRANSITION_DURATIONS[internalSpinState]),
          "spin"
        );
        rotateStrip(2);
        break;
      case "spin":
        setTransitionTimingFunction("linear");
        setReelSpinState(props.reelIndex, "spin");
        spinner(
          setReelTransitionDuration(TRANSITION_DURATIONS[internalSpinState]),
          TOTAL_SPIN_TIME,
          0,
          Date.now(),
          props.reelStop
        );
        break;
      case "slow":
        setTransitionTimingFunction("ease-out");
        setTimeout(
          setInternalSpinState,
          setReelTransitionDuration(TRANSITION_DURATIONS[internalSpinState]),
          "jiggle"
        );
        stop(props.reelStop);
        break;
      case "jiggle":
        setTimeout(
          setInternalSpinState,
          setReelTransitionDuration(TRANSITION_DURATIONS[internalSpinState]),
          "stop"
        );
        shiftStrip(4);
        break;
      case "forcestop":
        setTransitionTimingFunction("linear");
        setTimeout(
          setInternalSpinState,
          setReelTransitionDuration(0),
          "jiggle"
        );
        stop(props.reelStop);
        break;
      case "stop":
        if (shiftedBy !== 0) {
          setTimeout(
            shiftStrip,
            setReelTransitionDuration(TRANSITION_DURATIONS[internalSpinState]),
            -shiftedBy
          );
        }
        if (
          props.reelStrip.length === symStates.length &&
          symStates[props.reelStop].pos !== 0 &&
          symStates[props.reelStop].pos !== shiftedBy
        ) {
          console.log("reelstop corrected", {
            stop: props.reelStop,
            pos: symStates[props.reelStop].pos,
          });
          setTransitionTimingFunction("linear");
          setReelTransitionDuration(TRANSITION_DURATIONS["corrected"]);
          stop(props.reelStop);
        }

        if (props.reelState !== "stop") {
          setReelSpinState(props.reelIndex, "stop");
        }

        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalSpinState]);

  useEffect(() => {
    switch (props.reelState) {
      case "start":
        setInternalSpinState("start");
        break;
      case "forcestop":
        setInternalSpinState("forcestop");
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reelState]);

  ///Directly modifies parameters!!!
  function processSymState(destPos: number, symState: SymStateTypes) {
    if (destPos >= reelDimensions.bottomLimit) {
      symState.display = "none";
      symState.pos =
        reelDimensions.topLimit +
        ((destPos - reelDimensions.bottomLimit) % reelDimensions.height);
    } else {
      if (destPos > reelDimensions.bottomViewable) {
        symState.display = "none";
      } else if (destPos < reelDimensions.topViewable) {
        symState.display = "none";
      } else {
        symState.display = "block";
      }
      symState.pos = destPos;
    }
  }

  function stop(setToStop: number, displayAll: false = false) {
    let tempSymStates: SymStateTypes[] = [...symStates];
    tempSymStates.forEach((symState, index) => {
      const newIndex = index - setToStop;
      let destPos = 0;
      if (newIndex < TOP_VIEWABLE_COUNT_LIMIT) {
        destPos = (newIndex + tempSymStates.length) * SYM_HEIGHT;
      } else if (
        newIndex >
        tempSymStates.length + TOP_VIEWABLE_COUNT_LIMIT - 1
      ) {
        destPos = (newIndex - tempSymStates.length) * SYM_HEIGHT;
      } else {
        destPos = newIndex * SYM_HEIGHT;
      }

      symState.display = "block";

      processSymState(destPos, symState);
    });
    setSymStates(tempSymStates);
  }

  function spinner(
    repeatInterval: number,
    runTime: number,
    rDiff: number,
    start: number,
    stop: number = 0
  ) {
    const now = Date.now();
    if (
      rDiff < runTime ||
      symStates[stop].pos >= 0 ||
      symStates[stop].pos < reelDimensions.topViewable
    ) {
      const rdiff = now - start;
      rotateStrip(Math.abs(TOP_VIEWABLE_COUNT_LIMIT));
      setSpinnerID(
        setTimeout(
          spinner,
          repeatInterval,
          repeatInterval,
          runTime,
          rdiff,
          start,
          stop
        )
      );
    } else {
      const nextSpinStateIndex =
        SPIN_STATE_ORDER.indexOf(internalSpinState) + 1;
      if (nextSpinStateIndex < SPIN_STATE_ORDER.length) {
        setInternalSpinState(SPIN_STATE_ORDER[nextSpinStateIndex]);
      }
    }
  }

  function rotateStrip(moveBy: number) {
    let tempSymStates: SymStateTypes[] = [...symStates];
    tempSymStates.forEach((symState, index) => {
      let destPos = symState.pos + moveBy * SYM_HEIGHT;
      processSymState(destPos, symState);
    });
    setSymStates(tempSymStates);
  }

  function shiftStrip(pixels: number) {
    let tempSymStates: SymStateTypes[] = [...symStates];
    tempSymStates.forEach((symState, index) => {
      symState.pos = symState.pos + pixels;
    });
    setShiftedBy(shiftedBy + pixels);
    setSymStates(tempSymStates);
  }

  return (
    <div className={`reel-${props.reelIndex}`}>
      <div
        className={`reel-window reel-${props.reelIndex} reel-spin-${props.reelState}`}
        style={{
          height: `${props.maxViewable * SYM_HEIGHT}px`,
        }}
      >
        {symStates.map((symState, symIndex) => {
          return (
            <div
              key={symIndex}
              style={{
                top: symState.pos,
                height: SYM_HEIGHT_CSS,
                display: symState.display,
                transitionDuration: reelTransitionDuration as string,
                transitionTimingFunction,
              }}
              className={`sym sym-${props.reelIndex}-${symIndex}`}
            >
              {symState.index}:{props.reelLU[symState.symbol]} (
              {(symState.display as string).substring(0, 2)})
            </div>
          );
        })}
      </div>
      <div>{internalSpinState}</div>
      <div>
        <small>reelState:</small>
        <br />
        <small>{props.reelState}</small>
        <br />
        <small>length:{props.reelStrip.length}</small>
        <br />
        <small>stop:{props.reelStop}</small>
        <br />
      </div>
    </div>
  );
}

export default Reel;
