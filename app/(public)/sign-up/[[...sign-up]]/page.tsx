import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-verde-primario text-3xl font-bold">NutriFlow</span>
          <span className="text-gray-500 text-sm">by TechForja</span>
        </div>
        <p className="text-gray-600 font-medium">Comece seu trial gratuito de 14 dias</p>
      </div>
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}
