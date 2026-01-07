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

interface Subscriber {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  subscription: {
    active: boolean;
    subscribed_at: string;
    unsubscribed_at: string | null;
    resubscribed_at: string | null;
  };
}

export type { Campaign, NewsLetter, Subscriber };
