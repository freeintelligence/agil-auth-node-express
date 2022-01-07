export interface ApiRoutesSettings {
  login?: {
    enabled?: boolean;
    path?: string;
    findBy?: string[];
    compareBy?: string[];
  };
  user?: {
    enabled?: boolean;
    path?: string;
  }
}
