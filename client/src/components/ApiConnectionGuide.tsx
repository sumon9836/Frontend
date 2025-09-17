import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { testBackendConnection } from "@/lib/testBackend";

export default function ApiConnectionGuide() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const results = await testBackendConnection();
      setTestResults(results);
      
      const successCount = results.filter(r => r.status === "success").length;
      toast({
        title: "Connection Test Complete",
        description: `${successCount}/${results.length} endpoints working`,
        variant: successCount === results.length ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test API connection",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Configuration copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ExternalLink className="w-5 h-5" />
          <span>API Connection Guide</span>
        </CardTitle>
        <CardDescription>
          Your frontend connects to your WhatsApp bot API through a proxy to avoid CORS issues
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Configuration */}
        <div>
          <h3 className="font-medium mb-3">Current Configuration</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-mono text-sm">External API:</div>
                <div className="text-xs text-muted-foreground">http://interchange.proxy.rlwy.net:24084</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard("http://interchange.proxy.rlwy.net:24084")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-mono text-sm">Proxy Route:</div>
                <div className="text-xs text-muted-foreground">/api/* → External API</div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Connection Test</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isTestingConnection ? 'animate-spin' : ''}`} />
              Test Connection
            </Button>
          </div>
          
          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {result.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-mono text-sm">{result.name}</span>
                  </div>
                  <Badge variant={result.status === "success" ? "secondary" : "destructive"}>
                    {result.status === "success" ? "Working" : "Failed"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Troubleshooting */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>If connections fail:</strong> Ensure your backend API at 
            http://interchange.proxy.rlwy.net:24084 is running and accessible. 
            The proxy server automatically forwards all requests to your external API.
          </AlertDescription>
        </Alert>

        {/* Available Endpoints */}
        <div>
          <h3 className="font-medium mb-3">Available Endpoints</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono">
            <div className="p-2 bg-muted rounded text-green-600">GET /api/sessions</div>
            <div className="p-2 bg-muted rounded text-green-600">GET /api/blocklist</div>
            <div className="p-2 bg-muted rounded text-blue-600">GET /api/pair?number=X</div>
            <div className="p-2 bg-muted rounded text-red-600">GET /api/delete?number=X</div>
            <div className="p-2 bg-muted rounded text-red-600">GET /api/block?number=X</div>
            <div className="p-2 bg-muted rounded text-yellow-600">GET /api/unblock?number=X</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}