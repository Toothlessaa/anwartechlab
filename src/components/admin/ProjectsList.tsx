import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, Plus, Trash2, ExternalLink } from 'lucide-react';
import { fetchAllProjectsRaw, deleteProject } from '../../lib/data';
import { storageAsset } from '../../lib/assets';

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchAllProjectsRaw();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, imagePath?: unknown) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await deleteProject(id, imagePath as string | undefined);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

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
          <h1 className="text-2xl font-black tracking-[-0.04em] text-white">Projects</h1>
          <p className="mt-1 text-sm text-zinc-400">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 rounded-xl bg-[#00FF41] px-4 py-2.5 text-sm font-bold text-[#09090B] transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-white/10 p-12 text-center">
          <p className="text-zinc-500">No projects yet.</p>
          <Link to="/admin/projects/new" className="mt-2 inline-block text-sm text-[#00FF41] hover:underline">
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id as string}
              className="flex items-center gap-4 rounded-[16px] border border-white/10 bg-[#1d1d23]/60 p-4 transition-colors hover:border-[#00FF41]/25"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                {project.image ? (
                  <img
                    src={storageAsset(project.image as string)}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-white">{project.title as string}</h3>
                  <span className="shrink-0 rounded-full border border-[#00FF41]/25 bg-[#00FF41]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00FF41]">
                    {project.filter as string}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-zinc-500">{project.description as string}</p>
              </div>
              <div className="flex items-center gap-1">
                {project.link ? (
                  <a
                    href={project.link as string}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-[#00FF41]/10 hover:text-[#00FF41]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
                <button
                  onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-[#00FF41]/10 hover:text-[#00FF41]"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id as string, project.image)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
