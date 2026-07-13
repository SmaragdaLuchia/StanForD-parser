export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="7" fill="var(--color-pine)" />
      <path
        d="M16 5l7 10h-4l4 6h-5v6h-4v-6H9l4-6H9z"
        fill="var(--color-alabaster)"
      />
    </svg>
  );
}
