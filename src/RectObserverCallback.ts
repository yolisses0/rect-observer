import { RectObserver } from "./RectObserver";

export type RectObserverCallback = (
  target: Element,
  root: Element,
  observer: RectObserver
) => void;
