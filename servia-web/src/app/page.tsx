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
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
            Plataforma para prestadores independentes
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Encontre o prestador<br className="hidden md:block" /> certo para você
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Autônomos, MEIs e pequenas empresas verificados,<br className="hidden md:block" />
            prontos para atender na sua cidade.
          </p>

          {/* Barra de busca */}
          <form action="/buscar" method="get" className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                placeholder="O que você precisa? Ex: encanador, designer..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
            </div>
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Categorias populares</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categorias.map(cat => (
            <Link
              key={cat.slug}
              href={`/buscar?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-xl p-4 hover:border-violet-200 hover:bg-violet-50 transition-all group"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs text-gray-600 text-center font-medium group-hover:text-violet-700 leading-tight">
                {cat.nome}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield size={22} className="text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Perfis verificados</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Prestadores com avaliações reais de clientes anteriores.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap size={22} className="text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contato direto</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Fale diretamente pelo WhatsApp, sem intermediários ou taxas.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star size={22} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Zero custo para começar</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Prestadores criam perfil e recebem clientes gratuitamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA prestador */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Você oferece algum serviço?</h2>
        <p className="text-gray-500 mb-6">
          Crie seu perfil em minutos e comece a receber clientes ainda hoje. Grátis para começar.
        </p>
        <Link
          href="/cadastro"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Anunciar meu serviço
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
