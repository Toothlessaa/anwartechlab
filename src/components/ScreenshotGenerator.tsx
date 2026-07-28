import { Camera, Loader2 } from 'lucide-react';

type ScreenshotGeneratorProps = {
  previewUrl: string | null;
  capturing: boolean;
};

export function ScreenshotGenerator({ previewUrl, capturing }: ScreenshotGeneratorProps) {
  return (
    <div className="mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Current website screenshot"
          className="max-h-64 w-full bg-black/20 object-contain object-top"
        />
      ) : (
        <div className="grid min-h-40 place-items-center text-zinc-600">
          <Camera className="h-8 w-8" aria-hidden="true" />
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-sm text-zinc-400">
        {capturing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[#00FF41]" aria-hidden="true" />
            Capturing the project website with Playwright…
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 text-[#00FF41]" aria-hidden="true" />
            A fresh screenshot will be generated automatically when you save.
          </>
        )}
      </div>
    </div>
  );
}
