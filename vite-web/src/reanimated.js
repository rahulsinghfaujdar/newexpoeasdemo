import { createElement, useRef } from 'react';

const Animated = {
  createAnimatedComponent: Component => function AnimatedComponent({ animatedProps, ...props }) {
    return createElement(Component, { ...props, ...animatedProps });
  },
};

const Easing = {
  linear: value => value,
};

function useSharedValue(initialValue) {
  return useRef({ value: initialValue }).current;
}

function useAnimatedProps(getProps) {
  return getProps();
}

function withRepeat(animation) {
  return animation;
}

function withTiming(value) {
  return value;
}

export { Animated as default, Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming };
