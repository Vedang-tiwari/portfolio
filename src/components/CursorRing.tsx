import { useEffect, useRef, useState } from "react";

/**
 * Replaces the OS arrow with a small red circle that grows slightly while
 * the mouse is pressed. Only enabled for fine pointers (mouse/trackpad) so
 * touch devices keep native behaviour.
 */
export function CursorRing() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-ring-active");

    const move = (e: PointerEvent) => {
      setVisible(true);
      const el = dotRef.current;
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("cursor-ring-active");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="rounded-full bg-flame-red"
        style={{
          width: 16,
          height: 16,
          marginLeft: -8,
          marginTop: -8,
          transform: down ? "scale(1.35)" : "scale(1)",
          transition: "transform 110ms ease-out",
        }}
      />
    </div>
  );
}
