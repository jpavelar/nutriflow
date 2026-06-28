import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-verde-primario text-3xl font-bold">NutriFlow</span>
          <span className="text-gray-500 text-sm">by TechForja</span>
        </div>
        <p className="text-gray-600">Automatize seu atendimento. Foque nas consultas.</p>
      </div>
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}
