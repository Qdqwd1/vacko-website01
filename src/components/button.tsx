import { Link } from "next-view-transitions"

type ButtonSize = "small" | "medium" | "large"
type ResponsiveSize = { base?: ButtonSize; sm?: ButtonSize; md?: ButtonSize; lg?: ButtonSize }

type ButtonProperty = {
  size?: ButtonSize
  sizeResponsive?: ResponsiveSize
  text: string
  link: string
}

// Base (no prefix)
const sizeBase: Record<ButtonSize, string> = {
  small: "py-[12px] px-[20px] text-[16px] gap-[20px]",
  medium: "py-[14px] px-[24px] text-[18px] gap-[24px]",
  large: "py-[14px] px-[32px] text-[24px] gap-[24px]",
}

// Prefixed variants MUST be literal strings for Tailwind to generate them
const sizePrefixed = {
  sm: {
    small: "sm:py-[12px] sm:px-[20px] sm:text-[16px] sm:gap-[20px]",
    medium: "sm:py-[14px] sm:px-[24px] sm:text-[18px] sm:gap-[24px]",
    large: "sm:py-[14px] sm:px-[32px] sm:text-[24px] sm:gap-[24px]",
  },
  md: {
    small: "md:py-[12px] md:px-[20px] md:text-[16px] md:gap-[20px]",
    medium: "md:py-[14px] md:px-[24px] md:text-[18px] md:gap-[24px]",
    large: "md:py-[14px] md:px-[32px] md:text-[24px] md:gap-[24px]",
  },
  lg: {
    small: "lg:py-[12px] lg:px-[20px] lg:text-[16px] lg:gap-[20px]",
    medium: "lg:py-[14px] lg:px-[24px] lg:text-[18px] lg:gap-[24px]",
    large: "lg:py-[14px] lg:px-[32px] lg:text-[24px] lg:gap-[24px]",
  },
} as const

const arrowBase: Record<ButtonSize, string> = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
}

const arrowPrefixed = {
  sm: { small: "sm:w-4 sm:h-4", medium: "sm:w-5 sm:h-5", large: "sm:w-6 sm:h-6" },
  md: { small: "md:w-4 md:h-4", medium: "md:w-5 md:h-5", large: "md:w-6 md:h-6" },
  lg: { small: "lg:w-4 lg:h-4", medium: "lg:w-5 lg:h-5", large: "lg:w-6 lg:h-6" },
} as const

function responsiveSizeClasses(size: ButtonSize, sizeResponsive?: ResponsiveSize) {
  if (!sizeResponsive) return sizeBase[size]

  const baseSize = sizeResponsive.base ?? size
  const parts: string[] = [sizeBase[baseSize]]

  if (sizeResponsive.sm) parts.push(sizePrefixed.sm[sizeResponsive.sm])
  if (sizeResponsive.md) parts.push(sizePrefixed.md[sizeResponsive.md])
  if (sizeResponsive.lg) parts.push(sizePrefixed.lg[sizeResponsive.lg])

  return parts.join(" ")
}

function responsiveArrowClasses(size: ButtonSize, sizeResponsive?: ResponsiveSize) {
  if (!sizeResponsive) return arrowBase[size]

  const baseSize = sizeResponsive.base ?? size
  const parts: string[] = [arrowBase[baseSize]]

  if (sizeResponsive.sm) parts.push(arrowPrefixed.sm[sizeResponsive.sm])
  if (sizeResponsive.md) parts.push(arrowPrefixed.md[sizeResponsive.md])
  if (sizeResponsive.lg) parts.push(arrowPrefixed.lg[sizeResponsive.lg])

  return parts.join(" ")
}

export default function Button({ size = "medium", sizeResponsive, text, link }: ButtonProperty) {
  const classes = responsiveSizeClasses(size, sizeResponsive)
  const arrowClasses = responsiveArrowClasses(size, sizeResponsive)

  return (
    <Link
      href={link}
      className={`
        group inline-flex items-center justify-center
        rounded-full bg-[#333438] text-white 
        ${classes}
      `}
    >
      <span className="relative overflow-hidden block ">
        <span className="block transition-transform duration-300 ease-out 
                        group-hover:-translate-y-full">
          {text}
        </span>
        <span className="absolute left-0 top-0 block translate-y-full 
                        transition-transform duration-300 ease-out group-hover:translate-y-0">
          {text}
        </span>
      </span>

      <img
        src="/arrowDefault.svg"
        alt=""
        className={`
          shrink-0 self-center transition-transform duration-300 ease-out
          group-hover:-rotate-45
          ${arrowClasses}
        `}
      />
    </Link>
  )
}