'use client'

interface FooterColumnProps {
  title: string
  items: string[]
}

const FooterColumn = ({ title, items }: FooterColumnProps) => {
  return (
    <div>
      <h3
        className="
          text-[11px]
          uppercase
          mb-5
          tracking-wide
          text-[#111]
        "
        style={{ fontFamily: 'satoshi' }}
      >
        {title}
      </h3>

      <div className="flex flex-col gap-1">
        {items.map((item, i) => (
          <p
            key={i}
            className="
              text-[13px]
              leading-[1.25]
              text-[#111]
              cursor-pointer
              w-fit
              hover:opacity-60
              transition-opacity
            "
            style={{ fontFamily: 'satoshi' }}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#ecebe5] text-[#111]">

      {/* TOP */}
      <div
        className="
          px-4
          sm:px-8
          pt-6
          sm:pt-8
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <img
            src="/icons/nvlogo.svg"
            alt="Dripside"
            className="
              w-[90px]
              sm:w-[120px]
              object-contain
            "
          />
        </div>

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-4
            gap-y-10
            gap-x-8
            pb-10
          "
        >
          <FooterColumn
            title="Sitemap"
            items={[
              'Home',
              'About',
              'Editor',
              'Shop',
              'Cart',
            ]}
          />

          <FooterColumn
            title="Connect"
            items={[
              'Instagram',
              'Facebook',
              'Whatsapp',
              'Email',
              'Phone',
            ]}
          />

          <FooterColumn
            title="T&C"
            items={[
              'Terms',
              'Returns & Refunds',
              'Privacy policy',
            ]}
          />

          <FooterColumn
            title="Address"
            items={[
              'Silk street,',
              'Kozhikode,',
              'Kerala,',
              '673001',
            ]}
          />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-full h-px bg-black/30" />

      {/* BOTTOM */}
      <div
        className="
          py-4
          text-center
          text-[12px]
          text-[#111]
        "
        style={{ fontFamily: 'satoshi' }}
      >
        © Dripside. All rights reserved.
      </div>
    </footer>
  )
}
