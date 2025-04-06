export function configureSlider(target: HTMLElement, root: HTMLElement) {
  let offsetX = 0;
  let offsetY = 0;

  function beginSliding(e: PointerEvent) {
    target.onpointermove = slide;
    target.setPointerCapture(e.pointerId);

    const targetRect = target.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    offsetY = e.clientY - targetRect.top + rootRect.top;
    offsetX = e.clientX - targetRect.left + rootRect.left;
  }

  function stopSliding(e: PointerEvent) {
    target.onpointermove = null;
    target.releasePointerCapture(e.pointerId);
  }

  function slide(e: PointerEvent) {
    target.style.top = e.clientY - offsetY + "px";
    target.style.left = e.clientX - offsetX + "px";
  }

  target.onpointerdown = beginSliding;
  target.onpointerup = stopSliding;
}
