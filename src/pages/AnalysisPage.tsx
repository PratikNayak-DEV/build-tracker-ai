import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { mockAnalysisResult } from "@/lib/mockData";

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result || mockAnalysisResult;
  const imageUrl =
    location.state?.imageUrl ||
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop";
  const projectName = location.state?.projectName || "Sample Project";

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold">Analysis Results</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI analysis complete for <span className="font-medium text-foreground">{projectName}</span>
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Image Preview */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-card">
            <img
              src={imageUrl}
              alt="Uploaded site"
              className="h-64 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Uploaded Image</p>
              <p className="font-display font-semibold">{projectName}</p>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Detected Stage
              </div>
              <p className="mt-1 font-display text-2xl font-bold">{result.stage}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border bg-card p-4 shadow-card">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="mt-1 font-display text-xl font-bold text-primary">
                  {result.confidence}%
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-card">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="mt-1 font-display text-xl font-bold">
                  {result.progress}%
                </p>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-2">Overall Progress</p>
              <Progress value={result.progress} className="h-3" />
            </div>

            <div className="rounded-xl border bg-primary/5 p-5 shadow-card">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Stage Comparison</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {result.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground">
                      {result.previousStage}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="rounded-md gradient-primary px-2 py-0.5 text-primary-foreground">
                      {result.stage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate("/upload")}>
            Upload Another
          </Button>
          <Button variant="secondary" onClick={() => navigate("/history")}>
            View History
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalysisPage;
