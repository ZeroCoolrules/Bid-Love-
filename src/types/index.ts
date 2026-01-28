export interface Character {
  id: string;
  user_id?: string;
  name: string;
  avatar_url: string;
  bio: string;
  age: number;
  location: string;
  dating_tier: 'hookup' | 'casual' | 'relationship';
  personality_traits: string[];
  interests: string[];
  token_ask: number;
  token_balance: number;
  reputation_score: number;
  total_dates: number;
  successful_dates: number;
  is_datee: boolean;
  created_at: string;
  updated_at: string;
}

export interface DateListing {
  id: string;
  datee_id: string;
  datee?: Character;
  title: string;
  description: string;
  dating_tier: 'hookup' | 'casual' | 'relationship';
  token_ask: number;
  preferred_activities: string[];
  date_scenario: DateScenario;
  venue_preference: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  expires_at?: string;
  created_at: string;
}

export interface DateBid {
  id: string;
  listing_id: string;
  dater_id: string;
  dater?: Character;
  token_amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
}

export interface DateScenario {
  steps: DateStep[];
  current_step: number;
}

export interface DateStep {
  id: string;
  location: string;
  venue_id?: string;
  activity: string;
  description: string;
  duration_minutes: number;
  choices?: DateChoice[];
  outcome?: string;
}

export interface DateChoice {
  id: string;
  text: string;
  next_step_id?: string;
  compatibility_impact: number;
  token_cost?: number;
}

export interface DateSession {
  id: string;
  listing_id?: string;
  bid_id?: string;
  datee_id: string;
  dater_id: string;
  datee?: Character;
  dater?: Character;
  token_amount: number;
  date_mode: 'sim' | 'manual';
  current_step: number;
  total_steps: number;
  compatibility_score: number;
  communication_score: number;
  engagement_score: number;
  scenario_data: {
    steps: DateStep[];
  };
  choices_made: DateChoiceMade[];
  chat_messages: ChatMessage[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DateChoiceMade {
  step_id: string;
  choice_id: string;
  choice_text: string;
  compatibility_impact: number;
  response: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  timestamp: string;
}



export interface DateAnalytics {
  id: string;
  date_id: string;
  compatibility_score: number;
  communication_score: number;
  engagement_score: number;
  decision_analysis: {
    good_choices: string[];
    missed_opportunities: string[];
    key_moments: string[];
  };
  improvement_tips: string[];
  created_at: string;
}

export interface TokenTransaction {
  id: string;
  character_id: string;
  transaction_type: 'purchase' | 'sale' | 'bid' | 'refund' | 'earned' | 'cashout';
  amount: number;
  balance_after: number;
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  venue_type: string;
  description: string;
  image_url: string;
  ambiance: string;
  token_cost: number;
  location_area: string;
  created_at: string;
}



export interface CashoutRequest {
  id: string;
  character_id: string;
  user_id: string;
  token_amount: number;
  usd_amount: number;
  fee_amount: number;
  net_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  stripe_account_id?: string;
  stripe_transfer_id?: string;
  payout_method: string;
  failure_reason?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StripeConnectAccount {
  id: string;
  user_id: string;
  character_id?: string;
  stripe_account_id: string;
  account_status: 'pending' | 'active' | 'restricted' | 'disabled';
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  country: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserState {
  character: Character | null;
  tokenBalance: number;
  isAuthenticated: boolean;
}
