import AppRouter, { AppRoutes, routes } from './router';
import { GlobalStyle } from './style';

function App() {
  return (
    <>
      <GlobalStyle />
      <AppRouter>
        <AppRoutes routes={routes} />
      </AppRouter>
    </>
  );
}

export default App;
