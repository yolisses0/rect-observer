export function configureSlider(slider: HTMLElement) {
  let offset = 0;

  function beginSliding(e: PointerEvent) {
    slider.onpointermove = slide;
    slider.setPointerCapture(e.pointerId);
    offset = e.clientX - slider.getBoundingClientRect().left;
  }

  function stopSliding(e: PointerEvent) {
    slider.onpointermove = null;
    slider.releasePointerCapture(e.pointerId);
  }

  function slide(e: PointerEvent) {
    const position = e.clientX - offset;
    slider.style.transform = `translate(${position}px)`;
  }

  slider.onpointerdown = beginSliding;
  slider.onpointerup = stopSliding;
}
