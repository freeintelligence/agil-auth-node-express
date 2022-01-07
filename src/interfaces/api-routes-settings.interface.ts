export interface ApiRoutesSettings {
  login?: {
    enabled?: boolean;
    path?: string;
    findBy?: string[];
    compareBy?: string[];
  };
  register?: {
    enabled?: boolean;
    path?: string;
    fields?: string[];
  };
  logout?: {
    enabled?: boolean;
    path?: string;
  };
  user?: {
    enabled?: boolean;
    path?: string;
  };
}
