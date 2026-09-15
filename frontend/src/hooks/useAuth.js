import { useMutation } from "@tanstack/react-query";
import { signup, login } from "../api/authApi";

export function useSignup() {
  return useMutation({
    mutationFn: signup,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
