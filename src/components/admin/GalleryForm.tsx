import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { fetchGalleryItemById, createGalleryItem, updateGalleryItem, uploadImage } from '../../lib/data';
import { relativeStoragePath, storageAsset } from '../../lib/assets';

const categories = ['Update', 'Launch', 'Event', 'Team', 'Behind the Scenes'];

export default function GalleryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Update');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    fetchGalleryItemById(id!).then((item) => {
      if (!item) {
        navigate('/admin/gallery');
        return;
      }
      setTitle(item.title);
      setCategory(item.category || 'Update');
      setSummary(item.summary || item.description);
      setContent(item.content || item.description);
      setDate(item.date || new Date().toISOString().split('T')[0]);
      setImagePaths(item.images.length ? item.images.map(relativeStoragePath) : item.image ? [relativeStoragePath(item.image)] : []);
    });
  }, [id, isEdit, navigate]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError('');
    try {
      const uploadedPaths = await Promise.all(files.map((file) => uploadImage(file, 'gallery')));
      setImagePaths((current) => [...current, ...uploadedPaths.filter((path) => !current.includes(path))]);
      e.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(path: string) {
    setImagePaths((current) => current.filter((item) => item !== path));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!title.trim()) throw new Error('Title is required');
      if (!summary.trim()) throw new Error('Summary is required');
      if (!content.trim()) throw new Error('Content is required');

      const data = {
        title: title.trim(),
        category,
        summary: summary.trim(),
        content: content.trim(),
        description: summary.trim(),
        image: imagePaths[0] || '',
        images: imagePaths,
        date,
      };

      if (isEdit) {
        await updateGalleryItem(id!, data);
      } else {
        await createGalleryItem(data);
      }

      navigate('/admin/gallery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/gallery')} className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#00FF41]">
        <ArrowLeft className="h-4 w-4" />
        Back to Media
      </button>

      <h1 className="text-2xl font-black tracking-[-0.04em] text-white">{isEdit ? 'Edit Media Post' : 'New Media Post'}</h1>

      {error && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">Type</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF41]/50"
            >
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Short Summary *</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
              placeholder="Short preview text for the right-side post list and the main hero summary."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Full Content *</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
              placeholder="Write the full post here. Use blank lines to create paragraph breaks."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Media Images</label>
            <div className="mt-1.5 space-y-3">
              {imagePaths.length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {imagePaths.map((path, index) => (
                    <div key={path} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <img src={storageAsset(path)} alt={`Media ${index + 1}`} className="h-32 w-full object-cover" />
                      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2 text-xs text-zinc-400">
                        <span>{index === 0 ? 'Cover image' : `Image ${index + 1}`}</span>
                        <button type="button" onClick={() => removeImage(path)} className="rounded-full p-1 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400" aria-label={`Remove image ${index + 1}`}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-[#00FF41]/40 hover:text-[#00FF41]">
                <Upload className={`h-4 w-4 ${uploading ? 'animate-pulse' : ''}`} />
                {uploading ? 'Uploading…' : imagePaths.length ? 'Add more images' : 'Upload images'}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#00FF41] px-6 py-2.5 text-sm font-bold text-[#09090B] transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
          <button type="button" onClick={() => navigate('/admin/gallery')} className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-[#00FF41]/35 hover:bg-[#00FF41]/10 hover:text-[#00FF41]">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
