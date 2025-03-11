import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  console.log(`API Request: ${request.method} ${request.nextUrl.pathname}`);
  
  try {
    // Get user session
    const session = await getServerSession();
    
    // Check if the user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Call the handler with the authenticated session
    return await handler(request, session);
  } catch (error) {
    console.error('API error:', error);
    
    // Return a standardized error response
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function withErrorHandling(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  console.log(`API Request: ${request.method} ${request.nextUrl.pathname}`);
  
  try {
    // Call the handler
    return await handler(request);
  } catch (error) {
    console.error('API error:', error);
    
    // Return a standardized error response
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 