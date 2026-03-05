import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path;
  
  if (!path || path.length < 2) {
    return new NextResponse('Invalid path', { status: 400 });
  }

  const channel = path[0]; // 'cnn' or 'cnbc'
  const restOfPath = path.slice(1).join('/');
  
  let targetBaseUrl = '';
  if (channel === 'cnn') {
    targetBaseUrl = 'https://live.cnnindonesia.com';
  } else if (channel === 'cnbc') {
    targetBaseUrl = 'https://live.cnbcindonesia.com';
  } else if (channel === 'transtv') {
    targetBaseUrl = 'https://video.detik.com';
  } else if (channel === 'trans7') {
    targetBaseUrl = 'https://video.detik.com';
  } else if (channel === 'indonesiana') {
    targetBaseUrl = 'https://tvstreamcast.com';
  } else {
    return new NextResponse('Unknown channel', { status: 404 });
  }

  const targetUrl = `${targetBaseUrl}/${restOfPath}`;
  console.log('Proxying to:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Proxy error: ${response.status} ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    
    // If it's an m3u8 playlist, we might need to rewrite URLs, but wait!
    // If the browser requests /api/proxy/cnn/livecnn/smil:cnntv.smil/playlist.m3u8
    // and the playlist contains relative URLs like chunklist_w1370729302_b384000_sleng.m3u8
    // The browser will automatically resolve it to:
    // /api/proxy/cnn/livecnn/smil:cnntv.smil/chunklist_w1370729302_b384000_sleng.m3u8
    // Which will hit our proxy again! So we DON'T need to rewrite URLs inside the m3u8!
    // The browser handles relative URLs perfectly.

    // We just need to stream the response back.
    const headers = new Headers();
    if (contentType) headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
  }
}
