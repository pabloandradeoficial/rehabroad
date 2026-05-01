import { ReactNode, useRef, memo } from "react";
import { motion, useInView, Variants } from "framer-motion";

// Check if mobile ONCE at module load - before any React
const IS_MOBILE = typeof window !== 'undefined' && (
  window.innerWidth < 768 ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
);

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  animation?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "fade";
}

// MOBILE: Zero-cost wrapper - no hooks, no motion, just render
const MobileWrapper = memo(({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
));
MobileWrapper.displayName = "MobileWrapper";

// Full animations for desktop
const fullAnimations: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  },
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
};

// Desktop-only animated component
function DesktopAnimateOnScroll({
  children,
  className = "",
  delay = 0,
  duration = 0.4,
  once = true,
  amount = 0.1,
  animation = "fadeUp"
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fullAnimations[animation]}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Export: Mobile returns plain div, Desktop gets full animation
export function AnimateOnScroll(props: AnimateOnScrollProps) {
  if (IS_MOBILE) return <MobileWrapper className={props.className}>{props.children}</MobileWrapper>;
  return <DesktopAnimateOnScroll {...props} />;
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
}

function DesktopStaggerContainer({
  children,
  className = "",
  staggerDelay = 0.05,
  once = true,
  amount = 0.1
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer(props: StaggerContainerProps) {
  if (IS_MOBILE) return <MobileWrapper className={props.className}>{props.children}</MobileWrapper>;
  return <DesktopStaggerContainer {...props} />;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "fade";
}

function DesktopStaggerItem({
  children,
  className = "",
  animation = "fadeUp"
}: StaggerItemProps) {
  return (
    <motion.div
      variants={fullAnimations[animation]}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem(props: StaggerItemProps) {
  if (IS_MOBILE) return <MobileWrapper className={props.className}>{props.children}</MobileWrapper>;
  return <DesktopStaggerItem {...props} />;
}

