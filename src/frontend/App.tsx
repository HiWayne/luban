import AppRouter, { AppRoutes, routes } from './router';

function App() {
  return (
    <AppRouter>
      <AppRoutes routes={routes} />
    </AppRouter>
  );
}

export default App;
