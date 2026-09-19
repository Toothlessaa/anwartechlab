import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from './App';
import AdminLayout from './components/admin/AdminLayout';
import Login from './components/admin/Login';
import ProjectsList from './components/admin/ProjectsList';
import ProjectForm from './components/admin/ProjectForm';
import GalleryList from './components/admin/GalleryList';
import GalleryForm from './components/admin/GalleryForm';
import HighlightsList from './components/admin/HighlightsList';
import HighlightForm from './components/admin/HighlightForm';
import './styles.css';
import { SoundProvider } from './components/SoundProvider';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/admin/login', element: <Login /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="projects" replace /> },
      { path: 'projects', element: <ProjectsList /> },
      { path: 'projects/new', element: <ProjectForm /> },
      { path: 'projects/:id/edit', element: <ProjectForm /> },
      { path: 'gallery', element: <GalleryList /> },
      { path: 'gallery/new', element: <GalleryForm /> },
      { path: 'gallery/:id/edit', element: <GalleryForm /> },
      { path: 'highlights', element: <HighlightsList /> },
      { path: 'highlights/new', element: <HighlightForm /> },
      { path: 'highlights/:id/edit', element: <HighlightForm /> },
    ],
  },
]);

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <SoundProvider><RouterProvider router={router} /></SoundProvider>
  </StrictMode>,
);
