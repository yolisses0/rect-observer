export class RectObserver {
  intersectionObserver: IntersectionObserver;

  constructor(
    private target: HTMLElement,
    private root: HTMLElement,
    callback: () => void
  ) {
    this.intersectionObserver = this.createIntersectionObserver();
    this.intersectionObserver.observe(target);
  }

  getRootMargin() {
    const rootRect = this.root.getBoundingClientRect();
    const targetRect = this.target.getBoundingClientRect();

    console.log(targetRect, rootRect);

    const leftMargin = rootRect.left - targetRect.left;
    const rightMargin = rootRect.right - targetRect.right;
    /* top | right | bottom | left */
    const rootMargin = `${0}px ${rightMargin}px ${0}px ${leftMargin}px`;
    return rootMargin;
  }

  createIntersectionObserver() {
    const rootMargin = this.getRootMargin();
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries[0].isIntersecting);
      },
      {
        rootMargin,
        threshold: 1,
        root: this.root,
      }
    );
    return intersectionObserver;
  }
}
