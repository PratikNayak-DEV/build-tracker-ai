import { useEffect, useState } from "react";
import {
  mockDashboardStats,
  apiProgress,
} from "@/lib/mockData";
import { AppLayout } from "@/components/AppLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  FolderKanban,
  ImageIcon,
  Layers,
  TrendingUp,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const stats = [
  {
    label: "Total Projects",
    value: mockDashboardStats.totalProjects,
    icon: FolderKanban,
  },
  {
    label: "Images Uploaded",
    value: mockDashboardStats.imagesUploaded,
    icon: ImageIcon,
  },
  {
    label: "Latest Stage",
    value: mockDashboardStats.latestStage,
    icon: Layers,
  },
  {
    label: "Avg. Progress",
    value: `${mockDashboardStats.avgProgress}%`,
    icon: TrendingUp,
  },
];

const DashboardPage = () => {
  const [timeline, setTimeline] = useState<{ date: string; progress: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiProgress().then((data) => {
      setTimeline(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of all construction monitoring activity.
      </p>

      {/* Stat Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-display text-xl font-bold">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Chart */}
      <div className="mt-6 rounded-xl border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold">Progress Timeline</h2>
        <p className="text-xs text-muted-foreground">
          Construction progress over the past 8 weeks
        </p>

        {loading ? (
          <LoadingSpinner text="Loading chart data..." />
        ) : (
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(45 93% 47%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(45 93% 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 89%)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "hsl(30 5% 45%)" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(30 5% 45%)" }}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid hsl(40 15% 89%)",
                    fontSize: "0.875rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="hsl(45 93% 47%)"
                  strokeWidth={2.5}
                  fill="url(#progressGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
