interface Campaign {
  id: number;
  subject: string;
  body: string;
  created_at: string;
  sent: boolean;
}

interface NewsLetter {
  id: number;
  title: string;
  sections: string;
  created_at?: string;
  date_generated: string;
  sent: boolean;
}

export type { Campaign, NewsLetter };
