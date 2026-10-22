import { IconBase, type IconProps } from "./IconBase"

export function Mail({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m4 6 8 7 8-7" />
    </IconBase>
  )
}
