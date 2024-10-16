import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const RouteTransitionWrapper = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.9 }}  // Added a scaling effect
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}  // Shrinks and fades on exit
        transition={{ duration: 0.5 }}  // Smooth and noticeable
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteTransitionWrapper;
