export interface ApiRoutesSettings {
  login?: {
    enabled?: boolean;
    path?: string;
    fields?: string[];
  };
  user?: {
    enabled?: boolean;
    path?: string;
  }
}
