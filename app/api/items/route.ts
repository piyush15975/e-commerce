import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Item from '@/models/Item';

// Define interface for query to avoid using 'any'
interface ItemQuery {
  price?: { $gte?: number; $lte?: number };
  category?: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const category = searchParams.get('category');

    const query: ItemQuery = {};
    if (minPrice !== undefined) query.price = { ...query.price, $gte: minPrice };
    if (maxPrice !== undefined) query.price = { ...query.price, $lte: maxPrice };
    if (category) query.category = category;

    const items = await Item.find(query);
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Get items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, description, price, category, image } = await req.json();

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = new Item({ name, description, price, category, image });
    await item.save();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Create item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}