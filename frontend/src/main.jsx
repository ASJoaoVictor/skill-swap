import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import './index.css';
import Index from './pages/Index';
import User from './pages/User';
import Matches from './pages/Matches';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter([
  { path: "/", element: <Index />},
  { path: "/matches", element: <Matches />},
  { path: "/user", element: <User />},
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
