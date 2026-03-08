export const mockHistory = [
  {
    id: "1",
    projectName: "Sunrise Tower",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
    date: "2026-03-07",
    stage: "Super Structure",
    progress: 45,
    confidence: 92,
  },
  {
    id: "2",
    projectName: "Green Valley Complex",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
    date: "2026-03-05",
    stage: "Foundation",
    progress: 20,
    confidence: 88,
  },
  {
    id: "3",
    projectName: "Metro Hub Office",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    date: "2026-03-03",
    stage: "Facade",
    progress: 72,
    confidence: 95,
  },
  {
    id: "4",
    projectName: "Sunrise Tower",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
    date: "2026-03-01",
    stage: "Foundation",
    progress: 18,
    confidence: 90,
  },
  {
    id: "5",
    projectName: "Lakeside Residency",
    image: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=400&h=300&fit=crop",
    date: "2026-02-28",
    stage: "Interior",
    progress: 85,
    confidence: 91,
  },
  {
    id: "6",
    projectName: "Metro Hub Office",
    image: "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=400&h=300&fit=crop",
    date: "2026-02-25",
    stage: "Super Structure",
    progress: 52,
    confidence: 87,
  },
];

export const mockDashboardStats = {
  totalProjects: 4,
  imagesUploaded: 24,
  latestStage: "Super Structure",
  avgProgress: 48,
};

export const mockProgressTimeline = [
  { date: "Week 1", progress: 5 },
  { date: "Week 2", progress: 12 },
  { date: "Week 3", progress: 20 },
  { date: "Week 4", progress: 28 },
  { date: "Week 5", progress: 38 },
  { date: "Week 6", progress: 45 },
  { date: "Week 7", progress: 52 },
  { date: "Week 8", progress: 60 },
];

export const mockAnalysisResult = {
  stage: "Super Structure",
  confidence: 92.4,
  progress: 45,
  previousStage: "Foundation",
  message: "Construction progressed from Foundation to Super Structure",
};

// Mock API functions
export const apiAnalyze = async (_formData: FormData) => {
  await new Promise((r) => setTimeout(r, 2500));
  return mockAnalysisResult;
};

export const apiUpload = async (_formData: FormData) => {
  await new Promise((r) => setTimeout(r, 1500));
  return { success: true, id: crypto.randomUUID() };
};

export const apiHistory = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return mockHistory;
};

export const apiProgress = async () => {
  await new Promise((r) => setTimeout(r, 600));
  return mockProgressTimeline;
};
