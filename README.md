# RectObserver

Executes a callback whenever the bounding rectangle of an element changes. It uses `IntersectionObserver` under the hood, eliminating the need for a polling loop.

## Example

```ts
// Full example in src/main.ts

// For testing purposes; the cause of the element's rectangle change is irrelevant.
configureSlider(target, root, handler);

let counter = 0;
const callback: RectObserverCallback = () => {
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

// If needed, disconnect the observer
// rectObserver.disconnect();
```

## Known Limitations

- It may not work well if the target causes the root to become scrollable. In such cases, consider making the root non-scrollable and wrapping it in a scrollable container.
- The callback may be triggered more times than the target's rectangle actually changes.

## Contributing

To contribute to the library, please contact me via email: yolisses 0 at gmail dot com.
