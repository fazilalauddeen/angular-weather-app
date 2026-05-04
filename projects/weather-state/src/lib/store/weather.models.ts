export type RefreshSource = 'init' | 'manual' | 'poll';

export type CityWeather = {
  city: string;
  temperature: number | null;
  loading: boolean;
  error: string | null;
  lastUpdatedAt: number | null;
};

