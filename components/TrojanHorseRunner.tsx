// Original stylized horse silhouette (not a USC mark) that gallops once
// across the bottom of the home hero on load, then stays hidden. Pure CSS
// animation defined in globals.css (.trojan-horse); disabled entirely under
// prefers-reduced-motion.
export default function TrojanHorseRunner() {
  return (
    <svg
      className="trojan-horse"
      viewBox="0 0 200 100"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M55,58 C55,42 75,34 100,34 C125,34 140,42 140,55 C140,66 122,70 100,70 C75,70 55,68 55,58 Z" />
      <path d="M128,40 C138,28 150,18 165,14 C170,22 168,30 160,36 C150,42 138,48 130,50 Z" />
      <path d="M160,10 L182,16 L176,24 L158,20 Z" />
      <path d="M165,8 L170,0 L172,9 Z" />
      <path d="M135,32 L140,20 L145,30 Z" />
      <path d="M145,28 L150,16 L154,26 Z" />
      <path d="M154,22 L158,12 L161,20 Z" />
      <path d="M56,50 C42,46 30,48 20,42 C28,54 40,58 56,57 Z" />
      <path d="M118,60 L131,57 L152,90 L141,94 Z" />
      <path d="M105,63 L117,61 L100,84 L89,87 Z" />
      <path d="M70,65 L82,63 L48,86 L38,82 Z" />
      <path d="M82,67 L93,65 L90,88 L79,90 Z" />
    </svg>
  );
}
