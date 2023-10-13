export type AuthenticationUserType = {
  user_id: string;
  email: string;
  first_name: string;
} | null;
export type SetFlagType = (value: boolean) => void;
export type SetUserType = (user: AuthenticationUserType) => void;

export interface AuthenticationState {
  isInitialised: boolean;
  isLoading: boolean;
  user: AuthenticationUserType;
  setIsInitialised: SetFlagType;
  setIsLoading: SetFlagType;
  setUser: SetUserType;
}
