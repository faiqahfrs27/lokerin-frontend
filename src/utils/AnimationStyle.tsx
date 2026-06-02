import type { CSSProperties } from "react";

/**
 * Returns an inline style object that fades the element up on mount.
 * Usage: <div style={fadeUp(200)}>...</div>
 *
 * @param delay - animation delay in milliseconds (default: 0)
 */
export function fadeUp(delay = 0): CSSProperties {
  return {
    animation: `fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
  };
}