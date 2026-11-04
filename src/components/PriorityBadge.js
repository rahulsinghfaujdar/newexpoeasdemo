import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

const PriorityBadge = ({ priority }) => {
  const colors = { high: C.red, medium: C.amber, low: C.muted };
  return (
    <View style={[S.priorityBadge, { backgroundColor: colors[priority] + '22', borderColor: colors[priority] + '55' }]}>
      <Text style={[S.priorityText, { color: colors[priority] }]}>{priority.toUpperCase()}</Text>
    </View>
  );
};

const S = StyleSheet.create({
  priorityBadge: { borderRadius: 5, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3 },
  priorityText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});

export default PriorityBadge;