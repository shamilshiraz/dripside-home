"use client";

import React from "react";
import { motion } from "framer-motion";



const FlipLink = ({ text, light = false }: { text: string; light?: boolean }) => {
  return (
    <button
      className={`
        group relative overflow-hidden h-[20px]
        flex items-center justify-center
        ${light ? "text-[#191B1C]" : "text-[#F4F4ED]"}
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
          {text.split("").map((letter: string, i: number) => (
            <span
              key={i}
              className="inline-block font-satoshi text-sm"
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>

        {/* BOTTOM TEXT */}
        <span
          className="
            absolute
            left-0
            top-0
            flex
            translate-y-[140%]
            group-hover:translate-y-0
            transition-transform
            duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]
            will-change-transform
          "
        >
          {text.split("").map((letter: string, i: number) => (
            <span
              key={i}
              className="
                inline-block
                font-satoshi
                text-sm
                opacity-0
                group-hover:opacity-100
                [transform:rotateX(-90deg)]
                group-hover:[transform:rotateX(0deg)]
                transition-all
                duration-700
                ease-[cubic-bezier(0.76,0,0.24,1)]
                [transform-origin:bottom]
                will-change-transform
              "
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
};


const WholesaleSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#ecebe5] py-28">
      {/* Background Image */}
      <div
        className="absolute inset-10 bg-center bg-contain bg-no-repeat opacity-40 "
        style={{
          backgroundImage:
            "url('/dsg.svg')", // Replace with your image
        }}
      />


      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl text-5xl font-black uppercase text-black md:text-7xl sm:text-7xl"
                  style={{ fontFamily: "futuraCB" }}

        >
          Looking for <br />
          Wholesale?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-8 max-w-2xl  leading-5 font-light font-satoshi md:text-lg"
        >
          Partner with Dripside for premium garment manufacturing,
          private-label production, and bulk apparel orders. We deliver
          exceptional craftsmanship, reliable timelines, and scalable
          production tailored to your brand.
        </motion.p>

      {/* BUTTON */}
      <div className="px-4 sm:px-8 mt-8">
        <div
          className="
            w-fit
            px-6
            py-3
            rounded-full
            bg-[#191b1c]
            text-white
          "
        >
          <FlipLink text="Enquire now" />
        </div>
      </div>
      </div>
    </section>
  );
};

export default WholesaleSection;