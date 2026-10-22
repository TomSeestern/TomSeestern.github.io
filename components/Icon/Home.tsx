import { IconBase, type IconProps } from "./IconBase"

export function Home({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </IconBase>
  )
}
