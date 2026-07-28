type ScreenshotError = {
  error?: string;
};

export async function captureWebsiteScreenshot(url: string): Promise<File> {
  const response = await fetch('/api/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as ScreenshotError | null;
    throw new Error(payload?.error || 'Playwright could not capture the project website.');
  }

  const blob = await response.blob();
  if (blob.type !== 'image/png' || blob.size === 0) {
    throw new Error('The screenshot service returned an invalid image.');
  }

  const hostname = new URL(url).hostname.replace(/[^a-z0-9]+/gi, '-');
  return new File([blob], `${hostname || 'website'}-${Date.now()}.png`, {
    type: 'image/png',
  });
}
