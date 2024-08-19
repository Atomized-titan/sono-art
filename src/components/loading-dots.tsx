import { motion, Transition } from "framer-motion";
import React from "react";

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
      repeat: Infinity,
    },
  },
};

const DotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
  },
};

const DotTransition: Transition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
};

export default function LoadingDots() {
  return (
    <div className="w-full flex items-center justify-center pt-20 h-screen">
      <motion.div
        className="w-40 h-20 flex justify-around"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="block w-8 h-8 bg-primary rounded-full"
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          className="block w-8 h-8 bg-primary rounded-full"
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          className="block w-8 h-8 bg-primary rounded-full"
          variants={DotVariants}
          transition={DotTransition}
        />
      </motion.div>
    </div>
  );
}
