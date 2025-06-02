export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const question = searchParams.get('question');
    const authHeader = request.headers.get('Authorization');

    // Log the incoming request details (for debugging)
    console.log('Incoming request:', {
      question,
      hasAuth: !!authHeader,
      headers: Object.fromEntries(request.headers.entries())
    });

    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question parameter is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Construct the URL with the question parameter
    const url = new URL('https://mtg-ai-server.fly.dev/posts/quest');
    // Use decodeURIComponent to ensure we're not double-encoding
    url.searchParams.append('question', decodeURIComponent(question));

    console.log('Making request to:', url.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
        'HTTP-Referer': 'askugin.com',
        'X-Title': 'Ask Ugin'
      }
    });

    // Log the response status and headers (for debugging)
    console.log('Server response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }

      return new Response(
        JSON.stringify({ 
          error: errorData.message || `Server responded with ${response.status}`,
          details: errorData
        }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch from Ugin server',
        details: error.message
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 