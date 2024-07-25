import Pages from './pages';

const routes = [
  {
    index: true,
    element: <Pages.Home />,
    errorElement: <Pages.Error />,
  },
  {
    path: '/photo/:photoName',
    element: <Pages.PhotoPage />,
  },
  { path: '/leaderboard/:photoName', element: <Pages.Leaderboard /> },
];

export default routes;
