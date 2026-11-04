export const INITIAL_DRIVERS = [
  { id: 'd1', name: 'Alice Chen', vehicleType: 'Van', maxCapacity: 3 },
  { id: 'd2', name: 'Bob Reyes', vehicleType: 'Truck', maxCapacity: 4 },
  { id: 'd3', name: 'Sara Kim', vehicleType: 'Bike', maxCapacity: 2 }
];

export const INITIAL_ORDERS = [
  { id: 'ORD-001', address: '12 Maple St', distanceKm: 3.2, priority: 'high', deliveryWindowStart: 800, deliveryWindowEnd: 1000, estimatedDurationMin: 12, assignedDriverId: null },
  { id: 'ORD-002', address: '45 Oak Ave', distanceKm: 7.8, priority: 'low', deliveryWindowStart: 1200, deliveryWindowEnd: 1400, estimatedDurationMin: 25, assignedDriverId: null },
  { id: 'ORD-003', address: '9 Pine Rd', distanceKm: 1.5, priority: 'medium', deliveryWindowStart: 900, deliveryWindowEnd: 1100, estimatedDurationMin: 8, assignedDriverId: null },
  { id: 'ORD-004', address: '77 Cedar Blvd', distanceKm: 5.0, priority: 'high', deliveryWindowStart: 700, deliveryWindowEnd: 900, estimatedDurationMin: 18, assignedDriverId: null },
  { id: 'ORD-005', address: '33 Birch Lane', distanceKm: 11.2, priority: 'medium', deliveryWindowStart: 1100, deliveryWindowEnd: 1300, estimatedDurationMin: 35, assignedDriverId: null },
  { id: 'ORD-006', address: '88 Elm Court', distanceKm: 2.4, priority: 'low', deliveryWindowStart: 1400, deliveryWindowEnd: 1600, estimatedDurationMin: 10, assignedDriverId: null },
  { id: 'ORD-007', address: '5 Willow Way', distanceKm: 6.6, priority: 'high', deliveryWindowStart: 830, deliveryWindowEnd: 1030, estimatedDurationMin: 22, assignedDriverId: null },
  { id: 'ORD-008', address: '21 Spruce Dr', distanceKm: 4.1, priority: 'medium', deliveryWindowStart: 1000, deliveryWindowEnd: 1200, estimatedDurationMin: 15, assignedDriverId: null }
];
