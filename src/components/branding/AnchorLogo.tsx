import Image from 'next/image'
import Link from 'next/link'

interface Props {
  size?: 'auth' | 'sidebar' | 'header'
  subtitle?: string
  href?: string
  className?: string
}

const SIZE_CLASSES = {
  auth: {
    wrap: 'mx-auto w-[290px] sm:w-[360px]',
    subtitle: 'mt-4 text-center',
  },
  sidebar: {
    wrap: 'w-[158px]',
    subtitle: 'mt-3',
  },
  header: {
    wrap: 'w-[170px] sm:w-[192px]',
    subtitle: 'mt-3',
  },
}

export default function AnchorLogo({
  size = 'auth',
  subtitle,
  href,
  className = '',
}: Props) {
  const content = (
    <div className={`${SIZE_CLASSES[size].wrap} ${className}`.trim()}>
      <Image
        src="/anchor-logo.png"
        alt="Anchor logo"
        width={1152}
        height={768}
        priority={size === 'auth'}
        className="h-auto w-full"
      />
      {subtitle && (
        <p className={`mono-label text-ink-4 ${SIZE_CLASSES[size].subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  )

  if (!href) return content

  return (
    <Link href={href} className="block" aria-label="Anchor home">
      {content}
    </Link>
  )
}
