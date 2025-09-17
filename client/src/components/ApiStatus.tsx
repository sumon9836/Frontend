import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await apiClient.getSessions();
        setStatus("connected");
      } catch (error) {
        setStatus("error");
      }
      setLastChecked(new Date());
    };

    checkApiStatus();
    
    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: CheckCircle,
          label: "API Connected",
          color: "text-green-600",
          bg: "bg-green-50 text-green-700 border-green-200",
          darkBg: "dark:bg-green-950 dark:text-green-400 dark:border-green-800"
        };
      case "error":
        return {
          icon: AlertCircle,
          label: "API Disconnected",
          color: "text-red-600",
          bg: "bg-red-50 text-red-700 border-red-200",
          darkBg: "dark:bg-red-950 dark:text-red-400 dark:border-red-800"
        };
      default:
        return {
          icon: Clock,
          label: "Checking...",
          color: "text-yellow-600",
          bg: "bg-yellow-50 text-yellow-700 border-yellow-200",
          darkBg: "dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (status === "checking") {
    return null; // Don't show while checking initially
  }

  return (
    <Card className={`border ${config.bg} ${config.darkBg}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className="font-medium">{config.label}</span>
          </div>
          
          {lastChecked && (
            <span className="text-xs opacity-75">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        {status === "error" && (
          <div className="mt-2 text-xs opacity-90">
            Unable to connect to backend API. Some features may not work properly.
          </div>
        )}
      </CardContent>
    </Card>
  );
}