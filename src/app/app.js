import {
    AlarmClock,
    ArrowUpNarrowWide,
    Bike,
    Car,
    MapPin,
    Navigation2,
    PackageSearch,
    PackageX,
    Route,
    SlidersHorizontal,
    Timer,
    Truck,
    Users,
    Zap,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OrderCard from '../components/OrderCard';
import RouteMapViz from '../components/RouteMapViz';
import SectionLabel from '../components/SectionLabel';
import StopListItem from '../components/StopListItem';
import { INITIAL_DRIVERS, INITIAL_ORDERS } from '../data/mockData';
import { assignOrder, computeRouteMetrics, isDriverFull, optimizeRoute, unassignOrder } from '../logic/routeLogic';
import { C } from '../theme/colors';

const App = () => {
  const { width } = useWindowDimensions();
  const [drivers] = useState(INITIAL_DRIVERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [optimizationMode, setOptimizationMode] = useState('distance');
  const driverCardBasis = width >= 960 ? '32%' : width >= 640 ? '48%' : '100%';

  const selectedDriver = useMemo(
    () => drivers.find(driver => driver.id === selectedDriverId) || null,
    [drivers, selectedDriverId],
  );

  const unassignedOrders = useMemo(
    () => orders.filter(order => order.assignedDriverId == null),
    [orders],
  );

  const optimizedRoute = useMemo(
    () => selectedDriverId ? optimizeRoute(orders, selectedDriverId, optimizationMode) : [],
    [orders, selectedDriverId, optimizationMode],
  );

  const handleAssign = orderId => {
    setOrders(currentOrders => {
      const updatedOrders = assignOrder(currentOrders, orderId, selectedDriverId, drivers);
      return updatedOrders || currentOrders;
    });
  };

  const handleUnassign = orderId => {
    setOrders(currentOrders => unassignOrder(currentOrders, orderId));
  };

  return (
    <SafeAreaView style={S.screen} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[S.scroll, width >= 720 && S.scrollWide]}
        showsVerticalScrollIndicator={false}
      >

        <View style={S.header}>
          <Text style={S.headerTitle}>Route Optimizer</Text>
          <Text style={S.headerSub}>Logistics Dispatch</Text>
        </View>

        <SectionLabel label="Drivers" Icon={Users} />
        <View style={S.driversList}>
          {drivers.map(driver => {
            const full = isDriverFull(orders, driver);
            const selected = selectedDriverId === driver.id;
            const driverMetrics = computeRouteMetrics(orders, driver.id);
            const VehicleIcon = driver.vehicleType === 'Bike' ? Bike : driver.vehicleType === 'Van' ? Car : Truck;
            const accentColor = selected ? C.accent : full ? C.red : C.textSecondary;
            return (
              <TouchableOpacity
                key={driver.id}
                style={[
                  S.driverCard,
                  { flexBasis: driverCardBasis },
                  selected && S.driverCardSelected,
                  full && !selected && S.driverCardFull,
                ]}
                onPress={() => setSelectedDriverId(selected ? null : driver.id)}
                activeOpacity={0.8}
              >
                <View style={S.driverCardTop}>
                  <View style={[S.driverAvatar, { backgroundColor: accentColor + '18', borderColor: accentColor + '50' }]}>
                    <VehicleIcon size={16} color={accentColor} strokeWidth={1.8} />
                  </View>
                  <View style={S.driverInfo}>
                    <Text style={[S.driverName, selected && S.textAccent]}>{driver.name}</Text>
                    <Text style={S.driverVehicleLabel}>{driver.vehicleType}</Text>
                  </View>
                  <View style={S.driverStatusCol}>
                    {selected && (
                      <View style={S.activePill}>
                        <View style={S.activeDot} />
                        <Text style={S.activePillText}>Active</Text>
                      </View>
                    )}
                    {full && (
                      <View style={S.fullBadge}>
                        <PackageX size={9} color={C.red} strokeWidth={2.5} />
                        <Text style={S.fullBadgeText}>FULL</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={S.capacityBarRow}>
                  <View style={S.capacityBar}>
                    <View style={[
                      S.capacityFill,
                      {
                        width: `${(driverMetrics.totalDeliveries / driver.maxCapacity) * 100}%`,
                        backgroundColor: full ? C.red : selected ? C.accent : C.textSecondary,
                      },
                    ]} />
                  </View>
                  <Text style={S.capacityLabel}>{driverMetrics.totalDeliveries}/{driver.maxCapacity}</Text>
                </View>

                <View style={S.driverStats}>
                  <View style={S.driverStat}>
                    <View style={S.driverStatIconRow}>
                      <PackageSearch size={11} color={accentColor} strokeWidth={2} />
                      <Text style={[S.driverStatValue, selected && { color: C.accent }]}>
                        {driverMetrics.totalDeliveries}
                      </Text>
                    </View>
                    <Text style={S.driverStatLabel}>Orders</Text>
                  </View>
                  <View style={S.driverStatDivider} />
                  <View style={S.driverStat}>
                    <View style={S.driverStatIconRow}>
                      <MapPin size={11} color={accentColor} strokeWidth={2} />
                      <Text style={[S.driverStatValue, selected && { color: C.accent }]}>
                        {driverMetrics.totalDistance.toFixed(1)}
                        <Text style={S.driverStatUnit}> km</Text>
                      </Text>
                    </View>
                    <Text style={S.driverStatLabel}>Distance</Text>
                  </View>
                  <View style={S.driverStatDivider} />
                  <View style={S.driverStat}>
                    <View style={S.driverStatIconRow}>
                      <Timer size={11} color={accentColor} strokeWidth={2} />
                      <Text style={[S.driverStatValue, selected && { color: C.accent }]}>
                        {driverMetrics.totalEstimatedDuration}
                        <Text style={S.driverStatUnit}> min</Text>
                      </Text>
                    </View>
                    <Text style={S.driverStatLabel}>Est. Time</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <SectionLabel label="Optimize By" Icon={SlidersHorizontal} />
        <View style={S.modeRow}>
          {(['distance', 'priority', 'timeWindow']).map(mode => {
            const labels = { distance: 'Distance', priority: 'Priority', timeWindow: 'Time Window' };
            const active = optimizationMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[S.modeBtn, active && S.modeBtnActive]}
                onPress={() => setOptimizationMode(mode)}
                activeOpacity={0.75}
              >
                <Text style={[S.modeBtnText, active && S.modeBtnTextActive]}>{labels[mode]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedDriverId && (
          <>
            <SectionLabel label={`Route — ${selectedDriver?.name}`} Icon={Route} />
            {optimizedRoute.length === 0 ? (
              <View style={S.routeEmptyState}>
                <View style={S.routeEmptyIconWrap}>
                  <Navigation2 size={24} color={C.border} strokeWidth={1.5} />
                </View>
                <Text style={S.routeEmptyTitle}>No stops yet</Text>
                <Text style={S.routeEmptySub}>Assign orders below to build the route</Text>
              </View>
            ) : (
              <View style={S.routeWrapper}>
                <View style={S.routeModeStrip}>
                  <View style={S.routePanelModeRow}>
                    {optimizationMode === 'distance'
                      ? <ArrowUpNarrowWide size={12} color={C.accent} strokeWidth={2} />
                      : optimizationMode === 'priority'
                      ? <Zap size={12} color={C.accent} strokeWidth={2} />
                      : <AlarmClock size={12} color={C.accent} strokeWidth={2} />}
                    <Text style={S.routePanelMode}>
                      {optimizationMode === 'distance' ? 'Nearest first' : optimizationMode === 'priority' ? 'Priority order' : 'Earliest window'}
                    </Text>
                  </View>
                  <View style={S.routePanelHeaderRight}>
                    <Text style={S.routePanelStat}>{optimizedRoute.reduce((s, o) => s + o.distanceKm, 0).toFixed(1)} km</Text>
                    <View style={S.routePanelDot} />
                    <Text style={S.routePanelStat}>{optimizedRoute.reduce((s, o) => s + o.estimatedDurationMin, 0)} min</Text>
                  </View>
                </View>

                <View style={S.routeWrapperDivider} />
                <RouteMapViz route={optimizedRoute} />

                <View style={S.mapLegend}>
                  {[['High', C.red], ['Medium', C.amber], ['Low', '#818CF8']].map(([label, color]) => (
                    <View key={label} style={S.mapLegendItem}>
                      <View style={[S.mapLegendDot, { backgroundColor: color }]} />
                      <Text style={S.mapLegendText}>{label}</Text>
                    </View>
                  ))}
                </View>

                <View style={S.routeWrapperDivider} />
                <View style={S.stopList}>
                  {optimizedRoute.map((order, idx) => (
                    <StopListItem
                      key={order.id}
                      order={order}
                      position={idx + 1}
                      isLast={idx === optimizedRoute.length - 1}
                      onRemove={() => handleUnassign(order.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {optimizedRoute.length > 0 && (() => {
              const totalDist = optimizedRoute.reduce((s, o) => s + o.distanceKm, 0);
              const totalTime = optimizedRoute.reduce((s, o) => s + o.estimatedDurationMin, 0);
              const highCount = optimizedRoute.filter(o => o.priority === 'high').length;
              return (
                <View style={S.summaryRow}>
                  <View style={[S.summaryCard, S.summaryCardOrders]}>
                    <PackageSearch size={16} color={C.accent} strokeWidth={1.8} />
                    <Text style={S.summaryValue}>{optimizedRoute.length}</Text>
                    <Text style={S.summaryLabel}>Orders</Text>
                  </View>
                  <View style={[S.summaryCard, S.summaryCardHigh]}>
                    <Zap size={16} color={C.red} strokeWidth={1.8} />
                    <Text style={[S.summaryValue, { color: C.red }]}>{highCount}</Text>
                    <Text style={S.summaryLabel}>High</Text>
                  </View>
                  <View style={[S.summaryCard, S.summaryCardDist]}>
                    <MapPin size={16} color='#34D399' strokeWidth={1.8} />
                    <Text style={[S.summaryValue, { color: '#34D399' }]}>{totalDist.toFixed(1)}</Text>
                    <Text style={S.summaryLabel}>km</Text>
                  </View>
                  <View style={[S.summaryCard, S.summaryCardTime]}>
                    <Timer size={16} color='#FBBF24' strokeWidth={1.8} />
                    <Text style={[S.summaryValue, { color: '#FBBF24' }]}>{totalTime}</Text>
                    <Text style={S.summaryLabel}>min</Text>
                  </View>
                </View>
              );
            })()}
          </>
        )}

        <SectionLabel label={`Orders Queue (${unassignedOrders.length})`} Icon={PackageSearch} />
        {unassignedOrders.length === 0 ? (
          <Text style={S.emptyText}>All orders assigned</Text>
        ) : (
          unassignedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAssign={selectedDriverId && !isDriverFull(orders, selectedDriver) ? () => handleAssign(order.id) : null}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  scroll: { width: '100%', alignSelf: 'center', paddingHorizontal: 16, paddingTop: 8 },
  scrollWide: { maxWidth: 1120, paddingHorizontal: 24, paddingTop: 20 },

  header: { paddingVertical: 20 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: C.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 12, color: C.textSecondary, marginTop: 2, letterSpacing: 1, textTransform: 'uppercase' },

  driversList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  driverCard: { flexGrow: 1, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14 },
  driverCardSelected: { borderColor: C.accent + '80', backgroundColor: '#3b82f60C' },
  driverCardFull: { opacity: 0.55 },

  driverCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  driverAvatar: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 14, fontWeight: '700', color: C.text, letterSpacing: -0.2 },
  driverVehicleLabel: { fontSize: 11, color: C.textSecondary, marginTop: 1 },
  textAccent: { color: C.accent },
  driverStatusCol: { alignItems: 'flex-end', gap: 4 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.accent + '18', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.accent },
  activePillText: { fontSize: 10, fontWeight: '600', color: C.accent },
  fullBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ef444418', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  fullBadgeText: { fontSize: 9, fontWeight: '700', color: C.red, letterSpacing: 0.5 },

  capacityBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  capacityBar: { flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2, overflow: 'hidden' },
  capacityFill: { height: '100%', borderRadius: 2 },
  capacityLabel: { fontSize: 11, fontWeight: '600', color: C.textSecondary, width: 28, textAlign: 'right' },

  driverStats: { flexDirection: 'row', alignItems: 'center' },
  driverStat: { flex: 1, alignItems: 'center', gap: 3 },
  driverStatIconRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  driverStatValue: { fontSize: 14, fontWeight: '700', color: C.text },
  driverStatUnit: { fontSize: 11, fontWeight: '400', color: C.textSecondary },
  driverStatLabel: { fontSize: 10, color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
  driverStatDivider: { width: 1, height: 28, backgroundColor: C.border },

  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center' },
  modeBtnActive: { borderColor: C.accent, backgroundColor: '#3b82f615' },
  modeBtnText: { fontSize: 12, fontWeight: '500', color: C.textSecondary },
  modeBtnTextActive: { color: C.accent, fontWeight: '600' },

  emptyText: { fontSize: 13, color: C.muted, textAlign: 'center', paddingVertical: 20 },

  routeEmptyState: { alignItems: 'center', paddingVertical: 36, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, borderStyle: 'dashed' },
  routeEmptyIconWrap: { marginBottom: 12 },
  routeEmptyTitle: { fontSize: 15, fontWeight: '600', color: C.textSecondary },
  routeEmptySub: { fontSize: 12, color: C.muted, marginTop: 4 },

  routeWrapper: { borderRadius: 16, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, overflow: 'hidden' },
  routeWrapperDivider: { height: 1, backgroundColor: C.border },
  routeModeStrip: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  routePanelHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routePanelModeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  routePanelMode: { fontSize: 11, fontWeight: '600', color: C.accent, letterSpacing: 0.3 },
  routePanelStat: { fontSize: 11, fontWeight: '500', color: C.textSecondary },
  routePanelDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.border },

  mapLegend: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingVertical: 10 },
  mapLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  mapLegendDot: { width: 8, height: 8, borderRadius: 4 },
  mapLegendText: { fontSize: 10, color: C.textSecondary, fontWeight: '500' },

  stopList: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },

  summaryRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  summaryCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4 },
  summaryCardOrders: { backgroundColor: C.accent + '0D', borderColor: C.accent + '30' },
  summaryCardHigh: { backgroundColor: C.red + '0D', borderColor: C.red + '30' },
  summaryCardDist: { backgroundColor: '#34D39910', borderColor: '#34D39930' },
  summaryCardTime: { backgroundColor: '#FBBF2410', borderColor: '#FBBF2430' },
  summaryValue: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  summaryLabel: { fontSize: 10, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
});

export default App;
