import { Boxes } from "@/components/backgrounds/background-boxes";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 overflow-hidden">
        <Boxes />
      </div>
      <div className="w-full max-w-md z-10 relative">
      {children}
      </div>
    </div>
  );
};

export default AuthLayout;
