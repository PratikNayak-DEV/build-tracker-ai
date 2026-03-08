import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardHat, BarChart3, Upload, Eye } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Site Images",
    desc: "Drag & drop construction site photos for instant analysis.",
  },
  {
    icon: Eye,
    title: "AI-Powered Detection",
    desc: "ML model detects construction stage automatically.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    desc: "Monitor building progress over time with visual analytics.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-elevated">
          <HardHat className="h-8 w-8 text-primary-foreground" />
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Construction Progress
          <br />
          <span className="text-primary">Monitoring System</span>
        </h1>

        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Leverage AI-powered image analysis to automatically detect construction
          stages, track building progress, and generate insightful reports — all
          from site photographs.
        </p>

        <Button
          variant="hero"
          size="lg"
          className="mt-8 h-12 px-8 text-base"
          onClick={() => navigate("/dashboard")}
        >
          Start Monitoring
        </Button>
      </div>

      <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
