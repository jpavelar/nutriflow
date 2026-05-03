import { CheckCircle2, MessageCircle, Bell, FileText, UserCheck, LayoutDashboard, Zap, Star } from 'lucide-react'
import { LoginButton } from '@/components/auth/LoginButtons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-verde-primario text-white flex items-center justify-center font-bold text-lg">
              N
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-verde-primario text-lg">NutriFlow</span>
              <span className="text-xs text-gray-500">by TechForja</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <LoginButton mode="sign-in" className="text-sm font-medium text-gray-500 hover:text-verde-primario transition-colors">
              Entrar
            </LoginButton>
            <LoginButton mode="sign-up" className="text-sm font-medium bg-verde-primario text-white px-5 py-2.5 rounded-lg hover:bg-verde-escuro transition-colors">
              Começar agora — é grátis
            </LoginButton>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-creme py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-verde-claro border border-verde-primario text-verde-escuro text-sm font-medium mb-8">
            🌿 Agente de IA para Nutricionistas no WhatsApp
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            Seu assistente de IA no WhatsApp.<br />
            <span className="text-verde-primario">Para nutricionistas que querem atender mais.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-10">
            O NutriFlow responde dúvidas de dieta, envia planos alimentares e lembra
            os pacientes das consultas — automaticamente, 24 horas por dia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center mb-12">
            <LoginButton mode="sign-up" className="bg-verde-primario text-white px-7 py-3.5 rounded-lg font-medium text-base hover:bg-verde-escuro transition-colors w-full sm:w-auto">
              Começar trial gratuito de 14 dias
            </LoginButton>
            <a href="#como-funciona" className="bg-transparent border border-gray-200 text-gray-700 px-7 py-3.5 rounded-lg font-medium text-base hover:bg-gray-50 transition-colors w-full sm:w-auto">
              Ver como funciona
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="w-9 h-9 rounded-full bg-verde-claro border-2 border-white flex items-center justify-center text-verde-escuro text-xs font-bold">AP</div>
              <div className="w-9 h-9 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-green-800 text-xs font-bold">MR</div>
              <div className="w-9 h-9 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-teal-800 text-xs font-bold">JS</div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex text-laranja text-xs mb-0.5">
                <Star fill="currentColor" size={14} />
                <Star fill="currentColor" size={14} />
                <Star fill="currentColor" size={14} />
                <Star fill="currentColor" size={14} />
                <Star fill="currentColor" size={14} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Mais de 10 nutricionistas já usam o NutriFlow</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA SECTION */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Você reconhece alguma dessas situações?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50 rounded-xl p-8 border-l-4 border-laranja">
              <div className="text-4xl font-bold text-gray-900 mb-2">3h/dia</div>
              <div className="font-bold text-gray-900 mb-4">perdidas respondendo dúvidas no WhatsApp</div>
              <p className="text-gray-600 leading-relaxed">
                Alimentos permitidos, substituições, horários de refeição — as mesmas
                perguntas todos os dias, de todos os pacientes.
              </p>
            </div>

            <div className="bg-verde-claro rounded-xl p-8 border-l-4 border-verde-primario">
              <div className="text-4xl font-bold text-gray-900 mb-2">68%</div>
              <div className="font-bold text-gray-900 mb-4">dos pacientes esperam resposta fora do horário</div>
              <p className="text-gray-600 leading-relaxed">
                Pacientes que não recebem suporte fora do horário comercial tendem
                a abandonar o tratamento.
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-8 border-l-4 border-red-600">
              <div className="text-4xl font-bold text-gray-900 mb-2">40%</div>
              <div className="font-bold text-gray-900 mb-4">de abandono por falta de acompanhamento</div>
              <p className="text-gray-600 leading-relaxed">
                Sem suporte entre consultas, a motivação cai e o paciente simplesmente
                para de aparecer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO SECTION */}
      <section className="bg-creme py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-4">✔ A solução</span>
            <h2 className="text-4xl font-bold mb-4">O NutriFlow trabalha por você. Todos os dias, sem parar.</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Configure o agente uma vez com seus protocolos. Ele cuida do resto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: MessageCircle, title: "Responde dúvidas 24/7", desc: "A IA responde dúvidas sobre dieta, substituições e alimentos com base no perfil individual de cada paciente." },
              { icon: Bell, title: "Lembretes automáticos de consulta", desc: "Aviso 24h e 2h antes da consulta. Nenhum paciente esquece e você não precisa lembrar de avisar." },
              { icon: FileText, title: "Envio de plano alimentar em PDF", desc: "A nutricionista faz upload do plano e o paciente recebe no WhatsApp com um clique. Com rastreabilidade de visualização." },
              { icon: UserCheck, title: "Fallback inteligente para você", desc: "Se o paciente mencionar sintomas, dor ou emergência, o sistema alerta imediatamente você no WhatsApp." },
              { icon: LayoutDashboard, title: "Dashboard de acompanhamento", desc: "Veja todas as interações, próximas consultas e histórico de cada paciente em um painel centralizado." },
              { icon: Zap, title: "Configuração em 1 hora", desc: "Onboarding assistido pela equipe NutriFlow. Você fala, a IA aprende. Sem necessidade técnica." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-verde-claro flex items-center justify-center text-verde-primario">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA SECTION */}
      <section id="como-funciona" className="bg-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold mb-4">⚙️ Como funciona</span>
            <h2 className="text-4xl font-bold">Configurado uma vez. Funciona para sempre.</h2>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-verde-primario text-white font-bold text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl mb-3">Configure o agente com seus protocolos</h3>
                <p className="text-gray-600">Na sessão de onboarding (1h ao vivo com nossa equipe), você define a linguagem, os protocolos nutricionais, os alimentos permitidos e as restrições que a IA deve respeitar.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-verde-primario text-white font-bold text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl mb-3">Seus pacientes interagem normalmente no WhatsApp</h3>
                <p className="text-gray-600">Nada muda para o paciente. Ele continua mandando mensagem no mesmo número. A IA responde com seu protocolo e sua linguagem.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-verde-primario text-white font-bold text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl mb-3">Você acompanha tudo pelo dashboard</h3>
                <p className="text-gray-600">Cada interação fica registrada. Você vê o histórico, recebe alertas de fallback e acompanha o engajamento de cada paciente.</p>
              </div>
            </div>

          </div>

          <div className="mt-16 bg-verde-claro border border-verde-primario rounded-xl p-6 text-center">
            <p className="text-verde-escuro font-medium">
              💡 A IA nunca substitui o julgamento clínico da nutricionista. Ela cuida do atendimento rotineiro enquanto você foca no que realmente importa.
            </p>
          </div>
        </div>
      </section>

      {/* PREÇOS SECTION */}
      <section id="precos" className="bg-creme py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">💰 Planos e preços</span>
            <h2 className="text-4xl font-bold mb-4">Simples, transparente, sem surpresas.</h2>
            <p className="text-xl text-gray-500">Trial gratuito de 14 dias em todos os planos. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            {/* Essencial */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Essencial</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">R$ 197</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">até 30 pacientes ativos</p>
              <div className="h-px bg-gray-200 w-full mb-6"></div>
              <ul className="space-y-4 mb-8">
                {['Agente IA via WhatsApp', 'Responder dúvidas frequentes', 'Lembretes de consulta 24h e 2h', 'Envio de plano alimentar PDF', 'Dashboard básico', 'Suporte via chat'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="priceId" value={process.env.STRIPE_PRICE_ESSENCIAL} />
                <button type="submit" className="w-full py-3 px-4 rounded-lg border-2 border-verde-primario text-verde-primario font-semibold hover:bg-verde-claro transition-colors">
                  Começar trial — Essencial
                </button>
              </form>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-verde-primario p-8 shadow-xl relative scale-100 md:scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-laranja text-white text-xs font-bold uppercase py-1 px-3 rounded-full">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">R$ 397</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">até 100 pacientes ativos</p>
              <div className="h-px bg-gray-200 w-full mb-6"></div>
              <ul className="space-y-4 mb-8">
                {['Tudo do Essencial', 'Dashboard completo', 'Agendamento online (V1.1)', 'Mensagem motivacional semanal', 'Suporte prioritário'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                    <span className={i === 0 ? "font-semibold" : ""}>{feat}</span>
                  </li>
                ))}
              </ul>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="priceId" value={process.env.STRIPE_PRICE_PRO} />
                <button type="submit" className="w-full py-3 px-4 rounded-lg bg-verde-primario text-white font-semibold hover:bg-verde-escuro transition-colors">
                  Começar trial — Pro
                </button>
              </form>
            </div>

            {/* Clínica */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Clínica</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">R$ 797</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">até 400 pacientes · até 5 usuários</p>
              <div className="h-px bg-gray-200 w-full mb-6"></div>
              <ul className="space-y-4 mb-8">
                {['Tudo do Pro', 'Múltiplos usuários (até 5)', 'Suporte dedicado', 'Onboarding personalizado'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                    <span className={i === 0 ? "font-semibold" : ""}>{feat}</span>
                  </li>
                ))}
              </ul>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="priceId" value={process.env.STRIPE_PRICE_CLINICA} />
                <button type="submit" className="w-full py-3 px-4 rounded-lg border-2 border-verde-primario text-verde-primario font-semibold hover:bg-verde-claro transition-colors">
                  Começar trial — Clínica
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16 text-center text-gray-500">
            <p>Break-even: apenas 4 clientes no Plano Essencial já cobrem todos os custos operacionais.</p>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS SECTION */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">O que nutricionistas dizem</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex text-laranja mb-6">
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
              </div>
              <p className="text-lg text-gray-700 mb-8 italic">"Depoimento da nutricionista piloto — adicionar após onboarding."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-verde-claro rounded-full flex items-center justify-center text-verde-escuro font-bold text-xl">A</div>
                <div>
                  <div className="font-bold text-gray-900">Ana Paula M.</div>
                  <div className="text-sm text-gray-500">Nutricionista clínica · São Paulo</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex text-laranja mb-6">
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
              </div>
              <p className="text-lg text-gray-700 mb-8 italic">"Depoimento da nutricionista piloto — adicionar após onboarding."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-verde-claro rounded-full flex items-center justify-center text-verde-escuro font-bold text-xl">C</div>
                <div>
                  <div className="font-bold text-gray-900">Carolina R.</div>
                  <div className="text-sm text-gray-500">Nutricionista esportiva · Rio de Janeiro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-creme py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas frequentes</h2>

          <Accordion type="single" collapsible className="w-full bg-white rounded-xl p-6 shadow-sm">
            {[
              { q: "Preciso saber programar para usar o NutriFlow?", a: "Não. O setup é feito em uma sessão de 1 hora ao vivo com nossa equipe. Você define os protocolos, a gente configura tudo." },
              { q: "O paciente sabe que está falando com IA?", a: "Isso fica a seu critério. Você pode configurar o agente para se apresentar como assistente virtual ou manter a experiência transparente para o paciente." },
              { q: "O que acontece se a IA não souber responder?", a: "O sistema detecta automaticamente e encaminha a mensagem diretamente para o seu WhatsApp com o contexto completo da conversa." },
              { q: "Como funciona o trial gratuito de 14 dias?", a: "Acesso completo ao plano escolhido por 14 dias, sem cobrança. Cancele antes do vencimento sem nenhum custo." },
              { q: "Posso cancelar a qualquer momento?", a: "Sim. Sem multa, sem burocracia. Cancele pelo dashboard com 1 clique e o acesso segue ativo até o fim do período pago." },
              { q: "O NutriFlow é permitido pelo CFN?", a: "Sim. O agente responde apenas dúvidas gerais de nutrição com base nos seus protocolos. Toda prescrição e julgamento clínico permanece com você." },
              { q: "Quanto tempo leva para configurar?", a: "Em média 1 hora na sessão de onboarding. Após isso o agente está ativo para todos os seus pacientes." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-gray-900 text-lg hover:text-verde-primario">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-verde-primario py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Lance imperfeito. Aprenda com suas pacientes. Itere rápido.
          </h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            O mercado tem 194.000 nutricionistas no Brasil. Seja uma das primeiras a
            automatizar seu atendimento.
          </p>
          <div className="flex flex-col items-center gap-4">
            <LoginButton mode="sign-up" className="bg-white text-verde-primario px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg">
              Começar trial gratuito — 14 dias
            </LoginButton>
            <span className="text-teal-200 text-sm">Sem cartão de crédito para começar.</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-bold text-base">
                N
              </div>
              <span className="font-bold text-white text-lg">NutriFlow</span>
              <span className="text-xs text-gray-400">by TechForja</span>
            </div>
            <p className="text-gray-400 text-sm">Automatizando o atendimento nutricional no Brasil.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#precos" className="hover:text-white transition-colors">Preços</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2026 TechForja. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
