import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (cookies) {
      headers['Cookie'] = cookies;
    }

    // Make the request to the backend
    const response = await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    // Get response data (but don't use it for 204 responses)
    const responseData = await response.text();

    // Create the response - handle 204 status specially
    const nextResponse = response.status === 204
      ? new NextResponse(null, {
          status: 204,
          statusText: response.statusText,
        })
      : new NextResponse(responseData, {
          status: response.status,
          statusText: response.statusText,
        });

    // Forward response headers (especially Set-Cookie)
    response.headers.forEach((value, key) => {
      // Skip headers that Next.js handles automatically
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        nextResponse.headers.set(key, value);
      }
    });

    // Set CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token');

    return nextResponse;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'CSRF request failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token',
    },
  });
}
