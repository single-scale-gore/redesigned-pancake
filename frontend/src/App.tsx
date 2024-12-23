import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { API } from "./api/api";
import { MetricResponse } from "./types/metrics";
import { Input } from "./components/ui/input";

function App() {
  const [metrics, setMetrics] = useState<MetricResponse | null>(null);
  const [period, setPeriod] = useState("3600");
  const [timePeriod, setTimePeriod] = useState("24");
  const [ipAddress, setIpAddress] = useState("172.31.88.161");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await API.fetchMetrics({
        ipAddress,
        period,
        timePeriod,
      });

      setMetrics(data);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className=" h-screen flex flex-col">
      {" "}
      <h1 className="text-2xl p-6">Aws Instance CPU usage</h1>
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex space-x-2 ">
            <p>Time Period</p>

            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last Hour</SelectItem>
                <SelectItem value="3">Last 3 Hours</SelectItem>
                <SelectItem value="6">Last 6 Hours</SelectItem>
                <SelectItem value="24">Last Day</SelectItem>
              </SelectContent>
            </Select>
          </div>{" "}
          <div className="flex space-x-2 ">
            <p> Period</p>
            <Input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-[150px]"
              placeholder="Seconds"
            />
          </div>
          <div className="flex space-x-2 ">
            <p> Ip Address:</p>
            <Input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-[150px]"
              placeholder="Ip Address"
            />
            <Button onClick={fetchMetrics} disabled={loading}>
              {loading ? "Loading..." : "Load"}
            </Button>{" "}
          </div>
        </div>
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
        {metrics?.dataPoints && metrics.dataPoints.length > 0 ? (
          <div className="flex-1 relative mt-4">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...metrics.dataPoints].reverse()}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) =>
                      new Date(time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                  />
                  <YAxis tickFormatter={(value) => value} />
                  <Tooltip
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                    formatter={(value: number) => [
                      `${(value * 100).toFixed(1)}%`,
                      "CPU Usage",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#C90050FF"
                    strokeWidth={4}
                    dot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default App;
