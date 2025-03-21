import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="w-full max-w-md z-10 relative">
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
