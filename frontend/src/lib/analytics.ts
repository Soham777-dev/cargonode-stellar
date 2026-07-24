// Analytics helper for tracking custom events
import { track } from '@vercel/analytics';

export const analytics = {
  // Track shipment creation
  trackShipmentCreated: (data: {
    shipmentId: string;
    amount: string;
    origin: string;
    destination: string;
  }) => {
    track('shipment_created', {
      shipment_id: data.shipmentId,
      amount: data.amount,
      origin: data.origin,
      destination: data.destination,
    });
  },

  // Track shipment acceptance
  trackShipmentAccepted: (data: {
    shipmentId: string;
    driverAddress: string;
  }) => {
    track('shipment_accepted', {
      shipment_id: data.shipmentId,
      driver: data.driverAddress,
    });
  },

  // Track delivery confirmation
  trackDeliveryConfirmed: (data: {
    shipmentId: string;
    amount: string;
  }) => {
    track('delivery_confirmed', {
      shipment_id: data.shipmentId,
      amount: data.amount,
    });
  },

  // Track shipment cancellation
  trackShipmentCancelled: (data: {
    shipmentId: string;
    reason?: string;
  }) => {
    track('shipment_cancelled', {
      shipment_id: data.shipmentId,
      reason: data.reason || 'user_cancelled',
    });
  },

  // Track wallet connection
  trackWalletConnected: (walletAddress: string) => {
    track('wallet_connected', {
      address: walletAddress.substring(0, 8) + '...', // Privacy: only first 8 chars
    });
  },

  // Track errors
  trackError: (error: {
    type: string;
    message: string;
    page?: string;
  }) => {
    track('error_occurred', {
      error_type: error.type,
      error_message: error.message,
      page: error.page || 'unknown',
    });
  },

  // Track page views (automatic with Vercel Analytics, but can add custom data)
  trackPageView: (page: string, additionalData?: Record<string, any>) => {
    track('page_view', {
      page,
      ...additionalData,
    });
  },
};
