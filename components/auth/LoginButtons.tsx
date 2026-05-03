"use client"

import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs"

export function LoginButton({ children, className, mode = "sign-in" }: { children: React.ReactNode, className?: string, mode?: "sign-in" | "sign-up" }) {
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const { signOut, user } = useClerk()

  const handleLogin = async () => {
    // Se o usuário já estiver logado, desloga primeiro para permitir a troca de conta
    if (user) {
      await signOut()
    }

    if (mode === "sign-in" && signIn) {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
        // @ts-ignore
        prompt: "select_account"
      })
    } else if (mode === "sign-up" && signUp) {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
        // @ts-ignore
        prompt: "select_account"
      })
    }
  }

  return (
    <button onClick={handleLogin} className={className}>
      {children}
    </button>
  )
}
