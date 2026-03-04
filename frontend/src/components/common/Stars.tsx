import { StarIcon } from "./Icons";

export function Stars({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span style={{ display: "inline-flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            fontSize: size,
            color: n <= rating ? "#E8C547" : "#d8d4cc",
            lineHeight: 1,
          }}
        >
          <StarIcon size={size} />
        </span>
      ))}
    </span>
  );
}
