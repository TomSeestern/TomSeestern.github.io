import { IconBase, type IconProps } from "./IconBase"

export function Menu({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  )
}
