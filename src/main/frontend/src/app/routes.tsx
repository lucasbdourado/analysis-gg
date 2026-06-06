import { createBrowserRouter } from 'react-router-dom';
import { SearchLandingPage } from '../features/search/presentation/pages/SearchLandingPage';
import { DashboardPage } from '../features/dashboard/presentation/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SearchLandingPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
]);
