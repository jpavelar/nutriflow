import Link from "next/link"

export function LoginButton({ children, className, mode = "sign-in" }: {
  children: React.ReactNode
  className?: string
  mode?: "sign-in" | "sign-up"
}) {
  const href = mode === "sign-in" ? "/sign-in" : "/sign-up"

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
