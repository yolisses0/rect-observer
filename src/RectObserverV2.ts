export type ClientRectObserverCallback = (
  entry: IntersectionObserverEntry
) => void;

export interface ClientRectObserverOptions {
  root: Element;
}

export class ClientRectObserver {
  private root: Element;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(
    public target: Element,
    public callback: ClientRectObserverCallback,
    options: ClientRectObserverOptions
  ) {
    this.root = options.root;

    this.resizeObserver = new ResizeObserver(() => {
      this.updateIntersectionObserver();
    });

    this.resizeObserver.observe(this.target);
    this.updateIntersectionObserver();
  }

  private updateIntersectionObserver() {
    const rootRect = this.root.getBoundingClientRect();
    const targetRect = this.target.getBoundingClientRect();

    const marginTop = targetRect.top - rootRect.top;
    const marginLeft = targetRect.left - rootRect.left;
    const marginRight = targetRect.right - rootRect.right;
    const marginBottom = targetRect.bottom - rootRect.bottom;

    const rootMargin = `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`;

    this.intersectionObserver?.disconnect();

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.callback(entries[0]);
      },
      {
        rootMargin,
        threshold: 1,
        root: this.root instanceof Element ? this.root : null,
      }
    );

    this.intersectionObserver.observe(this.target);
  }

  disconnect() {
    this.resizeObserver.disconnect();
    this.intersectionObserver?.disconnect();
  }
}
