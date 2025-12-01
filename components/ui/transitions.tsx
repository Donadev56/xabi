import { AnimatePresence, motion } from "framer-motion";

type MotionDivProps = React.ComponentProps<typeof motion.div>;
interface AnimatedDiv extends MotionDivProps {
  displayWhen?: boolean;
}
const TranslateY = ({ displayWhen = true, ...p }: AnimatedDiv) => {
  const props = p;
  return (
    <AnimatePresence>
      {displayWhen && (
        <motion.div
          {...props}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TranslateX = ({ displayWhen, ...p }: AnimatedDiv) => {
  const props = p;

  return (
    <AnimatePresence>
      {displayWhen && (
        <motion.div
          {...props}
          initial={{ x: "-100%", filter: "blur(5px)" }}
          animate={{ x: "0%", filter: "blur(0px)" }}
          exit={{ x: "-100%", filter: "blur(5px)" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Fade = ({ displayWhen, ...p }: AnimatedDiv) => {
  const props = p;

  return (
    <AnimatePresence>
      {displayWhen && (
        <motion.div
          {...props}
          initial={{ opacity: 0, filter: "blur(5px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Scale = ({ displayWhen, ...p }: AnimatedDiv) => {
  const props = p;

  return (
    <AnimatePresence>
      {displayWhen && (
        <motion.div
          {...props}
          initial={{ scale: 0.8, opacity: 0, filter: "blur(5px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={{ scale: 0.8, opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HeightCollapse = ({ displayWhen, ...p }: AnimatedDiv) => {
  const props = p;

  return (
    <AnimatePresence initial={false}>
      {displayWhen && (
        <motion.div
          {...props}
          initial={{ height: 0, opacity: 0, filter: "blur(5px)" }}
          animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
          exit={{ height: 0, opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const Blur = ({ displayWhen, ...props }: AnimatedDiv) => {
  return (
    <AnimatePresence>
      {displayWhen && (
        <motion.div
          {...props}
          initial={{ filter: "blur(20px)" }}
          animate={{ filter: "blur(0px)" }}
          exit={{ filter: "blur(20px)" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { TranslateY, TranslateX, Fade, Scale, HeightCollapse, Blur };
