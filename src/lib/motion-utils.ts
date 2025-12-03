import { useReducedMotion } from 'framer-motion';

/**
 * Custom hook to get motion configuration based on user's motion preferences
 * Respects the prefers-reduced-motion accessibility setting
 */
export const useMotionConfig = () => {
    const shouldReduceMotion = useReducedMotion();

    return {
        shouldReduceMotion,

        /**
         * Returns animation props only if motion is not reduced
         * @param animateProps - The animation properties to apply
         * @returns Animation props or empty object
         */
        getAnimateProps: (animateProps: any) =>
            shouldReduceMotion ? {} : animateProps,

        /**
         * Returns transition config with instant duration if motion is reduced
         * @param transition - The transition configuration
         * @returns Modified transition or instant transition
         */
        getTransition: (transition: any) =>
            shouldReduceMotion ? { duration: 0 } : transition,
    };
};
