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
import './styles.css';

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
    ],
  },
]);

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
