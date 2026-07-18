'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type TabKey = 'Hoje' | '7 Dias' | '30 Dias';
type NavPage = 'dashboard' | 'vendas' | 'estoque' | 'caixas';

// ============================================================
// HOOK: Dark Mode (persiste em localStorage)
// ============================================================
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return { isDark, toggleDark };
}

// ============================================================
// BOTÃO DARK MODE
// ============================================================
function DarkToggleButton({ isDark, toggleDark, className = '' }: { isDark: boolean; toggleDark: () => void; className?: string }) {
  return (
    <button onClick={toggleDark} className={`p-2 rounded-lg transition-colors ${className}`} title="Alternar tema">
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

// ============================================================
// PÁGINA DE LOGIN
// ============================================================
function LoginPage({ onLogin, isDark, toggleDark }: { onLogin: (user: any) => void; isDark: boolean; toggleDark: () => void }) {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const { data, error } = await supabase
        .from('utilizadores_web')
        .select('*')
        .eq('username', username)
        .eq('senha_hash', senha)
        .maybeSingle();
      if (error) setErro(`Erro do Supabase: ${error.message}`);
      else if (!data) setErro('Utilizador ou senha incorretos.');
      else onLogin(data);
    } catch {
      setErro('Erro ao conectar à nuvem.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f0eeee] dark:bg-zinc-950 flex items-center justify-center px-4 transition-colors">
      <div className="absolute top-4 right-4">
        <DarkToggleButton isDark={isDark} toggleDark={toggleDark} className="bg-white dark:bg-zinc-800 shadow-sm border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-300 rounded-full" />
      </div>
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 p-8 transition-colors">
          <div className="text-center mb-8">
            {!imgError ? (
              <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                <img src="/logo.png" alt="Elite Company Logo" className="w-full h-full object-contain" onError={() => setImgError(true)} />
              </div>
            ) : (
              <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center bg-slate-50 dark:bg-zinc-800 rounded-full">
                <span className="font-bold text-2xl text-[#68c18a]">EC</span>
              </div>
            )}
            {!imgError ? null : <h1 className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Elite Company</h1>}
            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Painel de Controlo da Loja</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#2d2d2d] dark:text-zinc-200 mb-2">Utilizador</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" required
                className="w-full border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#68c18a] focus:ring-2 focus:ring-[#68c18a]/20 transition-all bg-slate-50 dark:bg-zinc-800 text-[#2d2d2d] dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2d2d2d] dark:text-zinc-200 mb-2">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••" required
                className="w-full border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#68c18a] focus:ring-2 focus:ring-[#68c18a]/20 transition-all bg-slate-50 dark:bg-zinc-800 text-[#2d2d2d] dark:text-white" />
            </div>
            {erro && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl border border-red-200 dark:border-red-800/50">{erro}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#68c18a] text-white font-bold py-3 rounded-xl hover:bg-[#5bb07b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
              {loading ? 'A verificar...' : 'Entrar no Painel'}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-6">Aceda ao seu painel em tempo real na nuvem.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PRINCIPAL
// ============================================================
function DashboardApp({ onLogout, user, isDark, toggleDark }: { onLogout: () => void; user: any; isDark: boolean; toggleDark: () => void }) {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [activeTab, setActiveTab] = useState<TabKey>('Hoje');
  const [menuOpen, setMenuOpen] = useState(false);

  // Dados reais da nuvem
  const [vendasCloud, setVendasCloud] = useState<any[]>([]);
  const [produtosCloud, setProdutosCloud] = useState<any[]>([]);
  const [caixasCloud, setCaixasCloud] = useState<any[]>([]);
  const [vendaDetalhes, setVendaDetalhes] = useState<any | null>(null);
  const [loadingEstoque, setLoadingEstoque] = useState(false);
  const [loadingCaixas, setLoadingCaixas] = useState(false);

  const tenantId = user?.tenant_id;

  // Fetch Vendas
  useEffect(() => {
    if (!tenantId) return;
    const fetchVendas = async () => {
      const { data } = await supabase
        .from('vendas_cloud')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('data_hora', { ascending: false });
      if (data) {
        setVendasCloud(data.map(v => ({
          id: v.venda_id_local,
          caixa_id_local: v.caixa_id_local,
          caixa: `Caixa ${String(v.caixa_id_local).padStart(2, '0')}`,
          total: Number(v.total_liquido),
          forma: v.forma_pagamento,
          data_hora: v.data_hora,
          hora: new Date(v.data_hora).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          status: v.status,
        })));
      }
    };
    fetchVendas();

    const channel = supabase.channel('vendas_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendas_cloud', filter: `tenant_id=eq.${tenantId}` }, fetchVendas)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenantId]);

  // Fetch Produtos / Estoque
  useEffect(() => {
    if (!tenantId) return;
    const fetchProdutos = async () => {
      setLoadingEstoque(true);
      const { data } = await supabase
        .from('produtos_cloud')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('nome', { ascending: true });
      if (data) setProdutosCloud(data);
      setLoadingEstoque(false);
    };
    fetchProdutos();

    const channel = supabase.channel('produtos_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos_cloud', filter: `tenant_id=eq.${tenantId}` }, fetchProdutos)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenantId]);

  // Fetch Caixas
  useEffect(() => {
    if (!tenantId) return;
    const fetchCaixas = async () => {
      setLoadingCaixas(true);
      const { data } = await supabase
        .from('caixas_cloud')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('data_abertura', { ascending: false });
      if (data) setCaixasCloud(data);
      setLoadingCaixas(false);
    };
    fetchCaixas();

    const channel = supabase.channel('caixas_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'caixas_cloud', filter: `tenant_id=eq.${tenantId}` }, fetchCaixas)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenantId]);

  // KPIs e gráfico
  const listaVendas = vendasCloud;
  const vendasValidas = listaVendas.filter(v => v.status !== 'CANCELADA');
  const now = new Date();

  const filteredVendas = vendasValidas.filter(v => {
    const d = new Date(v.data_hora);
    if (activeTab === 'Hoje') return d.toDateString() === now.toDateString();
    const diff = Math.ceil(Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return activeTab === '7 Dias' ? diff <= 7 : diff <= 30;
  });

  const totalFaturamento = filteredVendas.reduce((s, v) => s + v.total, 0);
  const totalVendas = filteredVendas.length;
  const ticketMedio = totalVendas > 0 ? totalFaturamento / totalVendas : 0;
  const produtosBaixoEstoque = produtosCloud.filter(p => Number(p.estoque_atual) <= Number(p.estoque_minimo));
  const caixasAbertas = caixasCloud.filter(c => c.status_fluxo === 'ABERTO');

  const kpi = {
    faturamento: `${totalFaturamento.toLocaleString('pt', { minimumFractionDigits: 2 })} MT`,
    vendas: totalVendas,
    ticket: `${ticketMedio.toLocaleString('pt', { minimumFractionDigits: 2 })} MT`,
    alertas: produtosBaixoEstoque.length,
  };

  // Gráfico dinâmico
  let chartData: number[] = [];
  let chartLabels: string[] = [];

  if (activeTab === 'Hoje') {
    chartLabels = Array.from({ length: 12 }, (_, i) => `${i + 8}h`);
    chartData = Array(12).fill(0);
    filteredVendas.forEach(v => {
      const h = new Date(v.data_hora).getHours();
      const idx = h - 8;
      if (idx >= 0 && idx < 12) chartData[idx] += v.total;
    });
  } else if (activeTab === '7 Dias') {
    chartLabels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('pt-PT', { weekday: 'short' });
    });
    chartData = Array(7).fill(0);
    filteredVendas.forEach(v => {
      const diff = Math.floor((now.getTime() - new Date(v.data_hora).getTime()) / (1000 * 60 * 60 * 24));
      const idx = 6 - diff;
      if (idx >= 0 && idx < 7) chartData[idx] += v.total;
    });
  } else {
    chartLabels = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (29 - i));
      return d.getDate().toString();
    });
    chartData = Array(30).fill(0);
    filteredVendas.forEach(v => {
      const diff = Math.floor((now.getTime() - new Date(v.data_hora).getTime()) / (1000 * 60 * 60 * 24));
      const idx = 29 - diff;
      if (idx >= 0 && idx < 30) chartData[idx] += v.total;
    });
  }

  const maxChart = Math.max(...chartData, 1);
  const chartHeights = chartData.map(v => (v / maxChart) * 100);

  const navItems: { id: NavPage; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'vendas', label: 'Vendas', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'estoque', label: 'Estoque', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'caixas', label: 'Caixas', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  const navBg = 'bg-[#2d2d2d] dark:bg-zinc-900';
  const cardClass = 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-colors';

  return (
    <div className="min-h-screen bg-[#f0eeee] dark:bg-zinc-950 overflow-x-hidden transition-colors">
      {/* ── Navbar ── */}
      <nav className={`sticky top-0 z-50 ${navBg} shadow-md transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-[#3d3d3d] text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="font-bold text-xl tracking-tight text-white">Elite<span className="font-light text-slate-300">Company</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setActivePage(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activePage === item.id ? 'bg-[#68c18a] text-white' : 'text-slate-300 hover:bg-[#3d3d3d] hover:text-white'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  {item.label}
                  {item.id === 'estoque' && produtosBaixoEstoque.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{produtosBaixoEstoque.length}</span>
                  )}
                  {item.id === 'caixas' && caixasAbertas.length > 0 && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{caixasAbertas.length}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <DarkToggleButton isDark={isDark} toggleDark={toggleDark} className="text-slate-300 hover:text-white hover:bg-[#3d3d3d]" />
              <button onClick={onLogout} className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-[#3d3d3d]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1a1a1a] border-t border-[#3d3d3d] px-4 py-3 space-y-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setActivePage(item.id); setMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 ${activePage === item.id ? 'bg-[#68c18a] text-white' : 'text-slate-300 hover:bg-[#3d3d3d]'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">

        {/* ══════════════════════════════════════
            VISÃO GERAL
        ══════════════════════════════════════ */}
        {activePage === 'dashboard' && (
          <div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Visão Geral</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Acompanhe o desempenho da sua loja em tempo real.</p>
              </div>
              <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 w-fit">
                {(['Hoje', '7 Dias', '30 Dias'] as TabKey[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-[#2d2d2d] dark:bg-zinc-700 text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-[#2d2d2d] dark:hover:text-white'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Faturamento', value: kpi.faturamento, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-[#68c18a]' },
                { label: 'Vendas', value: String(kpi.vendas), icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'text-blue-500' },
                { label: 'Ticket Médio', value: kpi.ticket, icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'text-purple-500' },
                { label: 'Alertas Estoque', value: `${kpi.alertas} itens`, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-orange-500' },
              ].map((kpiItem, i) => (
                <div key={i} className={`${cardClass} p-4 hover:shadow-md hover:border-[#68c18a]/30`}
                  onClick={i === 3 ? () => setActivePage('estoque') : undefined}
                  style={i === 3 ? { cursor: 'pointer' } : {}}>
                  <div className={`mb-3 ${kpiItem.color}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={kpiItem.icon} />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-zinc-400 text-xs font-medium mb-1">{kpiItem.label}</p>
                  <p className="text-lg font-bold text-[#2d2d2d] dark:text-white leading-tight">{kpiItem.value}</p>
                </div>
              ))}
            </div>

            {/* Gráfico + Últimas Vendas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 ${cardClass} p-6 h-[320px] flex flex-col`}>
                <h2 className="text-base font-bold text-[#2d2d2d] dark:text-white mb-4">Vendas — {activeTab}</h2>
                <div className="flex-1 flex items-end justify-between gap-1 pb-4">
                  {chartHeights.map((height, i) => (
                    <div key={i} className="relative w-full group flex flex-col justify-end h-full">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2d2d2d] dark:bg-zinc-700 text-white text-[10px] px-1.5 py-1 rounded-md whitespace-nowrap z-10 pointer-events-none">
                        MT {(chartData[i] || 0).toLocaleString('pt')}
                      </div>
                      <div className={`w-full rounded-t-sm transition-all cursor-pointer ${height > 0 ? 'bg-[#68c18a] opacity-75 group-hover:opacity-100' : 'bg-slate-100 dark:bg-zinc-800'}`}
                        style={{ height: `${Math.max(height, 2)}%` }}></div>
                      <div className="text-[9px] text-slate-400 dark:text-zinc-500 text-center mt-1 font-medium truncate">{chartLabels[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${cardClass} p-6 flex flex-col`}>
                <h2 className="text-base font-bold text-[#2d2d2d] dark:text-white mb-4">Últimas Vendas</h2>
                <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                  {listaVendas.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-zinc-400 text-center mt-6">Nenhuma venda registada.</p>
                  ) : listaVendas.slice(0, 5).map(v => (
                    <button key={v.id} onClick={() => { setVendaDetalhes(v); setActivePage('vendas'); }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-100 dark:border-zinc-700/50 text-left transition-colors">
                      <div>
                        <p className="text-sm font-bold text-[#2d2d2d] dark:text-zinc-200">{v.caixa}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{v.hora}</p>
                      </div>
                      <span className={`text-sm font-bold ${v.status === 'CANCELADA' ? 'text-red-500' : 'text-[#68c18a]'}`}>
                        MT {v.total.toLocaleString('pt', { minimumFractionDigits: 2 })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            VENDAS
        ══════════════════════════════════════ */}
        {activePage === 'vendas' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Registo de Vendas</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Todas as transacções sincronizadas com a nuvem.</p>
              </div>
              {vendaDetalhes && (
                <button onClick={() => setVendaDetalhes(null)} className="text-sm text-[#68c18a] font-semibold hover:underline">
                  ← Limpar selecção
                </button>
              )}
            </div>

            {vendaDetalhes && (
              <div className={`${cardClass} border-[#68c18a]/40 p-5 mb-6`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-[#2d2d2d] dark:text-white">Detalhe da Venda #{vendaDetalhes.id}</h3>
                  <button onClick={() => setVendaDetalhes(null)} className="text-slate-400 hover:text-[#2d2d2d] dark:hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Caixa', value: vendaDetalhes.caixa },
                    { label: 'Hora', value: vendaDetalhes.hora },
                    { label: 'Forma de Pagamento', value: vendaDetalhes.forma },
                    { label: 'Total', value: `MT ${vendaDetalhes.total.toLocaleString('pt', { minimumFractionDigits: 2 })}` },
                  ].map((d, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">{d.label}</p>
                      <p className="font-bold text-[#2d2d2d] dark:text-white text-sm">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${vendaDetalhes.status === 'CANCELADA' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${vendaDetalhes.status === 'CANCELADA' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  {vendaDetalhes.status}
                </div>
              </div>
            )}

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {listaVendas.length === 0 ? (
                <div className={`${cardClass} p-8 text-center text-slate-500 dark:text-zinc-400`}>Sem vendas registadas na nuvem.</div>
              ) : listaVendas.map(v => (
                <div key={v.id} onClick={() => setVendaDetalhes(vendaDetalhes?.id === v.id ? null : v)}
                  className={`${cardClass} p-4 cursor-pointer transition-colors ${vendaDetalhes?.id === v.id ? 'border-[#68c18a] bg-[#68c18a]/5' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-[#2d2d2d] dark:text-zinc-100">{v.caixa}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">ID: {v.id} • {v.hora}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${v.status === 'CANCELADA' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                      {v.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/50">
                    <p className="text-sm text-slate-500 dark:text-zinc-400">{v.forma}</p>
                    <p className="font-bold text-[#68c18a] text-lg">MT {v.total.toLocaleString('pt', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
              {listaVendas.length > 0 && (
                <div className={`${cardClass} p-4 bg-slate-50 dark:bg-zinc-800/80 flex justify-between items-center`}>
                  <span className="font-bold text-[#2d2d2d] dark:text-white">Total Geral</span>
                  <span className="font-bold text-[#2d2d2d] dark:text-white">
                    MT {listaVendas.filter(v => v.status !== 'CANCELADA').reduce((a, v) => a + v.total, 0).toLocaleString('pt', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className={`hidden md:block ${cardClass} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800/80 border-b border-slate-200 dark:border-zinc-800">
                      {['#', 'Caixa', 'Hora', 'Pagamento', 'Status', 'Total'].map((h, i) => (
                        <th key={h} className={`p-4 font-semibold text-slate-500 dark:text-zinc-400 ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {listaVendas.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-500 dark:text-zinc-400">Sem vendas registadas na nuvem.</td></tr>
                    ) : listaVendas.map(v => (
                      <tr key={v.id} onClick={() => setVendaDetalhes(vendaDetalhes?.id === v.id ? null : v)}
                        className={`border-b border-slate-100 dark:border-zinc-800 cursor-pointer transition-colors ${vendaDetalhes?.id === v.id ? 'bg-[#68c18a]/10 dark:bg-[#68c18a]/20' : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'}`}>
                        <td className="p-4 text-slate-400 dark:text-zinc-500 font-mono">{v.id}</td>
                        <td className="p-4 font-semibold text-[#2d2d2d] dark:text-zinc-200">{v.caixa}</td>
                        <td className="p-4 text-slate-500 dark:text-zinc-400">{v.hora}</td>
                        <td className="p-4 text-slate-500 dark:text-zinc-400">{v.forma}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${v.status === 'CANCELADA' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-[#68c18a]">MT {v.total.toLocaleString('pt', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                  {listaVendas.length > 0 && (
                    <tfoot>
                      <tr className="bg-slate-50 dark:bg-zinc-800/80">
                        <td colSpan={5} className="p-4 font-bold text-[#2d2d2d] dark:text-white">Total Geral</td>
                        <td className="p-4 text-right font-bold text-[#2d2d2d] dark:text-white">
                          MT {listaVendas.filter(v => v.status !== 'CANCELADA').reduce((a, v) => a + v.total, 0).toLocaleString('pt', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            ESTOQUE
        ══════════════════════════════════════ */}
        {activePage === 'estoque' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Controlo de Estoque</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Todos os produtos sincronizados com a nuvem.</p>
            </div>

            {loadingEstoque ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#68c18a] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-500 dark:text-zinc-400">A carregar estoque...</span>
              </div>
            ) : produtosCloud.length === 0 ? (
              <div className={`${cardClass} p-10 text-center`}>
                <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-slate-500 dark:text-zinc-400 font-medium">Nenhum produto sincronizado ainda.</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Aguarde o sistema C# sincronizar os dados, ou verifique as configurações.</p>
              </div>
            ) : (
              <>
                {/* Alerta de stock baixo */}
                {produtosBaixoEstoque.length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded-2xl p-4 mb-5 flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
                      <span className="font-bold">{produtosBaixoEstoque.length} produto{produtosBaixoEstoque.length > 1 ? 's' : ''}</span> abaixo do stock mínimo definido. Considere fazer um pedido ao fornecedor.
                    </p>
                  </div>
                )}

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-3">
                  {produtosCloud.map(p => {
                    const atual = Number(p.estoque_atual);
                    const minimo = Number(p.estoque_minimo);
                    const critico = atual === 0;
                    const baixo = !critico && atual <= minimo;
                    return (
                      <div key={p.id} className={`${cardClass} p-4`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-[#2d2d2d] dark:text-zinc-100">{p.nome}</p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">{p.categoria || 'Sem categoria'}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${critico ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : baixo ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                            {critico ? 'SEM STOCK' : baixo ? 'CRÍTICO' : 'OK'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/50">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-semibold mb-0.5">Estoque</p>
                            <p className={`font-bold ${critico ? 'text-red-500' : baixo ? 'text-orange-500' : 'text-[#2d2d2d] dark:text-zinc-200'}`}>
                              {atual.toLocaleString('pt', { minimumFractionDigits: 0 })} <span className="text-xs text-slate-400 font-normal">/ min {minimo.toLocaleString('pt')}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-semibold mb-0.5">Preço Venda</p>
                            <p className="font-bold text-[#68c18a] text-lg">
                              MT {Number(p.preco_venda).toLocaleString('pt', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <div className={`hidden md:block ${cardClass} overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-zinc-800/80 border-b border-slate-200 dark:border-zinc-800">
                          {['Produto', 'Categoria', 'Estoque Actual', 'Estoque Mínimo', 'Preço Venda', 'Estado'].map((h, i) => (
                            <th key={h} className={`p-4 font-semibold text-slate-500 dark:text-zinc-400 ${i >= 2 ? 'text-right' : 'text-left'}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {produtosCloud.map(p => {
                          const atual = Number(p.estoque_atual);
                          const minimo = Number(p.estoque_minimo);
                          const critico = atual === 0;
                          const baixo = !critico && atual <= minimo;
                          return (
                            <tr key={p.id} className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                              <td className="p-4 font-semibold text-[#2d2d2d] dark:text-zinc-200">{p.nome}</td>
                              <td className="p-4 text-slate-500 dark:text-zinc-400">{p.categoria || '—'}</td>
                              <td className={`p-4 text-right font-bold ${critico ? 'text-red-500' : baixo ? 'text-orange-500' : 'text-[#2d2d2d] dark:text-zinc-200'}`}>
                                {atual.toLocaleString('pt', { minimumFractionDigits: 0 })}
                              </td>
                              <td className="p-4 text-right text-slate-500 dark:text-zinc-400">{minimo.toLocaleString('pt', { minimumFractionDigits: 0 })}</td>
                              <td className="p-4 text-right text-[#2d2d2d] dark:text-zinc-200">MT {Number(p.preco_venda).toLocaleString('pt', { minimumFractionDigits: 2 })}</td>
                              <td className="p-4 text-right">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${critico ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : baixo ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                                  {critico ? 'SEM STOCK' : baixo ? 'CRÍTICO' : 'OK'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            CAIXAS
        ══════════════════════════════════════ */}
        {activePage === 'caixas' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Estado dos Caixas</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Turnos sincronizados com a nuvem em tempo real.</p>
            </div>

            {loadingCaixas ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#68c18a] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-500 dark:text-zinc-400">A carregar caixas...</span>
              </div>
            ) : caixasCloud.length === 0 ? (
              <div className={`${cardClass} p-10 text-center`}>
                <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-500 dark:text-zinc-400 font-medium">Nenhum caixa sincronizado ainda.</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Abra um turno de caixa no sistema local para que apareça aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caixasCloud.map(c => {
                  const aberto = c.status_fluxo === 'ABERTO';
                  const abertura = c.data_abertura ? new Date(c.data_abertura).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
                  const fechamento = c.data_fechamento ? new Date(c.data_fechamento).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : null;

                  // Calcula o número do caixa do utilizador (Ex: 1º caixa do Admin = Caixa 01)
                  const userCaixas = caixasCloud.filter(x => x.usuario_nome === c.usuario_nome).sort((a,b) => new Date(a.data_abertura).getTime() - new Date(b.data_abertura).getTime());
                  const userCaixaNumber = userCaixas.findIndex(x => x.caixa_id_local === c.caixa_id_local) + 1;

                  // Calcula dinamicamente o total apurado de vendas se o caixa estiver aberto
                  const vendasDesteTurno = listaVendas.filter(v => v.caixa_id_local === c.caixa_id_local && v.status !== 'CANCELADA');
                  const totalVendido = vendasDesteTurno.reduce((acc, curr) => acc + curr.total, 0);
                  const valorApurado = aberto ? totalVendido : Number(c.valor_final_calculado || 0);

                  return (
                    <div key={c.id} className={`${cardClass} p-5 hover:shadow-md`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-[#2d2d2d] dark:text-zinc-100 text-lg">
                            Caixa {String(userCaixaNumber).padStart(2, '0')}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-zinc-400">{c.usuario_nome || 'Operador desconhecido'}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${aberto ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${aberto ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                          {c.status_fluxo}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1">Abertura</p>
                          <p className="font-bold text-[#2d2d2d] dark:text-white text-sm">{abertura}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1">{aberto ? 'Saldo Inicial' : 'Fechamento'}</p>
                          <p className="font-bold text-[#2d2d2d] dark:text-white text-sm">
                            {aberto
                              ? `${Number(c.valor_inicial).toLocaleString('pt', { minimumFractionDigits: 2 })} MT`
                              : (fechamento || '—')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 bg-[#68c18a]/10 dark:bg-[#68c18a]/20 rounded-xl p-3 flex justify-between items-center">
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Apurado</p>
                        <p className="font-bold text-[#68c18a]">
                          {valorApurado.toLocaleString('pt', { minimumFractionDigits: 2 })} MT
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
      ` }} />
    </div>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { isDark, toggleDark } = useDarkMode();

  useEffect(() => {
    const savedUser = localStorage.getItem('sgv_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('sgv_user');
      }
    }
    setLoadingUser(false);
  }, []);

  const handleLogin = (u: any) => {
    setUser(u);
    localStorage.setItem('sgv_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sgv_user');
  };

  if (loadingUser) return null;

  if (!user) return <LoginPage onLogin={handleLogin} isDark={isDark} toggleDark={toggleDark} />;
  return <DashboardApp onLogout={handleLogout} user={user} isDark={isDark} toggleDark={toggleDark} />;
}
