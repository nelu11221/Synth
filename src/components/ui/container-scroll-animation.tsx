"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale  = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[50rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20 overflow-hidden"
      ref={containerRef}
    >
      <div className="py-8 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
        position: "relative",
        zIndex: 40,
      }}
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  const { scrollY } = useScroll();
  const fadeOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        position: "relative",
        zIndex: 10,
        boxShadow:
          "0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(124,58,237,0.08), 0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
        borderColor: "rgba(124,58,237,0.3)",
        background: "#0d0d0d",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 p-2 md:p-6 rounded-[30px] shadow-2xl"
    >
      <div
        className="h-full w-full overflow-hidden rounded-2xl md:rounded-2xl md:p-4"
        style={{ background: "#080808", position: "relative" }}
      >
        {children}

        {/* Gradient fade on top edge — disappears after 200px scroll */}
        <motion.div
          aria-hidden
          style={{
            opacity: fadeOpacity,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            background: "linear-gradient(to bottom, #080808 0%, transparent 100%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      </div>
    </motion.div>
  );
};
