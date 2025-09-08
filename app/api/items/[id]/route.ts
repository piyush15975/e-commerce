import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Item from '@/models/Item';

type Params = { id: string };

export async function GET(
  req: NextRequest,
  context: { params: Params }
): Promise<NextResponse> {
  const { id } = context.params;
  try {
    await connectDB();
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Get item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Params }
): Promise<NextResponse> {
  const { id } = context.params;
  try {
    await connectDB();
    const { name, description, price, category, image } = await req.json();

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price !== undefined ? price : item.price;
    item.category = category || item.category;
    item.image = image || item.image;

    await item.save();
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Update item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Params }
): Promise<NextResponse> {
  const { id } = context.params;
  try {
    await connectDB();
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Item deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
