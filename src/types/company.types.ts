export interface PublicCompany {
  id: string;
  name: string;
  city: string | null;
  logoUrl: string | null;
  _count: { jobs: number };
}

export interface CompanyDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  logoUrl: string | null;
  descriptionRte: string | null;
  jobs: CompanyJob[];
}

export interface CompanyJob {
  id: string;
  title: string;
  city: string | null;
  salary: number | string | null;
  deadline: string | null;
  hasTest: boolean;
  createdAt: string;
  tags: string[] | null;
  category: { id: string; name: string };
}

export interface CompaniesResponse {
  data: PublicCompany[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}