export interface JobCategory {
  id: string;
  name: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  city: string | null;
  salary: number | null;
  deadline: string | null;
  isPublished: boolean;
  hasTest: boolean;
  bannerUrl: string | null;
  tags: string[] | null;
  createdAt: string;
  companyId: string;
  categoryId: string;
  category: JobCategory;
  company?: {
    id: string;
    name: string;
    logoUrl: string | null;
    city: string | null;
  };
}

export interface JobMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobsResponse {
  data: Job[];
  meta: JobMeta;
}

export interface JobQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  city?: string;
  sortBy?: "createdAt" | "deadline" | "salary" | "title";
  sortOrder?: "asc" | "desc";
}