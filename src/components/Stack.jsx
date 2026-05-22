import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

const IMAGE_SRC = "/wad.png";
const BG_SRC = "/mpbg.webp";

const MAX_LAYERS = 20;

const WORDS = [
  "A", "COLLECTIVE", "FOR", "ARTISTS", "WHO", "STRIVE",
  "BUILD", "THEMSELVES,", "OVERCOMING", "THE", "CHALLENGES",
  "AND", "THE", "CHAOS",
];

export default function StackScrollImage() {
  const outerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const layers = isMobile ? 20 : 10;
  const offsetPx = isMobile ? 60 : 120;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // STACK SPREAD
  const yTransforms = Array.from({ length: MAX_LAYERS }, (_, i) =>
    useTransform(smooth, [0, 0.45], [0, i * offsetPx])
  );

  // STACK FADE OUT
  const stackOpacity = useTransform(smooth, [0.45, 0.58], [1, 0]);

  // TEXT APPEAR
  const textOpacity = useTransform(smooth, [0.6, 0.75], [0, 1]);
  const textY = useTransform(smooth, [0.6, 0.75], [60, 0]);

  // WORD-BY-WORD OPACITY — staggered across 0.72 → 0.95
  const wordOpacities = Array.from({ length: WORDS.length }, (_, i) => {
    const start = 0.72 + (i / WORDS.length) * 0.2;
    return useTransform(smooth, [start, start + 0.06], [0, 1]);
  });

  return (
    <section ref={outerRef} className="relative h-[400vh]">
      {/* STICKY FRAME */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* BG */}
        <div className="absolute inset-0">
          <img src={BG_SRC} alt="" className="w-full h-full object-cover" />
        </div>

        {/* STACK */}
        <motion.div
          className="absolute inset-0 flex justify-center items-start"
          style={{ opacity: stackOpacity }}
        >
          {[...Array(layers)].map((_, i) => (
            <motion.img
              key={i}
              src={IMAGE_SRC}
              alt=""
              className="absolute w-full px-2 sm:px-10 select-none pointer-events-none"
              style={{ zIndex: layers - i, y: yTransforms[i] }}
            />
          ))}
        </motion.div>

        {/* TEXT */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: textOpacity, y: textY, fontFamily: "futuraCB" }}
        >
          <div className="text-center text-black">
            <img src="./wad.png" alt="" className="w-full" />

            <p className="mt-4 text-[5vw] sm:text-[5vw] font-bold uppercase leading-[1] max-w-[1400px] mx-auto">
              {WORDS.map((word, i) => (
                <motion.span
                  key={i}
                  style={{ opacity: wordOpacities[i] }}
                  className={word === "COLLECTIVE" ? "text-red-500" : ""}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}