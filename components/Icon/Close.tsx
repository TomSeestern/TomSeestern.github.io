import { IconBase, type IconProps } from "./IconBase"

export function Close({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </IconBase>
  )
}
