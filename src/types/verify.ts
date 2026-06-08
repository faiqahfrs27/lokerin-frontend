export interface VerifyResult {
  valid: boolean;
  holderName: string;
  skillTitle: string;
  skillCategory: string;
  score: number;
  issuedAt: string;
  code: string;
}