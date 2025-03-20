import Navbar from "@/components/Navbar"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
