import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

interface StatusBadgeProps {
  status: "connected" | "disconnected" | "pairing" | "blocked";
  size?: "sm" | "default";
}

export default function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          label: "Connected",
          color: "text-green-600",
          bg: "bg-green-50 text-green-700 border-green-200",
          darkBg: "dark:bg-green-950 dark:text-green-400 dark:border-green-800"
        };
      case "pairing":
        return {
          label: "Pairing",
          color: "text-yellow-600", 
          bg: "bg-yellow-50 text-yellow-700 border-yellow-200",
          darkBg: "dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800"
        };
      case "blocked":
        return {
          label: "Blocked",
          color: "text-red-600",
          bg: "bg-red-50 text-red-700 border-red-200", 
          darkBg: "dark:bg-red-950 dark:text-red-400 dark:border-red-800"
        };
      default:
        return {
          label: "Disconnected",
          color: "text-gray-600",
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          darkBg: "dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={`${config.bg} ${config.darkBg} border flex items-center gap-1 ${size === "sm" ? "text-xs px-2 py-0.5" : ""}`}
      data-testid={`badge-status-${status}`}
    >
      <Circle className={`w-2 h-2 fill-current ${config.color}`} />
      {config.label}
    </Badge>
  );
}