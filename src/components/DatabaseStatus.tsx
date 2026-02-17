import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

interface ConnectionStatus {
  storage: "connected" | "disconnected";
  database: "connected" | "disconnected";
  email: "connected" | "disconnected";
}

export const DatabaseStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    storage: "disconnected",
    database: "disconnected",
    email: "disconnected",
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Test localStorage
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      setStatus((prev) => ({ ...prev, storage: "connected" }));
    } catch {
      setStatus((prev) => ({ ...prev, storage: "disconnected" }));
    }

    // Test database and email via health endpoint
    const testBackend = async () => {
      try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/api/health`);
        const data = await response.json();
        setStatus((prev) => ({
          ...prev,
          database: data.database === "connected" ? "connected" : "disconnected",
          email: data.email === "configured" ? "connected" : "disconnected",
        }));
      } catch {
        setStatus((prev) => ({ ...prev, database: "disconnected", email: "disconnected" }));
      }
    };

    testBackend();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        title="Connection Status"
      >
        ⚙
      </button>

      {/* Status Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-72 bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-2xl space-y-3">
          <h3 className="font-bold text-white text-sm border-b border-slate-700 pb-2">
            System Status
          </h3>

          {/* Storage Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-300">Browser Storage</p>
              <p className="text-xs text-gray-400">localStorage</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                status.storage === "connected"
                  ? "bg-green-900 text-green-200"
                  : "bg-red-900 text-red-200"
              }`}
            >
              {status.storage === "connected" ? "✓ Connected" : "✗ Disconnected"}
            </div>
          </div>

          {/* Database Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-300">Database</p>
              <p className="text-xs text-gray-400">PostgreSQL</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                status.database === "connected"
                  ? "bg-green-900 text-green-200"
                  : "bg-red-900 text-red-200"
              }`}
            >
              {status.database === "connected" ? "✓ Connected" : "✗ Disconnected"}
            </div>
          </div>

          {/* Email Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-300">Email Service</p>
              <p className="text-xs text-gray-400">Gmail (Nodemailer)</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                status.email === "connected"
                  ? "bg-green-900 text-green-200"
                  : "bg-red-900 text-red-200"
              }`}
            >
              {status.email === "connected" ? "✓ Connected" : "✗ Disconnected"}
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 pt-3 border-t border-slate-700">
            <p className="text-xs text-yellow-400 font-semibold">⚠ Note:</p>
            <p className="text-xs text-gray-400 mt-1">
              Data is stored in browser localStorage only. To enable database storage, configure a backend database connection.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;
