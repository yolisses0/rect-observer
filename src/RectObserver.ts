import { RectObserverCallback } from "./RectObserverCallback";
import { RectObserverInit } from "./RectObserverInit";

export class RectObserver {
  root: Element;
  target: Element;
  intersectionObserver?: IntersectionObserver;

  constructor(
    public callback: RectObserverCallback,
    public options: RectObserverInit
  ) {
    this.root = options.root;
    this.target = options.target;

    this.intersectionObserver = this.createIntersectionObserver(
      this.target,
      this.root
    );
    this.intersectionObserver.observe(this.target);
  }

  getRootMargin(target: Element, root: Element) {
    const contentRect = target.getBoundingClientRect();
    const containerRect = root.getBoundingClientRect();

    let topMargin = containerRect.top - contentRect.top;
    let leftMargin = containerRect.left - contentRect.left;
    let rightMargin = contentRect.right - containerRect.right;
    let bottomMargin = contentRect.bottom - containerRect.bottom;

    console.log({ topMargin, leftMargin, rightMargin, bottomMargin });
    // This part ensures that the intersection rect is big enough in
    // fractional displays, where the positions are given by floats, which
    // have precision errors
    if (!Number.isInteger(topMargin)) {
      topMargin++;
    }
    if (!Number.isInteger(leftMargin)) {
      leftMargin++;
    }
    if (!Number.isInteger(rightMargin)) {
      rightMargin++;
    }
    if (!Number.isInteger(bottomMargin)) {
      bottomMargin++;
    }

    /* top | right | bottom | left */
    const rootMargin =
      [topMargin, rightMargin, bottomMargin, leftMargin].join("px ") + "px";
    return rootMargin;
  }

  createIntersectionObserver(target: Element, root: Element) {
    return new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;

        if (!entry.isIntersecting) {
          observer.disconnect();
          this.intersectionObserver = this.createIntersectionObserver(
            target,
            root
          );
          this.intersectionObserver.observe(target);
        }

        this.callback(target, root, this);
      },
      {
        root: root,
        threshold: 1,
        rootMargin: this.getRootMargin(target, root),
      }
    );
  }

  disconnect() {
    this.intersectionObserver?.disconnect();
  }
}
