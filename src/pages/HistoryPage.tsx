import { useEffect, useState } from "react";
import { apiHistory } from "@/lib/mockData";
import { AppLayout } from "@/components/AppLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

type HistoryItem = {
  id: string;
  projectName: string;
  image: string;
  date: string;
  stage: string;
  progress: number;
  confidence: number;
};

const stageBadgeClass: Record<string, string> = {
  Foundation: "bg-secondary text-secondary-foreground",
  "Super Structure": "bg-primary/15 text-primary-foreground border-primary/20",
  Facade: "bg-accent/20 text-accent-foreground",
  Interior: "bg-muted text-muted-foreground",
};

const HistoryPage = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiHistory().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold">Upload History</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Previously analyzed construction site images.
      </p>

      {loading ? (
        <LoadingSpinner text="Loading history..." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border bg-card shadow-card transition-shadow hover:shadow-elevated"
            >
              <img
                src={item.image}
                alt={item.projectName}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm">
                    {item.projectName}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={stageBadgeClass[item.stage] || ""}
                  >
                    {item.stage}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.date}</span>
                  <span className="font-medium text-foreground">
                    {item.progress}% complete
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-primary transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default HistoryPage;
