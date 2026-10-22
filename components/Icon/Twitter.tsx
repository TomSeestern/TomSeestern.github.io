import { IconBase, type IconProps } from "./IconBase"

export function Twitter({ className, ...props }: IconProps) {
  return (
    <IconBase className={className} fill="currentColor" stroke="none" {...props}>
      <path d="M22 5.92c-.74.33-1.53.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27 8.2 8.2 0 0 1-2.6 1 4.1 4.1 0 0 0-7 3.74A11.65 11.65 0 0 1 3.4 4.72a4.1 4.1 0 0 0 1.27 5.47 4.08 4.08 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.29 4.02 4.1 4.1 0 0 1-1.85.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.54 11.6 11.6 0 0 0 8.29 20c7.55 0 11.68-6.25 11.68-11.67v-.53A8.3 8.3 0 0 0 22 5.92Z" />
    </IconBase>
  )
}
