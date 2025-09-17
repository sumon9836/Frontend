import { apiClient } from "./api";

// Test function to verify backend connectivity
export const testBackendConnection = async () => {
  console.log("🔍 Testing backend API connection...");
  console.log("Backend URL:", "http://interchange.proxy.rlwy.net:24084");

  const tests = [
    {
      name: "Sessions endpoint",
      test: () => apiClient.getSessions(),
    },
    {
      name: "Blocklist endpoint", 
      test: () => apiClient.getBlocklist(),
    },
    {
      name: "Pair endpoint (test number)",
      test: () => apiClient.pairNumber("1234567890"),
    }
  ];

  const results = [];

  for (const { name, test } of tests) {
    try {
      console.log(`⏳ Testing ${name}...`);
      const result = await test();
      console.log(`✅ ${name} - Success:`, result);
      results.push({ name, status: "success", data: result });
    } catch (error) {
      console.log(`❌ ${name} - Failed:`, error);
      results.push({ name, status: "error", error: error.message });
    }
  }

  console.log("📊 Test Results Summary:");
  results.forEach(({ name, status, data, error }) => {
    console.log(`${status === "success" ? "✅" : "❌"} ${name}: ${status === "success" ? "Working" : error}`);
  });

  return results;
};

// Auto-run test when this module is imported (for development)
if (import.meta.env.DEV) {
  // Delay to avoid blocking app initialization
  setTimeout(() => {
    testBackendConnection();
  }, 2000);
}