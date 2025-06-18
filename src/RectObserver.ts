import { getAreDomRectsEqual } from "./getAreDomRectsEqual";
import { RectObserverCallback } from "./RectObserverCallback";

// Both target and root must have size observed
export class RectObserver {
  lastRootDomRect?: DOMRect;
  lastTargetDomRect?: DOMRect;
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

  getRootMargin = (target: Element, root: Element) => {
    const contentRect = target.getBoundingClientRect();
    const containerRect = root.getBoundingClientRect();

    let topMargin = containerRect.top - contentRect.top;
    let leftMargin = containerRect.left - contentRect.left;
    let rightMargin = contentRect.right - containerRect.right;
    let bottomMargin = contentRect.bottom - containerRect.bottom;

    // This part ensures that the intersection rect is big enough in fractional
    // displays, where the positions are given by floats, which have precision
    // errors
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
  };

  createIntersectionObserver = (target: Element, root: Element) => {
    return new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;
        const targetBoundingClientRect = entry.boundingClientRect;
        const rootBoundingClientRect = root.getBoundingClientRect();
        if (
          !this.lastRootDomRect ||
          !this.lastTargetDomRect ||
          !getAreDomRectsEqual(this.lastRootDomRect, rootBoundingClientRect) ||
          !getAreDomRectsEqual(this.lastTargetDomRect, targetBoundingClientRect)
        ) {
          if (!entry.isIntersecting) {
            observer.disconnect();
            this.updateIntersectionObserver();
          }

          this.lastRootDomRect = rootBoundingClientRect;
          this.lastTargetDomRect = targetBoundingClientRect;
          this.callback();
        }
      },
      {
        root: root,
        threshold: 1,
        rootMargin: this.getRootMargin(target, root),
      }
    );
  };

  updateIntersectionObserver = () => {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = this.createIntersectionObserver(
      this.target,
      this.root
    );
    this.intersectionObserver.observe(this.target);
  };

  disconnect = () => {
    this.rootResizeObserver.disconnect();
    this.targetResizeObserver.disconnect();
    this.intersectionObserver?.disconnect();
  };
}
