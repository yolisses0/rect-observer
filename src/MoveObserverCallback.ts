import { MoveObserver } from "./MoveObserver";
import { MoveObserverEntry } from "./MoveObserverEntry";

export type MoveObserverCallback = (
  entries: MoveObserverEntry[],
  observer: MoveObserver
) => void;
