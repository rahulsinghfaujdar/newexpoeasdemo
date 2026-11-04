
// export function isDriverFull(_orders, _driver) {
//   // write your code here
//   return false;
// }

// export function assignOrder(_orders, _orderId, _driverId, _drivers) {
//   // write your code here
//   return null;
// }

// export function unassignOrder(_orders, _orderId) {
//   // write your code here
//   return _orders;
// }

// export function optimizeRoute(_orders, _driverId, _mode) {
//   // write your code here
//   return [];
// }

// export function computeRouteMetrics(_orders, _driverId) {
//   // write your code here
//   return { totalDeliveries: 0, totalDistance: 0, totalEstimatedDuration: 0, highPriorityCount: 0 };
// }




const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export function isDriverFull(orders, driver) {
  if (!driver) return false;
  const assignedCount = orders.filter(order => order.assignedDriverId === driver.id).length;
  return assignedCount >= driver.maxCapacity;
}

export function assignOrder(orders, orderId, driverId, drivers) {
  if (driverId == null) return null;
  const order = orders.find(item => item.id === orderId);
  const driver = drivers.find(item => item.id === driverId);
  if (!order || order.assignedDriverId != null || !driver || isDriverFull(orders, driver)) return null;
  return orders.map(item => item.id === orderId ? { ...item, assignedDriverId: driverId } : item);
}

export function unassignOrder(orders, orderId) {
  return orders.map(item => item.id === orderId ? { ...item, assignedDriverId: null } : item);
}

export function optimizeRoute(orders, driverId, mode) {
  const assigned = orders.filter(order => order.assignedDriverId === driverId);
  const sorters = {
    distance: (a, b) => a.distanceKm - b.distanceKm,
    priority: (a, b) => (PRIORITY_RANK[a.priority] ?? 99) - (PRIORITY_RANK[b.priority] ?? 99),
    timeWindow: (a, b) => a.deliveryWindowStart - b.deliveryWindowStart
  };
  return [...assigned].sort(sorters[mode] || sorters.distance);
}

export function computeRouteMetrics(orders, driverId) {
  const assigned = orders.filter(order => order.assignedDriverId === driverId);
  return assigned.reduce((totals, order) => ({
    totalDeliveries: totals.totalDeliveries + 1,
    totalDistance: totals.totalDistance + Number(order.distanceKm || 0),
    totalEstimatedDuration: totals.totalEstimatedDuration + Number(order.estimatedDurationMin || 0),
    highPriorityCount: totals.highPriorityCount + (order.priority === 'high' ? 1 : 0)
  }), { totalDeliveries: 0, totalDistance: 0, totalEstimatedDuration: 0, highPriorityCount: 0 });
}
