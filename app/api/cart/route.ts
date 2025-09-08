import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Item from '@/models/Item';
import mongoose from 'mongoose';

interface CartItem {
  item: mongoose.Types.ObjectId;
  quantity: number;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get('userId');
    console.log('Cart API - userId from header:', userId); // Debug log
    if (!userId) {
      console.log('Cart API - No userId in header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId).populate('cart.item');
    console.log('Cart API - User found:', user ? user._id : 'null'); // Debug log
    if (!user) {
      console.log('Cart API - User not found for ID:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.cart, { status: 200 });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get('userId');
    const { itemId, quantity = 1 } = await req.json();

    console.log('Cart API POST - userId:', userId, 'itemId:', itemId); // Debug log
    if (!userId) {
      console.log('Cart API POST - No userId in header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('Cart API POST - User not found for ID:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cartItemIndex = user.cart.findIndex((ci: CartItem) => ci.item.toString() === itemId);
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ item: itemId, quantity });
    }

    await user.save();
    await user.populate('cart.item');
    return NextResponse.json(user.cart, { status: 200 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get('userId');
    const { itemId } = await req.json();

    console.log('Cart API DELETE - userId:', userId, 'itemId:', itemId); // Debug log
    if (!userId) {
      console.log('Cart API DELETE - No userId in header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('Cart API DELETE - User not found for ID:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.cart = user.cart.filter((ci: CartItem) => ci.item.toString() !== itemId);
    await user.save();
    await user.populate('cart.item');
    return NextResponse.json(user.cart, { status: 200 });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}