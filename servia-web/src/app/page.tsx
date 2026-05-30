import Link from 'next/link'
import { Search, Star, Shield, Zap, ArrowRight } from 'lucide-react'

const categorias = [
  { slug: 'reformas', nome: 'Reformas', emoji: '🔨' },
  { slug: 'eletricista', nome: 'Eletricista', emoji: '⚡' },
  { slug: 'encanamento', nome: 'Encanamento', emoji: '💧' },
  { slug: 'limpeza', nome: 'Limpeza', emoji: '✨' },
  { slug: 'tecnologia', nome: 'Tecnologia', emoji: '💻' },
  { slug: 'beleza', nome: 'Beleza', emoji: '💇' },
  { slug: 'aulas', nome: 'Aulas', emoji: '📚' },
  { slug: 'design', nome: 'Design', emoji: '🎨' },
  { slug: 'fotografia', nome: 'Fotografia', emoji: '📷' },
  { slug: 'eventos', nome: 'Eventos', emoji: '🎉' },
  { slug: 'saude', nome: 'Saúde', emoji: '❤️' },
  { slug: 'outros', nome: 'Outros', emoji: '🔍' },
]

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-24 pb-20 border-b border-slate-100/60 bg-gradient-to-b from-white via-slate-50/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 text-[11px] font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse-slow" />
            Plataforma para prestadores independentes
          </span>
          <h1 className="text-4xl md:text-[54px] font-extrabold text-slate-800 mb-6 leading-tight tracking-tight">
            Encontre o prestador ideal <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              para qualquer serviço
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Profissionais autônomos, MEIs e pequenas empresas verificados,<br className="hidden md:block" />
            prontos para atender na sua região sem taxas ocultas.
          </p>

          {/* Barra de busca */}
          <form action="/buscar" method="get" className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-premium hover:shadow-premium-hover transition-all duration-300">
            <div className="flex-1 relative flex items-center">
              <Search size={16} className="absolute left-4 text-slate-400" />
              <input
                name="q"
                type="text"
                placeholder="O que você precisa? Ex: eletricista, pintor, TI..."
                className="w-full pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 cursor-pointer active:scale-[0.98]"
            >
              Buscar agora
            </button>
          </form>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-6xl mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Categorias populares</h2>
            <p className="text-sm text-slate-400 mt-1">Navegue pelos tipos de serviços mais solicitados na plataforma</p>
          </div>
          <Link href="/buscar" className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:translate-x-0.5 transition-all self-start">
            Ver todas as categorias →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {categorias.map(cat => (
            <Link
              key={cat.slug}
              href={`/buscar?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 bg-white border border-slate-100 rounded-2xl p-5 hover:border-violet-200 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-violet-50 transition-colors duration-300">
                {cat.emoji}
              </div>
              <span className="text-[13px] text-slate-700 text-center font-bold group-hover:text-violet-700 leading-tight">
                {cat.nome}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-white border-y border-slate-100/60 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Por que escolher o Servia?</h2>
            <p className="text-sm text-slate-400 mt-1">Conectamos você diretamente a profissionais de confiança, sem complicações.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50/50 rounded-2xl p-6.5 border border-slate-100/20 hover:shadow-premium transition-shadow duration-300">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-5 shadow-xs">
                <Shield size={22} className="text-violet-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Perfis verificados</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Acesse o portfólio, cidades de atuação e avaliações reais de clientes anteriores antes de fazer a contratação.
              </p>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-6.5 border border-slate-100/20 hover:shadow-premium transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5 shadow-xs">
                <Zap size={22} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Contato direto</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Negocie diretamente através do WhatsApp. Sem intermediários, sem comissões cobradas sobre os seus orçamentos.
              </p>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-6.5 border border-slate-100/20 hover:shadow-premium transition-shadow duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5 shadow-xs">
                <Star size={22} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Zero custo para começar</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Prestadores criam perfis completos e começam a receber cliques e contatos de clientes gratuitamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA prestador */}
      <section className="max-w-5xl mx-auto px-4 py-20 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-10 md:p-14 shadow-premium relative overflow-hidden text-center md:text-left">
          {/* Accent lighting for CTA card */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-violet-600/20 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="inline-block bg-white/10 text-white/90 text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Trabalhe Conosco
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Você oferece algum serviço?
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 md:mb-0">
                Cadastre suas especialidades, mostre suas fotos e comece a receber pedidos de clientes locais ainda hoje. É simples e gratuito.
              </p>
            </div>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-6.5 py-3.5 rounded-xl font-bold transition-all duration-200 hover:shadow-lg active:scale-[0.98] whitespace-nowrap self-center"
            >
              Anunciar meu serviço
              <ArrowRight size={16} className="text-slate-900" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
