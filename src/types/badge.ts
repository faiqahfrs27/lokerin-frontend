export interface MyBadge {
  id: string;
  earnedAt: string;
  assessment: {
    id: string;
    title: string;
    skillCategory: string;
    badgePhoto: string | null;
  };
  result: {
    score: number | null;
  };
}