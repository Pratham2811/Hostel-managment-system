// Simple mock API service for the MVP

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const hostels = [
  { id: 1, name: 'North Block', address: '123 Campus Road', capacity: 50, occupiedRooms: 42 },
  { id: 2, name: 'South Block', address: '456 Campus Road', capacity: 60, occupiedRooms: 48 },
  { id: 3, name: 'East Block', address: '789 Campus Road', capacity: 40, occupiedRooms: 32 },
  { id: 4, name: 'West Block', address: '101 Campus Road', capacity: 45, occupiedRooms: 38 },
];

const rooms = [
  { id: 1, number: 'A101', hostelId: 1, type: 'Single', price: 500, status: 'Occupied' },
  { id: 2, number: 'A102', hostelId: 1, type: 'Double', price: 400, status: 'Available' },
  { id: 3, number: 'B201', hostelId: 2, type: 'Single', price: 550, status: 'Occupied' },
  { id: 4, number: 'C101', hostelId: 3, type: 'Single', price: 450, status: 'Maintenance' },
];

const bookings = [
  { id: 'B001', studentId: 1, roomId: 1, checkIn: '2025-01-01', checkOut: '2025-05-31', status: 'Active' },
  { id: 'B002', studentId: 2, roomId: 3, checkIn: '2025-02-01', checkOut: '2025-06-30', status: 'Active' },
  { id: 'B003', studentId: 3, roomId: null, checkIn: '2025-05-01', checkOut: '2025-09-30', status: 'Pending' },
];

const students = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
  { id: 3, name: 'Robert Brown', email: 'robert@example.com', phone: '345-678-9012' },
];

// API functions
const api = {
  // Auth
  login: async (email, password) => {
    await delay(500);
    if (email === 'admin@example.com' && password === 'password') {
      return { success: true, user: { id: 1, name: 'Admin User', email, role: 'admin' } };
    }
    throw new Error('Invalid credentials');
  },

  // Hostels
  getHostels: async () => {
    await delay(300);
    return [...hostels];
  },
  
  getHostelById: async (id) => {
    await delay(200);
    const hostel = hostels.find(h => h.id === id);
    if (!hostel) throw new Error('Hostel not found');
    return {...hostel};
  },

  // Rooms
  getRooms: async (filters = {}) => {
    await delay(300);
    let filteredRooms = [...rooms];
    
    if (filters.hostelId) {
      filteredRooms = filteredRooms.filter(r => r.hostelId === filters.hostelId);
    }
    
    if (filters.status) {
      filteredRooms = filteredRooms.filter(r => r.status === filters.status);
    }
    
    return filteredRooms;
  },

  // Bookings
  getBookings: async () => {
    await delay(300);
    // Join with student data for display
    return bookings.map(booking => {
      const student = students.find(s => s.id === booking.studentId);
      const room = rooms.find(r => r.id === booking.roomId);
      const hostel = room ? hostels.find(h => h.id === room.hostelId) : null;
      
      return {
        ...booking,
        student: student ? student.name : 'Unknown',
        room: room ? room.number : 'Unassigned',
        hostel: hostel ? hostel.name : 'Unassigned'
      };
    });
  },

  // Dashboard
  getDashboardStats: async () => {
    await delay(200);
    return {
      totalHostels: hostels.length,
      totalRooms: rooms.length,
      availableRooms: rooms.filter(r => r.status === 'Available').length,
      occupiedRooms: rooms.filter(r => r.status === 'Occupied').length,
      pendingBookings: bookings.filter(b => b.status === 'Pending').length,
    };
  }
};

export default api;