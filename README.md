# RectObserver

Executes a callback whenever the bounding rectangle of an element changes. It uses `IntersectionObserver` under the hood, eliminating the need for a polling loop.

## Example

![data being updated when a rectangle moves](docs/showcase.gif)

```ts
// See full example in src/main.ts

// For testing purposes; the cause of the element's rectangle change is irrelevant.
configureSlider(target, root, handler);

let counter = 0;
const callback: RectObserverCallback = () => {
  counter++;
  textDisplay.innerHTML =
    `Callback count: ${counter}<br>` +
    `Target: ${JSON.stringify(target.getBoundingClientRect())}<br>` +
    `Root: ${JSON.stringify(root.getBoundingClientRect())}`;
};

const rectObserver = new RectObserver(callback, target, root);

// To stop observing, call:
// rectObserver.disconnect();
```

## Known Limitations

- May not function correctly if the target element causes the root to become scrollable. In such cases, consider making the root non-scrollable and wrapping it in a scrollable container.
- Detection may require up to 1 virtual pixel of change, even when the page is zoomed (multiple physical pixels per virtual pixel).

## Contributing

To contribute, please send a pull request or reach out via email: yolisses 0 at gmail dot com.
