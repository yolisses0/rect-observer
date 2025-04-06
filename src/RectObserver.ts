import { RectObserverCallback } from "./RectObserverCallback";
import { RectObserverInit } from "./RectObserverInit";

export class RectObserver {
  root: Element;
  intersectionObserver?: IntersectionObserver;

  constructor(
    public callback: RectObserverCallback,
    public options: RectObserverInit
  ) {
    this.root = options.root;
  }

  getRootMargin(target: Element, root: Element) {
    const contentRect = target.getBoundingClientRect();
    const containerRect = root.getBoundingClientRect();

    let topMargin = containerRect.top - contentRect.top;
    let leftMargin = containerRect.left - contentRect.left;
    let rightMargin = contentRect.right - containerRect.right;
    let bottomMargin = contentRect.bottom - containerRect.bottom;

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

        this.callback();
      },
      {
        root: root,
        threshold: 1,
        rootMargin: this.getRootMargin(target, root),
      }
    );
  }

  observe(target: Element) {
    if (this.intersectionObserver) {
      throw new Error("Observe is still not implemented for multiple targets");
    }

    this.intersectionObserver = this.createIntersectionObserver(
      target,
      this.root
    );
    this.intersectionObserver.observe(target);
  }

  unobserve(target: Element) {
    throw new Error("Not implemented");
    console.log(target);
  }

  disconnect() {
    this.intersectionObserver?.disconnect();
  }
}
