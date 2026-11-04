import { createElement } from 'react';
import { View } from 'react-native';

export function SafeAreaProvider({ children }) {
  return createElement(View, { style: { flex: 1 } }, children);
}

export function SafeAreaView({ children, style }) {
  return createElement(View, { style }, children);
}
