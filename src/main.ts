import { configureSlider } from "./configureSlider.ts";
import { RectObserver } from "./RectObserver.ts";
import { RectObserverCallback } from "./RectObserverCallback.ts";

const root = document.querySelector<HTMLDivElement>("#root")!;
const target = document.querySelector<HTMLDivElement>("#target")!;
const handler = document.querySelector<HTMLDivElement>("#handler")!;
const textDisplay = document.querySelector<HTMLDivElement>("#textDisplay")!;

// Just for testing, the cause of the element's rect doesn't matter.
configureSlider(target, root, handler);

let counter = 0;
const callback: RectObserverCallback = () => {
  console.log(target.getBoundingClientRect());
  counter++;
  textDisplay.innerHTML = `Callback count: ${counter}`;
  textDisplay.innerHTML += `<br>Target: ${JSON.stringify(
    target.getBoundingClientRect()
  )}`;
  textDisplay.innerHTML += `<br>Root: ${JSON.stringify(
    root.getBoundingClientRect()
  )}`;
};

const rectObserver = new RectObserver(callback, target, root);

// If required disconnect the observer
// rectObserver.disconnect();
