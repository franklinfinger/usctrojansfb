type PlayerBadgeProps = {
  jersey?: number | null;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
};

const SIZES = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-16 w-16 text-xl",
};

function initials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export default function PlayerBadge({
  jersey,
  firstName,
  lastName,
  size = "md",
  onDark = false,
}: PlayerBadgeProps) {
  const label = jersey != null ? String(jersey) : initials(firstName, lastName);
  const tone = onDark
    ? "border-gold bg-cardinal text-gold-bright"
    : "border-ink/10 bg-cream-mute text-ink";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 font-serif ${SIZES[size]} ${tone}`}
    >
      {label}
    </span>
  );
}
