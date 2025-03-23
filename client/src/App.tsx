import { ThemeProvider } from "@/components/theme-provider"
import MainLayout from "./layouts/MainLayout"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { mainRoutes } from './routes/main.routes';
import { authRoutes } from "./routes/auth.routes";
import AuthLayout from "./layouts/AuthLayout";
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
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
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
