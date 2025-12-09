import type { HTMLAttributes } from "astro/types";

/**
 * Base props for all icon components.
 * Extends SVG element attributes for full flexibility.
 */
export interface IconProps extends HTMLAttributes<"svg"> {
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
}
