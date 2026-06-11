import { createBrowserRouter } from 'react-router-dom';
import { SearchLandingPage } from '../features/search/presentation/pages/SearchLandingPage';
import { DashboardPage } from '../features/dashboard/presentation/pages/DashboardPage';
import { MatchDetailPage } from '../features/match-detail/presentation/pages/MatchDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SearchLandingPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/match/:matchId',
    element: <MatchDetailPage />,
  },
]);
