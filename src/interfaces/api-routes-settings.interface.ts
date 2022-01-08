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
    allowOnLogged?: boolean;
    autologin?: boolean;
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
