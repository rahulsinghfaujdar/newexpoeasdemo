import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock, Timer, Trash2 } from 'lucide-react-native';
import { C, PRIORITY_COLORS } from '../theme/colors';
import { formatWindow } from '../utils/formatters';

const StopListItem = ({ order, position, isLast, onRemove }) => {
  const pc = PRIORITY_COLORS[order.priority];
  return (
    <View style={[S.stopRow, isLast && S.stopRowLast]}>
      <View style={[S.stopNumBadge, { backgroundColor: pc }]}>
        <Text style={S.stopNum}>{position}</Text>
      </View>
      <View style={S.stopRowInfo}>
        <Text style={S.stopAddress} numberOfLines={1}>{order.address}</Text>
        <View style={S.stopMeta}>
          <MapPin size={9} color={C.muted} strokeWidth={2} />
          <Text style={S.stopMetaText}>{order.distanceKm} km</Text>
          <View style={S.nodeDivider} />
          <Clock size={9} color={C.muted} strokeWidth={2} />
          <Text style={S.stopMetaText}>{formatWindow(order.deliveryWindowStart, order.deliveryWindowEnd)}</Text>
          <View style={S.nodeDivider} />
          <Timer size={9} color={C.muted} strokeWidth={2} />
          <Text style={S.stopMetaText}>{order.estimatedDurationMin} min</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.6} style={S.stopRemoveBtn} testID={`remove-${order.id}`}>
        <Trash2 size={14} color={pc} strokeWidth={1.8} />
      </TouchableOpacity>
    </View>
  );
};

const S = StyleSheet.create({
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#353535' },
  stopRowLast: { borderBottomWidth: 0 },
  stopNumBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stopNum: { fontSize: 10, fontWeight: '800', color: '#fff' },
  stopRowInfo: { flex: 1 },
  stopAddress: { fontSize: 12, fontWeight: '600', color: C.text, marginBottom: 2 },
  stopMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  stopMetaText: { fontSize: 10, color: C.muted },
  stopRemoveBtn: { padding: 6 },
  nodeDivider: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#353535' },
});

export default StopListItem;