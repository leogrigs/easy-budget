import { Loader2 } from "lucide-react";

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default FullScreenLoader;
