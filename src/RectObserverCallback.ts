import { RectObserver } from "./RectObserver";
import { RectObserverEntry } from "./RectObserverEntry";

export type RectObserverCallback = (
  entries: RectObserverEntry[],
  observer: RectObserver
) => void;
