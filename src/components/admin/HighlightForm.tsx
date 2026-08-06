import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { createHighlight, deleteImage, fetchAllHighlights, fetchHighlightById, updateHighlight, uploadImage } from '../../lib/data';
import { storageAsset } from '../../lib/assets';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function HighlightForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateText, setDateText] = useState('');
  const [location, setLocation] = useState('');
  const [href, setHref] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [originalImagePath, setOriginalImagePath] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    fetchHighlightById(id!).then((item) => {
      if (!item) { navigate('/admin/highlights'); return; }
      setTitle(item.title);
      setSubtitle(item.subtitle);
      setDescription(item.description);
      setDateText(item.date_text);
      setLocation(item.location);
      setHref(item.href);
      setImagePath(item.image_url);
      setOriginalImagePath(item.image_url);
      setIsActive(item.is_active);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load highlight'));
  }, [id, isEdit, navigate]);

  useEffect(() => {
    if (!imageFile) { setPreviewUrl(''); return; }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function handleFile(file?: File) {
    setError('');
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) { setError('Only PNG, JPG, and WEBP images are accepted.'); return; }
    if (file.size > MAX_SIZE) { setError('Image must be under 10 MB.'); return; }
    setImageFile(file);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSaving(true);
    let uploadedPath = '';
    try {
      if (!title.trim()) throw new Error('Title is required.');
      if (!imageFile && !imagePath) throw new Error('An image is required.');
      if (href.trim() && /^(https?:)?\/\//i.test(href.trim())) new URL(href.trim());

      if (imageFile) uploadedPath = await uploadImage(imageFile, 'highlights');
      const payload = {
        title: title.trim(), subtitle: subtitle.trim(), description: description.trim(),
        date_text: dateText.trim(), location: location.trim(), href: href.trim(),
        image_url: uploadedPath || imagePath, is_active: isActive,
      };

      if (isEdit) {
        await updateHighlight(id!, payload);
      } else {
        const items = await fetchAllHighlights();
        const sortOrder = items.length ? Math.max(...items.map((item) => item.sort_order)) + 1 : 0;
        await createHighlight(payload, sortOrder);
      }

      const savedImagePath = uploadedPath || imagePath;
      if (originalImagePath && originalImagePath !== savedImagePath && !originalImagePath.startsWith('http')) {
        await deleteImage(originalImagePath).catch(() => undefined);
      }
      navigate('/admin/highlights');
    } catch (err) {
      if (uploadedPath) await deleteImage(uploadedPath).catch(() => undefined);
      setError(err instanceof Error ? err.message : 'Failed to save highlight');
    } finally {
      setSaving(false);
    }
  }

  const displayedImage = previewUrl || (imagePath ? storageAsset(imagePath) : '');
  const inputClass = "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50";

  return (
    <div>
      <button type="button" onClick={() => navigate('/admin/highlights')} className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#00FF41]"><ArrowLeft className="h-4 w-4" />Back to Highlights</button>
      <h1 className="text-2xl font-black tracking-[-0.04em] text-white">{isEdit ? 'Edit Highlight' : 'New Highlight'}</h1>
      {error ? <div role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="highlight-title" className="text-sm font-medium text-zinc-300">Title *</label><input id="highlight-title" value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} required /></div>
          <div><label htmlFor="highlight-subtitle" className="text-sm font-medium text-zinc-300">Subtitle</label><input id="highlight-subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} className={inputClass} placeholder="Launch, event, collaboration..." /></div>
          <div><label htmlFor="highlight-date" className="text-sm font-medium text-zinc-300">Date label</label><input id="highlight-date" value={dateText} onChange={(event) => setDateText(event.target.value)} className={inputClass} placeholder="August 2026" /></div>
          <div className="sm:col-span-2"><label htmlFor="highlight-description" className="text-sm font-medium text-zinc-300">Description</label><textarea id="highlight-description" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} className={inputClass} /></div>
          <div><label htmlFor="highlight-location" className="text-sm font-medium text-zinc-300">Location</label><input id="highlight-location" value={location} onChange={(event) => setLocation(event.target.value)} className={inputClass} /></div>
          <div><label htmlFor="highlight-link" className="text-sm font-medium text-zinc-300">Details link</label><input id="highlight-link" value={href} onChange={(event) => setHref(event.target.value)} className={inputClass} placeholder="/path or https://..." /></div>

          <div className="sm:col-span-2">
            <span className="text-sm font-medium text-zinc-300">Image *</span>
            {displayedImage ? (
              <div className="relative mt-2 max-w-xl overflow-hidden rounded-[20px] border border-white/10 bg-white/5">
                <img src={displayedImage} alt="Highlight preview" className="aspect-[16/10] w-full object-cover" />
                <button type="button" onClick={() => { setImageFile(null); setImagePath(''); }} aria-label="Remove image" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#09090B]/80 text-white hover:text-red-400"><X className="h-4 w-4" /></button>
              </div>
            ) : null}
            <label className="mt-2 flex max-w-xl cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-4 text-sm text-zinc-400 transition hover:border-[#00FF41]/40 hover:text-[#00FF41]">
              <ImagePlus className="h-5 w-5" />{displayedImage ? 'Replace image' : 'Choose an image'}<span className="ml-auto text-xs text-zinc-600">PNG, JPG, WEBP · 10 MB</span>
              <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = ''; }} />
            </label>
          </div>

          <label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4 accent-[#00FF41]" />Show this highlight on the public homepage
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#00FF41] px-6 py-2.5 text-sm font-bold text-[#09090B] transition-opacity hover:opacity-90 disabled:opacity-50">{saving ? 'Saving...' : isEdit ? 'Update Highlight' : 'Create Highlight'}</button>
          <button type="button" onClick={() => navigate('/admin/highlights')} className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-[#00FF41]/35 hover:bg-[#00FF41]/10 hover:text-[#00FF41]">Cancel</button>
        </div>
      </form>
    </div>
  );
}
