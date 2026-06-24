'use client'

interface FlipLinkProps {
  text: string
  light?: boolean
  className?: string
}

export default function FlipLink({ text, light = false, className = '' }: FlipLinkProps) {
  return (
    <button
      className={`
        group relative overflow-hidden h-[20px]
        flex items-center justify-center
        ${light ? 'text-[#191B1C]' : 'text-[#F4F4ED]'}
        ${className}
      `}
    >
      <span className="relative block leading-none">
        {/* TOP TEXT */}
        <span
          className="
            flex
            group-hover:-translate-y-[140%]
            transition-transform
            duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]
            will-change-transform
          "
        >
          {text.split('').map((letter, i) => (
            <span
              key={i}
              className="inline-block font-satoshi text-sm"
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {letter === ' ' ? ' ' : letter}
            </span>
          ))}
        </span>

        {/* BOTTOM TEXT */}
        <span
          className="
            absolute left-0 top-0
            flex
            translate-y-[140%]
            group-hover:translate-y-0
            transition-transform
            duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]
            will-change-transform
          "
        >
          {text.split('').map((letter, i) => (
            <span
              key={i}
              className="
                inline-block font-satoshi text-sm
                opacity-0 group-hover:opacity-100
                [transform:rotateX(-90deg)]
                group-hover:[transform:rotateX(0deg)]
                transition-all duration-700
                ease-[cubic-bezier(0.76,0,0.24,1)]
                [transform-origin:bottom]
                will-change-transform
              "
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {letter === ' ' ? ' ' : letter}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
