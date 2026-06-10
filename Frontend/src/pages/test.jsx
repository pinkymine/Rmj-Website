// Test data for OrderTrackingForm component

// Valid order tracking test cases
const validOrderTests = [
    {
      orderNumber: "ORD-12345678",
      contactMethod: "Email",
      contactInfo: "customer@example.com",
      expectedResult: {
        orderNumber: "ORD-12345678",
        status: "In Transit",
        estimatedDelivery: "2025-03-28",
        items: ["Product 1", "Product 2"],
        lastUpdate: "2025-03-24 10:30 AM",
        location: "Distribution Center, Atlanta GA"
      }
    },
    {
      orderNumber: "ORD-87654321",
      contactMethod: "Phone",
      contactInfo: "555-123-4567",
      expectedResult: {
        orderNumber: "ORD-87654321",
        status: "Delivered",
        estimatedDelivery: "2025-03-22",
        items: ["Premium Item", "Standard Item"],
        lastUpdate: "2025-03-22 2:15 PM",
        location: "Delivered to front door"
      }
    },
    {
      orderNumber: "ORD-11223344",
      contactMethod: "Email",
      contactInfo: "another@example.com",
      expectedResult: {
        orderNumber: "ORD-11223344",
        status: "Processing",
        estimatedDelivery: "2025-04-01",
        items: ["Backordered Item"],
        lastUpdate: "2025-03-23 9:45 AM",
        location: "Warehouse, Chicago IL"
      }
    }
  ];
  
  // Valid tracking number test cases
  const validTrackingTests = [
    {
      trackingNumber: "TRK-1234567890",
      expectedResult: {
        trackingNumber: "TRK-1234567890",
        carrier: "FastShip Express",
        status: "Out for Delivery",
        estimatedDelivery: "2025-03-25",
        trackingHistory: [
          { date: "2025-03-24 08:15 AM", status: "Out for Delivery", location: "Local Delivery Center" },
          { date: "2025-03-23 10:30 PM", status: "Arrived at Delivery Facility", location: "City Distribution Center" },
          { date: "2025-03-22 02:45 PM", status: "In Transit", location: "Regional Hub" }
        ]
      }
    },
    {
      trackingNumber: "TRK-0987654321",
      expectedResult: {
        trackingNumber: "TRK-0987654321",
        carrier: "Global Logistics",
        status: "Delivered",
        estimatedDelivery: "2025-03-20",
        trackingHistory: [
          { date: "2025-03-20 11:32 AM", status: "Delivered", location: "Front Door" },
          { date: "2025-03-20 08:45 AM", status: "Out for Delivery", location: "Local Delivery Center" },
          { date: "2025-03-19 09:20 PM", status: "Arrived at Delivery Facility", location: "City Distribution Center" },
          { date: "2025-03-18 02:15 PM", status: "In Transit", location: "Regional Hub" },
          { date: "2025-03-17 10:30 AM", status: "Shipment Picked Up", location: "Shipping Origin" }
        ]
      }
    },
    {
      trackingNumber: "TRK-ABCD123456",
      expectedResult: {
        trackingNumber: "TRK-ABCD123456",
        carrier: "Premium Courier",
        status: "In Transit",
        estimatedDelivery: "2025-03-26",
        trackingHistory: [
          { date: "2025-03-24 01:45 PM", status: "In Transit", location: "International Processing Center" },
          { date: "2025-03-23 08:00 AM", status: "Departed Processing Center", location: "Origin Country" },
          { date: "2025-03-22 11:20 AM", status: "Processing", location: "Origin Facility" }
        ]
      }
    }
  ];
  
  // Error test cases
  const errorTests = [
    {
      type: "order",
      orderNumber: "", // Empty order number
      contactMethod: "Email",
      contactInfo: "customer@example.com",
      expectedError: "Invalid order information"
    },
    {
      type: "order",
      orderNumber: "ORD-12345678",
      contactMethod: "Email",
      contactInfo: "", // Empty contact info
      expectedError: "Invalid order information"
    },
    {
      type: "tracking",
      trackingNumber: "", // Empty tracking number
      expectedError: "Invalid tracking number"
    },
    {
      type: "order",
      orderNumber: "INVALID-FORMAT", 
      contactMethod: "Email",
      contactInfo: "customer@example.com",
      expectedError: "Order not found"
    },
    {
      type: "tracking",
      trackingNumber: "NOT-REAL-TRACKING",
      expectedError: "Tracking information not found"
    }
  ];
  
  // Mock API responses for different order statuses
  const orderStatusResponses = {
    processing: {
      orderNumber: "ORD-33445566",
      status: "Processing",
      estimatedDelivery: "2025-04-02",
      items: ["New Product", "Special Item"],
      lastUpdate: "2025-03-24 09:15 AM",
      location: "Order Processing Center"
    },
    shipped: {
      orderNumber: "ORD-55667788",
      status: "Shipped",
      estimatedDelivery: "2025-03-30",
      items: ["Tech Gadget", "Accessory Pack"],
      lastUpdate: "2025-03-23 03:45 PM",
      location: "Departed from Regional Distribution Center"
    },
    delayed: {
      orderNumber: "ORD-77889900",
      status: "Delayed",
      estimatedDelivery: "2025-04-05", // Original was 2025-04-01
      items: ["Specialty Product"],
      lastUpdate: "2025-03-24 11:00 AM",
      location: "Delayed at Customs Inspection"
    },
    delivered: {
      orderNumber: "ORD-99001122",
      status: "Delivered",
      estimatedDelivery: "2025-03-23",
      items: ["Regular Item", "Standard Product", "Gift Item"],
      lastUpdate: "2025-03-23 02:30 PM",
      location: "Delivered - Signed by recipient"
    }
  };
  
  // Enhanced tracking history for different scenarios
  const enhancedTrackingHistories = {
    international: [
      { date: "2025-03-24 03:15 PM", status: "Cleared Customs", location: "Los Angeles International Airport" },
      { date: "2025-03-23 11:30 PM", status: "Arrived at Customs", location: "Los Angeles International Airport" },
      { date: "2025-03-22 08:45 PM", status: "Departed Origin Country", location: "Tokyo International Airport" },
      { date: "2025-03-22 10:30 AM", status: "Processing at Export Facility", location: "Tokyo Distribution Center" },
      { date: "2025-03-21 02:15 PM", status: "Shipment Picked Up", location: "Shibuya, Tokyo" }
    ],
    delayed: [
      { date: "2025-03-24 10:15 AM", status: "Delayed", location: "Weather Conditions at Chicago Hub" },
      { date: "2025-03-23 08:30 PM", status: "In Transit", location: "En Route to Chicago Hub" },
      { date: "2025-03-22 04:45 PM", status: "Departed Facility", location: "Regional Distribution Center" },
      { date: "2025-03-21 09:30 AM", status: "Processing", location: "Shipping Origin" }
    ],
    overnight: [
      { date: "2025-03-24 09:30 AM", status: "Delivered", location: "Front Door" },
      { date: "2025-03-24 07:15 AM", status: "Out for Delivery", location: "Local Delivery Center" },
      { date: "2025-03-24 02:30 AM", status: "Arrived at Delivery Facility", location: "City Distribution Center" },
      { date: "2025-03-23 08:45 PM", status: "In Transit", location: "Overnight Express Network" },
      { date: "2025-03-23 06:00 PM", status: "Shipment Picked Up", location: "Origin Facility" }
    ]
  };
  
  // Function to create modified fetchOrderStatus and fetchTrackingStatus functions with test data
  const createTestApiFunctions = (testData) => {
    return {
      fetchOrderStatus: async (orderNum, method, info) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Find matching test data or return error
            const testCase = testData.validOrderTests.find(test => 
              test.orderNumber === orderNum && 
              test.contactMethod === method && 
              test.contactInfo === info
            );
            
            if (testCase) {
              resolve(testCase.expectedResult);
            } else if (!orderNum || !info) {
              reject(new Error('Invalid order information'));
            } else {
              reject(new Error('Order not found'));
            }
          }, 1500);
        });
      },
      
      fetchTrackingStatus: async (trackingNum) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Find matching test data or return error
            const testCase = testData.validTrackingTests.find(test => 
              test.trackingNumber === trackingNum
            );
            
            if (testCase) {
              resolve(testCase.expectedResult);
            } else if (!trackingNum) {
              reject(new Error('Invalid tracking number'));
            } else {
              reject(new Error('Tracking information not found'));
            }
          }, 1500);
        });
      }
    };
  };
  
  // Export all test data
  export {
    validOrderTests,
    validTrackingTests,
    errorTests,
    orderStatusResponses,
    enhancedTrackingHistories,
    createTestApiFunctions
  };