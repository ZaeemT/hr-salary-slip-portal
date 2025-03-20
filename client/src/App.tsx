import { ThemeProvider } from "@/components/theme-provider"
import MainLayout from "./layouts/MainLayout"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { mainRoutes } from './routes/main.routes';
import { authRoutes } from "./routes/auth.routes";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<AuthLayout>{route.element}</AuthLayout>}
            />
          ))}
          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<MainLayout>{route.element}</MainLayout>}
            />
          ))}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
