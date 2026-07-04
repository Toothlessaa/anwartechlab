import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { fetchProjectById, createProject, updateProject, uploadImage } from '../../lib/data';
import { relativeStoragePath, storageAsset } from '../../lib/assets';

const sizes = ['hero', 'medium', 'wide'];
const filters = ['Web', 'SaaS', 'Mobile', 'AI', 'Other'];

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');

  function add() {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
            {tag}
            <button type="button" onClick={() => remove(tag)} className="text-zinc-500 hover:text-red-400">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
        />
        <button type="button" onClick={add} className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/20">
          Add
        </button>
      </div>
    </div>
  );
}

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('Web');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [tech, setTech] = useState<string[]>([]);
  const [size, setSize] = useState('medium');
  const [link, setLink] = useState('');
  const [github, setGithub] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    fetchProjectById(id!).then((project) => {
      if (!project) { navigate('/admin/projects'); return; }
      setTitle(project.title);
      setFilter(project.filter);
      setCategory(project.category);
      setDescription(project.description);
      setStory(project.story || '');
      setChallenge(project.challenge || '');
      setSolution(project.solution || '');
      setFeatures(project.features || []);
      setTech(project.tech || []);
      setSize(project.size);
      setLink(project.link || '');
      setGithub(project.github || '');
      setImagePath(project.image ? relativeStoragePath(project.image) : '');
    });
  }, [id, isEdit, navigate]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadImage(file, 'projects');
      setImagePath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (!title.trim()) throw new Error('Title is required');
      const data = {
        title: title.trim(),
        filter,
        category: category.trim(),
        description: description.trim(),
        story: story.trim() || undefined,
        challenge: challenge.trim() || undefined,
        solution: solution.trim() || undefined,
        features,
        tech,
        image: imagePath,
        size,
        link: link.trim() || undefined,
        github: github.trim() || undefined,
      };

      if (isEdit) {
        await updateProject(id!, data);
      } else {
        await createProject(data);
      }
      navigate('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const previewUrl = imagePath && !uploading
    ? storageAsset(imagePath)
    : null;

  return (
    <div>
      <button onClick={() => navigate('/admin/projects')} className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#00FF41]">
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </button>

      <h1 className="text-2xl font-black tracking-[-0.04em] text-white">{isEdit ? 'Edit Project' : 'New Project'}</h1>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">Filter</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF41]/50"
            >
              {filters.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF41]/50"
            >
              {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Web Development"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Story</label>
            <textarea rows={2} value={story} onChange={(e) => setStory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Challenge</label>
            <textarea rows={2} value={challenge} onChange={(e) => setChallenge(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Solution</label>
            <textarea rows={2} value={solution} onChange={(e) => setSolution(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">Link</label>
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)}
              placeholder="https://"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">GitHub</label>
            <input type="url" value={github} onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#00FF41]/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">Tech Stack</label>
            <TagInput value={tech} onChange={setTech} placeholder="Add technology..." />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300">Features</label>
            <TagInput value={features} onChange={setFeatures} placeholder="Add feature..." />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Image</label>
            <div className="mt-1.5">
              {previewUrl && (
                <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                  <img src={previewUrl} alt="Preview" className="max-h-48 w-full object-contain bg-black/20" />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-[#00FF41]/40 hover:text-[#00FF41]">
                <Upload className={`h-4 w-4 ${uploading ? 'animate-pulse' : ''}`} />
                {uploading ? 'Uploading…' : imagePath ? 'Replace image' : 'Upload image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="rounded-xl bg-[#00FF41] px-6 py-2.5 text-sm font-bold text-[#09090B] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')}
            className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-[#00FF41]/35 hover:bg-[#00FF41]/10 hover:text-[#00FF41]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
