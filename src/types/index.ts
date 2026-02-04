export interface CoupletRequest {
  theme: string;
  style?: 'traditional' | 'modern' | 'humorous';
}

export interface CoupletResponse {
  upper: string;    // 上联
  lower: string;    // 下联
  horizontal: string; // 横批
  explanation?: string; // 解释说明
}

export interface FortuneCard {
  id: string;
  title: string;
  content: string;
  blessing: string;
  type: 'career' | 'love' | 'health' | 'wealth';
  upper_trigram?: string;
  lower_trigram?: string;
}

export interface AudioConfig {
  firecracker: {
    url: string;
    volume: number;
    preload: boolean;
  };
  background: {
    url: string;
    volume: number;
    loop: boolean;
  };
}

export interface AppState {
  currentPage: 'home' | 'couplet' | 'fortune' | 'firecrackers';
  coupletHistory: CoupletResponse[];
  fortuneHistory: FortuneCard[];
  settings: {
    soundEnabled: boolean;
    animationEnabled: boolean;
  };
}
