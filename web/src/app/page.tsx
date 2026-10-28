import { LockKeyhole } from "lucide-react";

export default function Home() {
  return (
    <main className="grid h-screen overflow-hidden bg-white text-slate-800 lg:grid-cols-[56%_44%]">
      {/* Painel esquerdo */}
      <section className="relative flex min-h-[600px] flex-col justify-between bg-[#1b2635] px-6 py-5 text-white sm:px-8 lg:min-h-0 lg:px-8 xl:px-12">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-white text-base font-bold text-[#1b2635]">
            N
          </span>
          Nexo Assist
        </div>

        <div className="mx-auto w-full max-w-xl py-12">
          <p className="mb-3 text-xs text-slate-400">
            Service desk de TI da Nexo
          </p>

          <h1 className="max-w-lg font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Seu problema de TI, resolvido em uma conversa.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
            Descreva o que está acontecendo. O assistente consulta seus
            chamados, busca na central de ajuda e chama um analista
            quando precisa.
          </p>

          {/* Prévia da conversa */}
          <div className="mt-5 rounded-2xl border border-slate-700 bg-[#222e3d] p-4">
            <div className="mb-2 flex justify-end">
              <div className="max-w-[90%] rounded-xl bg-white px-3 py-2 text-sm text-slate-800">
                Meu notebook não conecta na VPN. Erro 809.
              </div>
            </div>

            <p className="mb-2 text-xs leading-5 text-slate-400">
              <span className="font-semibold text-white">Nexo Assist</span>
              {" "}consultou seus chamados · criou um chamado
            </p>

            <div className="rounded-lg p-2 bg-slate-700/80 py-3 text-sm leading-5 text-slate-100">
              Pronto! Abri o chamado com prioridade alta. Um analista
              fala com você em até 4 h úteis.
            </div>

            <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] text-slate-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <strong>INC-20617</strong>
              <span>Rede e VPN · Alta · em até 4 h</span>
            </div>
          </div>
        </div>

        {/* Indicadores ilustrativos da referência */}
        <div className="grid grid-cols-3 divide-x divide-slate-700 border-t border-slate-700 pt-3">
          <div className="px-2 first:pl-0">
            <p className="font-serif text-3xl">8 s</p>
            <p className="mb-5 text-[10px] leading-4 text-slate-400"> 
              primeira resposta, em média
            </p>
          </div>

          <div className="px-4">
            <p className="font-serif text-3xl">72%</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              resolvidos sem fila
            </p>
          </div>

          <div className="px-4">
            <p className="flex items-center gap-2 font-serif text-3xl">
              6 <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              analistas online agora
            </p>
          </div>
        </div>
      </section>

      {/* Painel direito */}
      <section className="relative flex min-h-[600px] flex-col bg-white px-6 py-5 sm:px-8 lg:min-h-0 lg:px-8 ">
        <div className="flex justify-end text-[11px] text-slate-500">
          Problema para entrar?
          <a href="mailto:ti@nexo.com.br" className="ml-1 font-semibold text-blue-600">
            Ligue no ramal 4000
          </a>
        </div>

        <div className="my-auto w-full max-w-sm self-center py-12">
          <h2 className="font-serif text-3xl tracking-tight">Entrar</h2>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Use seu e-mail corporativo e a senha da rede Nexo.
          </p>

          <form className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium">
                E-mail corporativo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ana.souza@nexo.com.br"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-xs font-medium">
                  
                  Senha
                </label>
                <button type="button" className="text-[11px] cursor-pointer hover:opacity-80 hover:underline font-medium text-blue-600">
                  Esqueci minha senha
                </button>
              </div>
              <div className="flex relative items-center">
                <LockKeyhole className="absolute left-2 w-5 h-5 text-blue-600"/>
              <input
              
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                required
                className="w-full rounded-md border pl-9   border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
                </div>
            
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 cursor-pointer accent-blue-600"
              />
              Manter conectado neste computador
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0866c6] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              Entrar <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100" />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500">
          <span>© 2026 Nexo · Service desk de TI</span>
          <a href="#" className="hover:text-blue-600">
            Privacidade e uso de dados
          </a>
        </footer>
      </section>
    </main>
  );
}
