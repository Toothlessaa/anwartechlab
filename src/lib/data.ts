import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { storageAsset } from './assets';
import type { Project, GalleryItem } from '../types';
import { mediaPosts as fallbackMediaPosts, projects as fallbackProjects } from '../data/portfolio';

const BUCKET = 'portfolio-assets';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseImageList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0);
    } catch {
      return [trimmed];
    }
  }
  return [];
}

function normalizeStoredPath(path: string): string {
  return path.startsWith('http') ? path : storageAsset(path);
}

function uniquePaths(paths: string[]): string[] {
  return Array.from(new Set(paths.filter(Boolean)));
}

function isSchemaCompatibilityError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const candidate = error as { code?: string; message?: string; details?: string; hint?: string };
  const text = `${candidate.message || ''} ${candidate.details || ''} ${candidate.hint || ''}`.toLowerCase();
  return candidate.code === 'PGRST204' || candidate.code === '42703' || text.includes('column') || text.includes('schema cache');
}

function mapFallbackMediaItem(item: typeof fallbackMediaPosts[number]): GalleryItem {
  return {
    ...item,
    created_at: undefined,
  };
}

function buildLegacyGalleryPayload(item: Pick<GalleryItem, 'title' | 'category' | 'summary' | 'content' | 'description' | 'image' | 'images' | 'date'>) {
  return {
    title: item.title,
    category: item.category,
    description: item.summary || item.description || item.content,
    image: item.image || item.images[0] || '',
    date: item.date || new Date().toISOString().split('T')[0],
  };
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `assets/${folder}/${filename}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  return `${folder}/${filename}`;
}

export async function deleteImage(imagePath: string): Promise<void> {
  if (!imagePath) return;
  const fullPath = `assets/${imagePath}`;
  await supabase.storage.from(BUCKET).remove([fullPath]);
}

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    category: (row.category as string) || '',
    filter: (row.filter as string) || '',
    description: (row.description as string) || '',
    story: row.story as string | undefined,
    challenge: row.challenge as string | undefined,
    solution: row.solution as string | undefined,
    features: row.features ? (row.features as string[]) : [],
    tech: (row.tech as string[]) || [],
    image: row.image ? storageAsset(row.image as string) : '',
    size: (row.size as string) || 'medium',
    link: row.link as string | undefined,
    github: row.github as string | undefined,
    created_at: row.created_at as string | undefined,
  };
}

function mapGalleryItem(row: Record<string, unknown>): GalleryItem {
  const rawImages = parseImageList(row.images);
  const rawCoverImage = typeof row.image === 'string' ? row.image : '';
  const images = uniquePaths([...rawImages, rawCoverImage].filter(Boolean)).map(normalizeStoredPath);
  const description = (row.description as string) || '';
  const summary = (row.summary as string) || description;
  const content = (row.content as string) || description;

  return {
    id: row.id as string,
    title: row.title as string,
    category: (row.category as string) || '',
    summary,
    content,
    description,
    image: images[0] || '',
    images,
    date: (row.date as string) || '',
    created_at: row.created_at as string | undefined,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error: err } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (cancelled) return;

        if (err) throw err;

        if (data && data.length > 0) {
          setProjects(data.map(mapProject));
        } else {
          setProjects(fallbackProjects as Project[]);
        }
      } catch (err) {
        if (!cancelled) {
          setProjects(fallbackProjects as Project[]);
          setError(err instanceof Error ? err.message : 'Failed to load projects');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, error };
}

export function useGalleryItems() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error: err } = await supabase
          .from('gallery_items')
          .select('*')
          .order('date', { ascending: false });

        if (cancelled) return;

        if (err) throw err;

        if (data && data.length > 0) {
          setItems(data.map(mapGalleryItem));
        } else {
          setItems(fallbackMediaPosts.map(mapFallbackMediaItem));
        }
      } catch (err) {
        if (!cancelled) {
          setItems(fallbackMediaPosts.map(mapFallbackMediaItem));
          setError(err instanceof Error ? err.message : 'Failed to load gallery items');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}

export async function fetchAllProjectsRaw(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  if (!data) return null;
  return mapProject(data as Record<string, unknown>);
}

export async function fetchAllGalleryItemsRaw(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchGalleryItemById(id: string): Promise<GalleryItem | null> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  if (!data) return null;
  return mapGalleryItem(data as Record<string, unknown>);
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'> & { id?: string }): Promise<Project> {
  const id = project.id || slugify(project.title) + '-' + Date.now().toString(36);
  const { data, error } = await supabase
    .from('projects')
    .insert({
      id,
      title: project.title,
      category: project.category,
      filter: project.filter,
      description: project.description,
      story: project.story || null,
      challenge: project.challenge || null,
      solution: project.solution || null,
      features: project.features || [],
      tech: project.tech || [],
      image: project.image,
      size: project.size || 'medium',
      link: project.link || null,
      github: project.github || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapProject(data as Record<string, unknown>);
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({
      title: updates.title,
      category: updates.category,
      filter: updates.filter,
      description: updates.description,
      story: updates.story || null,
      challenge: updates.challenge || null,
      solution: updates.solution || null,
      features: updates.features || [],
      tech: updates.tech || [],
      image: updates.image,
      size: updates.size || 'medium',
      link: updates.link || null,
      github: updates.github || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapProject(data as Record<string, unknown>);
}

export async function deleteProject(id: string, imagePath?: string): Promise<void> {
  if (imagePath) await deleteImage(imagePath);
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'> & { id?: string }): Promise<GalleryItem> {
  const id = item.id || slugify(item.title) + '-' + Date.now().toString(36);
  const images = uniquePaths(item.images || []).map((path) => path.startsWith('http') ? path : path);
  const payload = {
    id,
    title: item.title,
    category: item.category,
    summary: item.summary,
    content: item.content,
    description: item.description,
    image: item.image || images[0] || '',
    images,
    date: item.date || new Date().toISOString().split('T')[0],
  };

  const { data, error } = await supabase
    .from('gallery_items')
    .insert(payload)
    .select()
    .single();

  if (error) {
    if (!isSchemaCompatibilityError(error)) throw error;

    const legacyResult = await supabase
      .from('gallery_items')
      .insert({ id, ...buildLegacyGalleryPayload({ ...item, image: item.image || images[0] || '', images }) })
      .select()
      .single();

    if (legacyResult.error) throw legacyResult.error;
    return mapGalleryItem(legacyResult.data as Record<string, unknown>);
  }

  return mapGalleryItem(data as Record<string, unknown>);
}

export async function updateGalleryItem(id: string, updates: Partial<Omit<GalleryItem, 'id' | 'created_at'>>): Promise<GalleryItem> {
  const images = uniquePaths(updates.images || []);
  const payload = {
    title: updates.title,
    category: updates.category,
    summary: updates.summary,
    content: updates.content,
    description: updates.description,
    image: updates.image || images[0] || updates.image,
    images,
    date: updates.date,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('gallery_items')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (!isSchemaCompatibilityError(error)) throw error;

    const legacyResult = await supabase
      .from('gallery_items')
      .update({
        ...buildLegacyGalleryPayload({
          title: updates.title || '',
          category: updates.category || '',
          summary: updates.summary || '',
          content: updates.content || '',
          description: updates.description || '',
          image: updates.image || images[0] || '',
          images,
          date: updates.date || '',
        }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (legacyResult.error) throw legacyResult.error;
    return mapGalleryItem(legacyResult.data as Record<string, unknown>);
  }

  return mapGalleryItem(data as Record<string, unknown>);
}

export async function deleteGalleryItem(id: string, imagePaths?: string[]): Promise<void> {
  if (imagePaths?.length) {
    await Promise.all(uniquePaths(imagePaths).map((imagePath) => deleteImage(imagePath)));
  }
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw error;
}
