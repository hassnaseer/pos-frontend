import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  login as loginAction,
  logout as logoutAction,
  resendOTP as resendOTPAction,
  signup as signupAction,
  verifyOTP as verifyOTPAction,
  UserRole,
  SignupData,
  VerifyOTPResult,
  User,
} from "../../store/auth";
import type { RootState } from "../../store";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  return useMemo(
    () => ({
      user,
      login: (email: string, password: string) =>
        dispatch(loginAction({ email, password })).unwrap(),
      signup: (data: SignupData) => dispatch(signupAction(data)).unwrap(),
      verifyOTP: (email: string, otp: string, flow: string) =>
        dispatch(verifyOTPAction({ email, otp, flow })).unwrap(),
      resendOTP: (email: string, flow: string) =>
        dispatch(resendOTPAction({ email, flow })).unwrap(),
      logout: () => dispatch(logoutAction()),
    }),
    [dispatch, user]
  );
}

export type { UserRole, SignupData, VerifyOTPResult, User };
