import Navbar from "@/components/Navbar"
import { GetAccessToken } from '@/services/auth.service';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const token = GetAccessToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
