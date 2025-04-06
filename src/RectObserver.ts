import { RectObserverCallback } from "./RectObserverCallback";

export class RectObserver {
  resizeObserver: ResizeObserver;
  intersectionObserver?: IntersectionObserver;

  constructor(
    public callback: RectObserverCallback,
    public target: HTMLElement,
    public root: HTMLElement
  ) {
    this.resizeObserver = new ResizeObserver(() => {
      // this.callback is called in the intersection observer callback, so no
      // need to call it here
      this.updateIntersectionObserver();
    });
    this.resizeObserver.observe(target);

    this.updateIntersectionObserver();
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
          this.updateIntersectionObserver();
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

  updateIntersectionObserver() {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = this.createIntersectionObserver(
      this.target,
      this.root
    );
    this.intersectionObserver.observe(this.target);
  }

  disconnect() {
    this.intersectionObserver?.disconnect();
  }
}
