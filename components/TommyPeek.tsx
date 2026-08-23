import Image from "next/image";

// Tommy Trojan, fixed to the bottom-right corner of the viewport, home page
// only. Slides up once on load (see .tommy-peek in globals.css) and then
// stays put. Fixed position + pointer-events: none means it can never shift
// layout or block a click, regardless of scroll position.
export default function TommyPeek() {
  return (
    <div className="tommy-peek" aria-hidden="true">
      <Image
        src="/images/tommy.png"
        alt=""
        width={367}
        height={600}
        priority
        className="h-full w-auto drop-shadow-2xl"
      />
    </div>
  );
}
