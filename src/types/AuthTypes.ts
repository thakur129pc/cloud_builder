export interface AuthObj {
  access_token: string;
  id_token: string;
  refresh_token: string;
  is_admin: boolean;
}

export interface AuthState {
  authObj: AuthObj | null;
  authLoading: boolean;
  email: string;
  fromLogin: boolean;
}
