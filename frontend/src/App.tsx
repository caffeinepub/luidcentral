import React, { useEffect } from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeDB } from './lib/db';
import ClientLogin from './pages/ClientLogin';
import ClientPortal from './pages/ClientPortal';
import MasterLogin from './pages/MasterLogin';
import MasterPanel from './pages/MasterPanel';
import StaffLogin from './pages/StaffLogin';
import StaffPanel from './pages/StaffPanel';

initializeDB();

function RootLayout() {
  return <Outlet />;
}

function ClientLoginRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.userType === 'client') navigate({ to: '/portal' });
  }, [user, navigate]);
  return <ClientLogin />;
}

function ClientPortalRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.userType !== 'client') navigate({ to: '/' });
  }, [user, navigate]);
  if (!user || user.userType !== 'client') return null;
  return <ClientPortal />;
}

function MasterLoginRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.userType === 'admin') navigate({ to: '/master/panel' });
  }, [user, navigate]);
  return <MasterLogin />;
}

function MasterPanelRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.userType !== 'admin') navigate({ to: '/master' });
  }, [user, navigate]);
  if (!user || user.userType !== 'admin') return null;
  return <MasterPanel />;
}

function StaffLoginRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.userType === 'staff') navigate({ to: '/staff/panel' });
  }, [user, navigate]);
  return <StaffLogin />;
}

function StaffPanelRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.userType !== 'staff') navigate({ to: '/staff' });
  }, [user, navigate]);
  if (!user || user.userType !== 'staff') return null;
  return <StaffPanel />;
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ClientLoginRoute,
});

const portalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portal',
  component: ClientPortalRoute,
});

const masterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/master',
  component: MasterLoginRoute,
});

const masterPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/master/panel',
  component: MasterPanelRoute,
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffLoginRoute,
});

const staffPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/panel',
  component: StaffPanelRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  portalRoute,
  masterRoute,
  masterPanelRoute,
  staffRoute,
  staffPanelRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
