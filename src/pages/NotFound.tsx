import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-gradient-primary">404</div>
        <h1 className="text-xl font-semibold mt-3">Page not found</h1>
        <p className="text-sm text-muted-foreground mt-2">The page you are looking for does not exist or has moved.</p>
        <Link to="/dashboard" className="inline-block mt-6 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium shadow-glow">Go to dashboard</Link>
      </div>
    </div>
  );
}
