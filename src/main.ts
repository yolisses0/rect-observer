import { configureSlider } from "./configureSlider.ts";
import { RectObserver } from "./RectObserver.ts";
import { RectObserverCallback } from "./RectObserverCallback.ts";
import "./style.css";

const root = document.querySelector<HTMLDivElement>("#root")!;
const target = document.querySelector<HTMLDivElement>("#target")!;
const textDisplay = document.querySelector<HTMLDivElement>("#textDisplay")!;

console.log(root.getBoundingClientRect());

configureSlider(target);

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

const rectObserver = new RectObserver(callback, { root });
rectObserver.observe(target);

// If required disconnect the observer
// rectObserver.disconnect();
