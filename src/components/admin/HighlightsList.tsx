import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, Edit3, Eye, EyeOff, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { deleteHighlight, deleteImage, fetchAllHighlights, reorderHighlights, updateHighlight } from '../../lib/data';
import { storageAsset } from '../../lib/assets';
import type { Highlight } from '../../types';

export default function HighlightsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      setItems(await fetchAllHighlights());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load highlights');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function handleToggle(item: Highlight) {
    setBusyId(item.id);
    setError('');
    try {
      const updated = await updateHighlight(item.id, { is_active: !item.is_active });
      setItems((current) => current.map((entry) => entry.id === item.id ? updated : entry));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update highlight');
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex]!, reordered[index]!];
    setBusyId(items[index]!.id);
    setError('');
    try {
      await reorderHighlights(reordered.map((item) => item.id));
      setItems(reordered.map((item, order) => ({ ...item, sort_order: order })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder highlights');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(item: Highlight) {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setBusyId(item.id);
    setError('');
    try {
      await deleteHighlight(item.id);
      if (item.image_url && !item.image_url.startsWith('http')) await deleteImage(item.image_url).catch(() => undefined);
      const remaining = items.filter((entry) => entry.id !== item.id);
      setItems(remaining);
      if (remaining.length) await reorderHighlights(remaining.map((entry) => entry.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete highlight');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <div className="space-y-3 py-8">{[0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-[16px] border border-white/10 bg-white/5" />)}</div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.04em] text-white">Highlights</h1>
          <p className="mt-1 text-sm text-zinc-400">{items.length} slide{items.length !== 1 ? 's' : ''} in carousel order</p>
        </div>
        <Link to="/admin/highlights/new" className="flex items-center gap-2 rounded-xl bg-[#00FF41] px-4 py-2.5 text-sm font-bold text-[#09090B] transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />New Highlight
        </Link>
      </div>

      {error ? <div role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div> : null}

      {!items.length ? (
        <div className="rounded-[20px] border border-dashed border-white/10 p-12 text-center">
          <ImageIcon className="mx-auto h-6 w-6 text-zinc-600" />
          <p className="mt-3 text-zinc-500">No highlights yet.</p>
          <Link to="/admin/highlights/new" className="mt-2 inline-block text-sm text-[#00FF41] hover:underline">Create the first highlight</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <article key={item.id} className="flex flex-wrap items-center gap-4 rounded-[16px] border border-white/10 bg-[#1d1d23]/60 p-4 transition-colors hover:border-[#00FF41]/25 sm:flex-nowrap">
              <div className="grid h-16 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/5">
                {item.image_url ? <img src={storageAsset(item.image_url)} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-zinc-600" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-sm font-bold text-white">{item.title}</h2>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.is_active ? 'border-[#00FF41]/30 bg-[#00FF41]/10 text-[#00FF41]' : 'border-white/10 bg-white/5 text-zinc-500'}`}>{item.is_active ? 'Active' : 'Hidden'}</span>
                </div>
                <p className="mt-1 truncate text-xs text-zinc-500">{item.subtitle || item.description || 'No supporting text'}</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" disabled={index === 0 || busyId !== null} onClick={() => void handleMove(index, -1)} aria-label={`Move ${item.title} up`} className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-[#00FF41]/10 hover:text-[#00FF41] disabled:opacity-25"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" disabled={index === items.length - 1 || busyId !== null} onClick={() => void handleMove(index, 1)} aria-label={`Move ${item.title} down`} className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-[#00FF41]/10 hover:text-[#00FF41] disabled:opacity-25"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" disabled={busyId !== null} onClick={() => void handleToggle(item)} aria-label={`${item.is_active ? 'Hide' : 'Show'} ${item.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-[#00FF41]/10 hover:text-[#00FF41] disabled:opacity-25">{item.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                <button type="button" onClick={() => navigate(`/admin/highlights/${item.id}/edit`)} aria-label={`Edit ${item.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-[#00FF41]/10 hover:text-[#00FF41]"><Edit3 className="h-4 w-4" /></button>
                <button type="button" disabled={busyId !== null} onClick={() => void handleDelete(item)} aria-label={`Delete ${item.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-25"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
