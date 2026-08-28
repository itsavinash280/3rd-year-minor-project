import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Order, IOrderItem } from '../models/Order.js';
import { CropListing } from '../models/CropListing.js';
import { Cart } from '../models/Cart.js';
import { Delivery } from '../models/Delivery.js';
import { Notification } from '../models/Notification.js';
import { isMongoConnected } from '../config/db.js';
import { fallbackListings } from './marketplaceController.js';

export const inMemoryOrders: any[] = [];
export const inMemoryDeliveries: any[] = [];

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const { items, deliveryAddress, paymentMethod, couponCode, discountAmount = 0 } = req.body;

    if (!items || !items.length || !deliveryAddress) {
      res.status(400).json({ success: false, message: 'Cart items and delivery address are required.' });
      return;
    }

    let calculatedTotal = 0;
    const orderItems: IOrderItem[] = [];
    let sellerId = items[0]?.sellerId;

    for (const item of items) {
      let listing: any = null;
      if (isMongoConnected()) {
        try {
          listing = await CropListing.findById(item.listingId);
        } catch (err) {
          // ignore
        }
      }
      if (!listing) {
        listing = fallbackListings.find((l) => l._id === item.listingId || l.id === item.listingId);
      }

      const unitPrice = listing ? listing.pricePerUnit : (item.pricePerUnit || 2000);
      sellerId = listing?.sellerId?._id || listing?.sellerId || sellerId || req.user._id || req.user.id;
      const itemTotal = unitPrice * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        listingId: listing?._id || item.listingId,
        title: listing?.title || item.title || 'Agricultural Crop',
        quantity: item.quantity,
        unit: listing?.unit || 'QUINTAL',
        pricePerUnit: unitPrice,
        totalPrice: itemTotal,
      });

      if (listing && isMongoConnected() && typeof listing.save === 'function') {
        try {
          listing.quantityAvailable = Math.max(0, listing.quantityAvailable - item.quantity);
          if (listing.quantityAvailable === 0) listing.status = 'SOLD_OUT';
          await listing.save();
        } catch (err) {
          // ignore
        }
      }
    }

    const finalAmount = Math.max(0, calculatedTotal - discountAmount);
    const trackingNumber = 'KS-TRK-' + Math.floor(100000 + Math.random() * 900000);
    const razorpayOrderId = 'order_rzp_' + Date.now();
    let order: any = null;

    if (isMongoConnected()) {
      try {
        order = await Order.create({
          buyerId: req.user._id,
          sellerId: sellerId || req.user._id,
          items: orderItems,
          totalAmount: calculatedTotal,
          discountAmount,
          finalAmount,
          couponCode,
          deliveryAddress,
          orderStatus: 'CONFIRMED',
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          paymentMethod: paymentMethod || 'UPI',
          razorpayOrderId,
          razorpayPaymentId: 'pay_rzp_mock_' + Math.floor(100000 + Math.random() * 900000),
          trackingNumber,
          invoiceUrl: `/api/orders/invoice/${trackingNumber}`,
        });

        // Create delivery record
        await Delivery.create({
          orderId: order._id,
          pickupLocation: {
            address: 'Malihabad Farmers Hub, Gate #4',
            city: 'Lucknow',
            state: 'Uttar Pradesh',
            phone: '+91 98765 12345',
          },
          dropLocation: {
            address: `${deliveryAddress.street || ''}, ${deliveryAddress.village || ''}`,
            city: deliveryAddress.district || 'Lucknow',
            state: deliveryAddress.state || 'Uttar Pradesh',
            phone: deliveryAddress.phone || '+91 98765 00000',
          },
          status: 'ASSIGNED',
          statusHistory: [
            {
              status: 'ORDER_PLACED',
              location: deliveryAddress.district || 'Lucknow',
              note: 'Order confirmed and logistics assigned.',
              timestamp: new Date(),
            },
          ],
        });

        // Clear cart
        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] }).catch(() => {});

        // Send Notification
        await Notification.create({
          userId: req.user._id,
          title: 'Order Confirmed! 🎉',
          message: `Your agricultural order #${trackingNumber} for ₹${finalAmount} has been placed successfully.`,
          type: 'ORDER',
          link: `/orders/${order._id}`,
        }).catch(() => {});
      } catch (dbErr) {
        console.warn('[MongoDB Create Order Fallback]:', dbErr);
      }
    }

    if (!order) {
      order = {
        _id: 'ord-' + Date.now(),
        id: 'ord-' + Date.now(),
        buyerId: {
          _id: req.user._id || req.user.id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
        },
        sellerId: sellerId || req.user._id || req.user.id,
        items: orderItems,
        totalAmount: calculatedTotal,
        discountAmount,
        finalAmount,
        couponCode,
        deliveryAddress,
        orderStatus: 'CONFIRMED',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        paymentMethod: paymentMethod || 'UPI',
        razorpayOrderId,
        razorpayPaymentId: 'pay_rzp_mock_' + Math.floor(100000 + Math.random() * 900000),
        trackingNumber,
        invoiceUrl: `/api/orders/invoice/${trackingNumber}`,
        createdAt: new Date(),
      };
      inMemoryOrders.unshift(order);

      const delivery = {
        _id: 'del-' + Date.now(),
        orderId: order._id,
        pickupLocation: {
          address: 'Malihabad Farmers Hub, Gate #4',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          phone: '+91 98765 12345',
        },
        dropLocation: {
          address: `${deliveryAddress.street || ''}, ${deliveryAddress.village || ''}`,
          city: deliveryAddress.district || 'Lucknow',
          state: deliveryAddress.state || 'Uttar Pradesh',
          phone: deliveryAddress.phone || '+91 98765 00000',
        },
        status: 'ASSIGNED',
        statusHistory: [
          {
            status: 'ORDER_PLACED',
            location: deliveryAddress.district || 'Lucknow',
            note: 'Order confirmed and logistics assigned.',
            timestamp: new Date(),
          },
        ],
      };
      inMemoryDeliveries.unshift(delivery);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order,
      razorpayOrderId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    let orders: any[] = [];
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongoConnected()) {
      try {
        let filter: any = {};
        if (req.user.role === 'FARMER') {
          filter = { sellerId: req.user._id };
        } else if (req.user.role === 'BUYER') {
          filter = { buyerId: req.user._id };
        } else if (req.user.role === 'TRANSPORT') {
          filter = { deliveryPartnerId: req.user._id };
        }

        orders = await Order.find(filter)
          .populate('buyerId', 'name phone email')
          .populate('sellerId', 'name phone email')
          .sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('[MongoDB Get Orders Fallback]:', dbErr);
      }
    }

    if (!orders || orders.length === 0) {
      orders = inMemoryOrders.filter(
        (o) =>
          !req.user ||
          req.user.role === 'ADMIN' ||
          (o.buyerId?._id || o.buyerId) === userId ||
          (o.sellerId?._id || o.sellerId) === userId
      );
    }

    res.status(200).json({ success: true, orders });
  } catch (error: any) {
    res.status(200).json({ success: true, orders: inMemoryOrders });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let order: any = null;
    let delivery: any = null;

    if (isMongoConnected()) {
      try {
        order = await Order.findById(req.params.id)
          .populate('buyerId', 'name phone email')
          .populate('sellerId', 'name phone email');

        if (order) {
          delivery = await Delivery.findOne({ orderId: order._id });
        }
      } catch (dbErr) {
        console.warn('[MongoDB Get Order ID Fallback]:', dbErr);
      }
    }

    if (!order) {
      order = inMemoryOrders.find((o) => o._id === req.params.id || o.id === req.params.id);
      delivery = inMemoryDeliveries.find((d) => d.orderId === req.params.id || d.orderId === order?._id);
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.status(200).json({ success: true, order, delivery });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    let order: any = null;

    if (isMongoConnected()) {
      try {
        order = await Order.findById(req.params.id);
        if (order) {
          order.orderStatus = status;
          if (status === 'DELIVERED') order.paymentStatus = 'PAID';
          await order.save();
        }
      } catch (dbErr) {
        console.warn('[MongoDB Update Order Status Fallback]:', dbErr);
      }
    }

    if (!order) {
      const found = inMemoryOrders.find((o) => o._id === req.params.id || o.id === req.params.id);
      if (found) {
        found.orderStatus = status;
        if (status === 'DELIVERED') found.paymentStatus = 'PAID';
        order = found;
      }
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
