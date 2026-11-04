import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

const SectionLabel = ({ label, Icon }) => (
  <View style={S.sectionLabelRow}>
    {Icon && <Icon size={11} color={C.textSecondary} strokeWidth={2} />}
    <Text style={S.sectionLabel}>{label}</Text>
  </View>
);

const S = StyleSheet.create({
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, marginBottom: 10 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: C.textSecondary, letterSpacing: 1.2, textTransform: 'uppercase' },
});

export default SectionLabel;