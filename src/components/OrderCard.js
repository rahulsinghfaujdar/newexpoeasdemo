import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock, Timer, Plus } from 'lucide-react-native';
import { C } from '../theme/colors';
import { formatWindow } from '../utils/formatters';
import PriorityBadge from './PriorityBadge';

const OrderCard = ({ order, onAssign }) => (
  <View style={[S.card, order.priority === 'high' && S.cardHighlight]}>
    <View style={S.cardRow}>
      <View style={S.cardLeft}>
        <View style={S.orderIdRow}>
          <PriorityBadge priority={order.priority} />
          <Text style={S.orderId}>{order.id}</Text>
        </View>
        <Text style={S.orderAddress}>{order.address}</Text>
        <View style={S.orderMeta}>
          <MapPin size={10} color={C.textSecondary} strokeWidth={2} />
          <Text style={S.metaText}>{order.distanceKm} km</Text>
          <View style={S.metaSep} />
          <Clock size={10} color={C.textSecondary} strokeWidth={2} />
          <Text style={S.metaText}>{formatWindow(order.deliveryWindowStart, order.deliveryWindowEnd)}</Text>
          <View style={S.metaSep} />
          <Timer size={10} color={C.textSecondary} strokeWidth={2} />
          <Text style={S.metaText}>{order.estimatedDurationMin} min</Text>
        </View>
      </View>
      <View style={S.cardRight}>
        {onAssign ? (
          <TouchableOpacity style={S.assignBtn} onPress={onAssign} activeOpacity={0.75}>
            <Plus size={11} color="#fff" strokeWidth={2.5} />
            <Text style={S.assignBtnText}>Assign</Text>
          </TouchableOpacity>
        ) : (
          <View style={S.assignBtnDisabled}>
            <Plus size={11} color={C.muted} strokeWidth={2} />
            <Text style={S.assignBtnDisabledText}>Assign</Text>
          </View>
        )}
      </View>
    </View>
  </View>
);

const S = StyleSheet.create({
  card: { backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 8 },
  cardHighlight: { borderColor: '#ef444433' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end', justifyContent: 'center' },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  orderId: { fontSize: 11, fontWeight: '600', color: C.accent, letterSpacing: 0.5 },
  orderAddress: { fontSize: 14, fontWeight: '500', color: C.text, marginTop: 2 },
  orderMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  metaText: { fontSize: 11, color: C.textSecondary },
  metaSep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.border, marginHorizontal: 2 },
  assignBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.accent, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 6 },
  assignBtnText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  assignBtnDisabled: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surface, borderRadius: 7, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 6 },
  assignBtnDisabledText: { fontSize: 12, fontWeight: '500', color: C.muted },
});

export default OrderCard;