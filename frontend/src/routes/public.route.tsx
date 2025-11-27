import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import { Loader } from "lucide-react";

const PublicRoute = () => {
  const { data, isLoading } = useAuth();
  const user = data?.data?.user;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card border shadow-lg">
          <div className="relative">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Loading ExamForge
            </h3>
            <p className="text-sm text-muted-foreground">
              Preparing your experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return !user ? <Outlet /> : <Navigate to="/home" replace />;
};

export default PublicRoute;
