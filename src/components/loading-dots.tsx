import { motion } from "framer-motion";

export const LoadingDots = (props: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div className="flex space-x-2" {...props}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-white rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};
