import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload as UploadIcon, ImageIcon, X } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { apiAnalyze } from "@/lib/mockData";
import { AppLayout } from "@/components/AppLayout";

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [buildingCount, setBuildingCount] = useState(1);
  const [activityType, setActivityType] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) handleFile(f);
    },
    [handleFile]
  );

  const handleSubmit = async () => {
    if (!file || !projectName || !activityType) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("projectName", projectName);
    formData.append("buildingCount", String(buildingCount));
    formData.append("activityType", activityType);

    const result = await apiAnalyze(formData);
    setLoading(false);
    navigate("/analysis", { state: { result, imageUrl: preview, projectName } });
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold">Upload Site Image</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a construction site photo to analyze its progress.
        </p>

        {loading ? (
          <div className="mt-12">
            <LoadingSpinner text="Analyzing construction image..." />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto max-h-64 rounded-lg object-contain"
                  />
                  <button
                    onClick={clearFile}
                    className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Drag & drop your image here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </>
              )}
            </div>

            {/* Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g. Sunrise Tower"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buildingCount">Building Count</Label>
                <Input
                  id="buildingCount"
                  type="number"
                  min={1}
                  value={buildingCount}
                  onChange={(e) => setBuildingCount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Type</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="super-structure">Super Structure</SelectItem>
                  <SelectItem value="facade">Facade</SelectItem>
                  <SelectItem value="interior">Interior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={!file || !projectName || !activityType}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload & Analyze
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default UploadPage;
