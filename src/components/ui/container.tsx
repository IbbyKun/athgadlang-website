import { cn } from "@/lib/utils";

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  /** For grids that need more room, e.g. five cards abreast. */
  wide: "max-w-[100rem]",
} as const;

type ContainerProps = React.ComponentProps<"div"> & {
  size?: keyof typeof widths;
};

/**
 * Page gutter + max width. Use for every full-bleed section's inner content
 * so all horizontal edges line up across the site.
 */
export function Container({
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[size], className)}
      {...props}
    />
  );
}
