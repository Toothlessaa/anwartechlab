import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { storageAsset } from './assets';
import type { Project, GalleryItem } from '../types';
import { mediaPosts as fallbackMediaPosts, projects as fallbackProjects } from '../data/portfolio';
import { getAdminToken } from './adminAuth';

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

function mapFallbackMediaItem(item: typeof fallbackMediaPosts[number]): GalleryItem {
  return {
    ...item,
    created_at: undefined,
  };
}

function requireAdminToken(): string {
  const token = getAdminToken();
  if (!token) throw new Error('Admin session expired. Please sign in again.');
  return token;
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storageFolder = folder === 'gallery' ? 'media' : folder;
  const path = `assets/${storageFolder}/${filename}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  return `${storageFolder}/${filename}`;
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
  const compatibilityImages = row.id === 'media-bear-market-patience-wins' && rawImages.length === 0
    ? ['media/bitcoin/port1.jpg', 'media/bitcoin/port2.jpg', 'media/bitcoin/port3.jpg', 'media/bitcoin/port4.jpg']
    : [];
  const images = uniquePaths([...rawImages, ...compatibilityImages, rawCoverImage].filter(Boolean)).map(normalizeStoredPath);
  const description = (row.description as string) || '';
  const [legacySummary, ...legacyContentParts] = description.split(/\n\s*\n/);
  const summary = (row.summary as string) || legacySummary || description;
  const content = (row.content as string) || legacyContentParts.join('\n\n') || description;

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
          const remoteItems = data.map(mapGalleryItem);
          const fallbackItems = fallbackMediaPosts.map(mapFallbackMediaItem);
          const remoteIds = new Set(remoteItems.map((item) => item.id));
          setItems([...remoteItems, ...fallbackItems.filter((item) => !remoteIds.has(item.id))]);
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
  const { data, error } = await supabase.rpc('admin_create_project', {
    p_token: requireAdminToken(),
    p_project: {
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
    },
  });

  if (error) throw error;
  return mapProject(data as Record<string, unknown>);
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<Project> {
  const { data, error } = await supabase.rpc('admin_update_project', {
    p_token: requireAdminToken(),
    p_id: id,
    p_project: {
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
    },
  });

  if (error) throw error;
  return mapProject(data as Record<string, unknown>);
}

export async function deleteProject(id: string, imagePath?: string): Promise<void> {
  if (imagePath) await deleteImage(imagePath);
  const { error } = await supabase.rpc('admin_delete_project', {
    p_token: requireAdminToken(),
    p_id: id,
  });
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

  const { data, error } = await supabase.rpc('admin_create_gallery_item', {
    p_token: requireAdminToken(),
    p_item: payload,
  });

  if (error) throw error;

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

  const { data, error } = await supabase.rpc('admin_update_gallery_item', {
    p_token: requireAdminToken(),
    p_id: id,
    p_item: payload,
  });

  if (error) throw error;

  return mapGalleryItem(data as Record<string, unknown>);
}

export async function deleteGalleryItem(id: string, imagePaths?: string[]): Promise<void> {
  if (imagePaths?.length) {
    await Promise.all(uniquePaths(imagePaths).map((imagePath) => deleteImage(imagePath)));
  }
  const { error } = await supabase.rpc('admin_delete_gallery_item', {
    p_token: requireAdminToken(),
    p_id: id,
  });
  if (error) throw error;
}
