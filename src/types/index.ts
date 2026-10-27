export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: "free" | "pro" | "agency";
  credits: number;
  creditsUsed: number;
  creditsTotal: number;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  shortsCount: number;
  duration: number;
  viralMode: boolean;
}

export interface Short {
  id: string;
  projectId: string;
  title: string;
  description: string;
  hashtags: string[];
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  fileSize: number;
  resolution: string;
  viralScore: number;
  hookScore: number;
  emotionScore: number;
  retentionScore: number;
  startTime: number;
  endTime: number;
  captions?: Caption[];
}

export interface Caption {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isKeyword?: boolean;
}

export interface Job {
  id: string;
  projectId: string;
  status: "queued" | "downloading" | "analyzing" | "processing" | "captioning" | "completed" | "failed";
  progress: number;
  currentStep: string;
  steps: JobStep[];
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
  duration?: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  credits: number;
  features: string[];
  highlighted?: boolean;
}

export interface AnalyticsStat {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalShorts: number;
  creditsUsed: number;
  creditsTotal: number;
  avgViralScore: number;
  storageUsed: number;
  storageTotal: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  credits: number;
  projects: number;
  joinedAt: string;
  status: "active" | "suspended";
}

export interface RevenueData {
  month: string;
  revenue: number;
  users: number;
}
