import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { fetchAllGalleryItemsRaw, deleteGalleryItem } from '../../lib/data';
import { storageAsset } from '../../lib/assets';

function parseImages(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0);
    } catch {
      return value ? [value] : [];
    }
  }
  return [];
}

export default function GalleryList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchAllGalleryItemsRaw();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, imagePath?: unknown) {
    if (!confirm('Delete this media post? This cannot be undone.')) return;
    try {
      const images = parseImages(imagePath);
      await deleteGalleryItem(id, images);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  const categoryColors: Record<string, string> = {
    Update: 'text-[#00FF41] border-[#00FF41]/30 bg-[#00FF41]/10',
    Launch: 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10',
    Event: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
    Team: 'text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10',
    'Behind the Scenes': 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00FF41] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.04em] text-white">Media</h1>
          <p className="mt-1 text-sm text-zinc-400">{items.length} post{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/admin/gallery/new"
          className="flex items-center gap-2 rounded-xl bg-[#00FF41] px-4 py-2.5 text-sm font-bold text-[#09090B] transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-white/10 p-12 text-center">
          <p className="text-zinc-500">No media posts yet.</p>
          <Link to="/admin/gallery/new" className="mt-2 inline-block text-sm text-[#00FF41] hover:underline">
            Create your first media post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const cat = (item.category as string) || '';
            const imageList = parseImages(item.images);
            const primaryImage = imageList[0] || (typeof item.image === 'string' ? item.image : '');
            const imgUrl = primaryImage ? storageAsset(primaryImage) : null;
            const summary = (item.summary as string) || (item.description as string) || '';
            return (
              <div
                key={item.id as string}
                className="flex items-center gap-4 rounded-[16px] border border-white/10 bg-[#1d1d23]/60 p-4 transition-colors hover:border-[#00FF41]/25"
              >
                <div className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/5">
                  {imgUrl ? (
                    <img src={imgUrl} alt="" className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-white">{item.title as string}</h3>
                    {cat && (
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[cat] || 'text-zinc-400 border-white/10 bg-white/5'}`}>
                        {cat}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{summary}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-600">{item.date as string}{imageList.length > 1 ? ` • ${imageList.length} images` : ''}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/admin/gallery/${item.id}/edit`)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-[#00FF41]/10 hover:text-[#00FF41]"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id as string, imageList.length ? imageList : item.image)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
