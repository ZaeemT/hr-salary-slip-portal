import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/mode-toggle";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center justify-center mt-3">
          <Logo />
          <span className="font-exo2 font-bold text-xl p-3">HR Salary Slip Portal</span>
        </Link>
      </div>
      
      <div className="container w-full max-w-md z-10 relative">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
