import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { dimensions } = await params;
  const [width, height] = dimensions;

  // Redirect to a placeholder image service
  const placeholderUrl = `https://picsum.photos/${width}/${height}`;

  return NextResponse.redirect(placeholderUrl);
}
