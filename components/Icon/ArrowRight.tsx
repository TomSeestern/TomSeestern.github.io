import { IconBase, type IconProps } from "./IconBase"

export function ArrowRight({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  )
}
