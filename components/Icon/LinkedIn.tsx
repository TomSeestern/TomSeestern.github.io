import { IconBase, type IconProps } from "./IconBase"

export function LinkedIn({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} fill="currentColor" stroke="none" {...props}>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.24 7a1.97 1.97 0 0 0 .01-4ZM20.44 13.57c0-3.4-1.81-4.98-4.23-4.98-1.95 0-2.82 1.07-3.31 1.82V8.5H9.52V20h3.38v-6.42c0-1.7.32-3.35 2.43-3.35 2.08 0 2.11 1.95 2.11 3.46V20h3.38l-.38-6.43Z" />
    </IconBase>
  )
}
