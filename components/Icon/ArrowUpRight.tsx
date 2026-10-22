import { IconBase, type IconProps } from "./IconBase"

export function ArrowUpRight({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconBase>
  )
}
