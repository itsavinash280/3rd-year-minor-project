import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Order, IOrderItem } from '../models/Order.js';
import { CropListing } from '../models/CropListing.js';
import { Cart } from '../models/Cart.js';
import { Delivery } from '../models/Delivery.js';
import { Notification } from '../models/Notification.js';

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
    let sellerId = items[0].sellerId;

    for (const item of items) {
      const listing = await CropListing.findById(item.listingId);
      if (listing) {
        sellerId = listing.sellerId;
        const itemTotal = listing.pricePerUnit * item.quantity;
        calculatedTotal += itemTotal;
        orderItems.push({
          listingId: listing._id,
          title: listing.title,
          quantity: item.quantity,
          unit: listing.unit,
          pricePerUnit: listing.pricePerUnit,
          totalPrice: itemTotal,
        });

        // Deduct inventory
        listing.quantityAvailable = Math.max(0, listing.quantityAvailable - item.quantity);
        if (listing.quantityAvailable === 0) listing.status = 'SOLD_OUT';
        await listing.save();
      }
    }

    const finalAmount = Math.max(0, calculatedTotal - discountAmount);
    const trackingNumber = 'KS-TRK-' + Math.floor(100000 + Math.random() * 900000);
    const razorpayOrderId = 'order_rzp_' + Date.now();

    const order = await Order.create({
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
        address: `${deliveryAddress.street}, ${deliveryAddress.village}`,
        city: deliveryAddress.district,
        state: deliveryAddress.state,
        phone: deliveryAddress.phone,
      },
      status: 'ASSIGNED',
      statusHistory: [
        {
          status: 'ORDER_PLACED',
          location: deliveryAddress.district,
          note: 'Order confirmed and logistics assigned.',
          timestamp: new Date(),
        },
      ],
    });

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    // Send Notification
    await Notification.create({
      userId: req.user._id,
      title: 'Order Confirmed! 🎉',
      message: `Your agricultural order #${trackingNumber} for ₹${finalAmount} has been placed successfully.`,
      type: 'ORDER',
      link: `/orders/${order._id}`,
    });

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
    let filter: any = {};
    if (req.user.role === 'FARMER') {
      filter = { sellerId: req.user._id };
    } else if (req.user.role === 'BUYER') {
      filter = { buyerId: req.user._id };
    } else if (req.user.role === 'TRANSPORT') {
      filter = { deliveryPartnerId: req.user._id };
    }

    const orders = await Order.find(filter)
      .populate('buyerId', 'name phone email')
      .populate('sellerId', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name phone email')
      .populate('sellerId', 'name phone email');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const delivery = await Delivery.findOne({ orderId: order._id });

    res.status(200).json({ success: true, order, delivery });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    order.orderStatus = status;
    if (status === 'DELIVERED') order.paymentStatus = 'PAID';
    await order.save();

    res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
