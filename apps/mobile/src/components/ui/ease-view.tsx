import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

type AnimateProps = {
  opacity?: number;
  translateX?: number;
  translateY?: number;
  scale?: number;
};

type TransitionProps = {
  type?: "spring" | "timing" | "none";
  damping?: number;
  stiffness?: number;
  mass?: number;
  duration?: number;
  delay?: number;
  easing?: "easeIn" | "easeOut" | "easeInOut" | "linear" | string;
};

type EaseViewProps = ViewProps & {
  animate?: AnimateProps;
  initialAnimate?: AnimateProps;
  transition?: TransitionProps;
  style?: StyleProp<ViewStyle>;
};

const AnimatedView = Animated.createAnimatedComponent(Animated.View);

function easingFor(name?: string) {
  switch (name) {
    case "easeIn":
      return Easing.in(Easing.cubic);
    case "easeOut":
      return Easing.out(Easing.cubic);
    case "linear":
      return Easing.linear;
    case "easeInOut":
    default:
      return Easing.inOut(Easing.cubic);
  }
}

function valueFor(
  key: keyof AnimateProps,
  initialAnimate?: AnimateProps,
  animate?: AnimateProps
) {
  return initialAnimate?.[key] ?? animate?.[key] ?? (key === "scale" ? 1 : 0);
}

export function EaseView({
  animate,
  initialAnimate,
  transition,
  style,
  ...props
}: EaseViewProps) {
  const opacity = useRef(
    new Animated.Value(valueFor("opacity", initialAnimate, animate) || 1)
  ).current;
  const translateX = useRef(
    new Animated.Value(valueFor("translateX", initialAnimate, animate))
  ).current;
  const translateY = useRef(
    new Animated.Value(valueFor("translateY", initialAnimate, animate))
  ).current;
  const scale = useRef(
    new Animated.Value(valueFor("scale", initialAnimate, animate) || 1)
  ).current;

  useEffect(() => {
    if (transition?.type === "none") {
      opacity.setValue(animate?.opacity ?? 1);
      translateX.setValue(animate?.translateX ?? 0);
      translateY.setValue(animate?.translateY ?? 0);
      scale.setValue(animate?.scale ?? 1);
      return;
    }

    const config = {
      delay: transition?.delay ?? 0,
      useNativeDriver: true,
    };

    const animations =
      transition?.type === "spring"
        ? [
            Animated.spring(opacity, {
              toValue: animate?.opacity ?? 1,
              damping: transition.damping ?? 18,
              stiffness: transition.stiffness ?? 180,
              mass: transition.mass ?? 1,
              useNativeDriver: true,
            }),
            Animated.spring(translateX, {
              toValue: animate?.translateX ?? 0,
              damping: transition.damping ?? 18,
              stiffness: transition.stiffness ?? 180,
              mass: transition.mass ?? 1,
              useNativeDriver: true,
            }),
            Animated.spring(translateY, {
              toValue: animate?.translateY ?? 0,
              damping: transition.damping ?? 18,
              stiffness: transition.stiffness ?? 180,
              mass: transition.mass ?? 1,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: animate?.scale ?? 1,
              damping: transition.damping ?? 18,
              stiffness: transition.stiffness ?? 180,
              mass: transition.mass ?? 1,
              useNativeDriver: true,
            }),
          ]
        : [
            Animated.timing(opacity, {
              toValue: animate?.opacity ?? 1,
              duration: transition?.duration ?? 220,
              easing: easingFor(transition?.easing),
              ...config,
            }),
            Animated.timing(translateX, {
              toValue: animate?.translateX ?? 0,
              duration: transition?.duration ?? 220,
              easing: easingFor(transition?.easing),
              ...config,
            }),
            Animated.timing(translateY, {
              toValue: animate?.translateY ?? 0,
              duration: transition?.duration ?? 220,
              easing: easingFor(transition?.easing),
              ...config,
            }),
            Animated.timing(scale, {
              toValue: animate?.scale ?? 1,
              duration: transition?.duration ?? 220,
              easing: easingFor(transition?.easing),
              ...config,
            }),
          ];

    const composite = Animated.parallel(animations);
    composite.start();
    return () => composite.stop();
  }, [animate, opacity, scale, transition, translateX, translateY]);

  return (
    <AnimatedView
      {...props}
      style={[
        style,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
}
