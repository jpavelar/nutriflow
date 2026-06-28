"use client"

import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs"

export function LoginButton({ children, className, mode = "sign-in" }: {
  children: React.ReactNode
  className?: string
  mode?: "sign-in" | "sign-up"
}) {
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const { signOut } = useClerk()

  const triggerOAuth = async () => {
    if (mode === "sign-in" && signIn && signInLoaded) {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
        oidcPrompt: "select_account",
      })
    } else if (mode === "sign-up" && signUp && signUpLoaded) {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
        oidcPrompt: "select_account",
      })
    }
  }

  const handleLogin = async () => {
    try {
      await triggerOAuth()
    } catch (err: any) {
      const isSessionIssue =
        err?.message?.toLowerCase().includes("already signed in") ||
        err?.errors?.some?.((e: any) =>
          e.code === "session_exists" || e.code === "authorization_invalid"
        )

      if (isSessionIssue) {
        window.location.href = '/dashboard'
      } else {
        console.error("Erro no login:", err)
      }
    }
  }

  return (
    <button onClick={handleLogin} className={className}>
      {children}
    </button>
  )
}
