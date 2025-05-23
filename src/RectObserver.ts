import { getAreDomRectsEqual } from "./getAreDomRectsEqual";
import { RectObserverCallback } from "./RectObserverCallback";

// Both target and root must have size observed
export class RectObserver {
  lastDomRect?: DOMRect;
  rootResizeObserver: ResizeObserver;
  targetResizeObserver: ResizeObserver;
  intersectionObserver?: IntersectionObserver;

  constructor(
    public callback: RectObserverCallback,
    public target: HTMLElement,
    public root: HTMLElement
  ) {
    // this.callback is not called in the resize observers since
    // this.updateIntersectionObserver calls this.callback
    this.targetResizeObserver = new ResizeObserver(() => {
      this.updateIntersectionObserver();
    });
    this.targetResizeObserver.observe(target);

    this.rootResizeObserver = new ResizeObserver(() => {
      this.updateIntersectionObserver();
    });
    this.rootResizeObserver.observe(root);

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
        const { boundingClientRect } = entry;
        if (
          !this.lastDomRect ||
          !getAreDomRectsEqual(this.lastDomRect, boundingClientRect)
        ) {
          if (!entry.isIntersecting) {
            observer.disconnect();
            this.updateIntersectionObserver();
          }

          this.lastDomRect = boundingClientRect;
          this.callback();
        }
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
    this.rootResizeObserver.disconnect();
    this.targetResizeObserver.disconnect();
    this.intersectionObserver?.disconnect();
  }
}
