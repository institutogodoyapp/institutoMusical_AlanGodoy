import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { CustomButton, useNotifications } from '@/components';
import {
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiTrendingDown,
  FiTrendingUp,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiBarChart2
} from 'react-icons/fi';
import {
  FaMoneyBillWave,
  FaChartPie,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSpinner,
  FaChartLine,
  FaSearch,
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaReceipt,
  FaCreditCard,
  FaCog,
  FaStore
} from 'react-icons/fa';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Receita } from '@/app/models/loja/receita';
import { useReceitaService } from '@/app/services/loja/receita/receita.service';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { DashboardContent } from '@/components/common';

// ========== INTERFACES ==========
interface CategoriaDespesa {
  id: number;
  nome: string;
  descricao: string;
}

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoriaId: number;
  categoriaNome: string;
}

interface Venda {
  id: number;
  numero: string;
  cliente: string;
  valorTotal: number;
  data: string;
  formaPagamento: string;
  status: string;
}

export const ControleFinanceiroLoja: React.FC = () => {
  // ========== SERVICES ==========
  const serviceFinanceiro = useReceitaService();

  
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE CONTROLE DE UI ==========
  const [activeTab, setActiveTab] = useState<'dashboard'>('dashboard');
  const [showResumo, setShowResumo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [carregandoResumo, setCarregandoResumo] = useState(false);



  // ========== ESTADOS DE DADOS ==========
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [resumo, setResumo] = useState<Receita | null>(null);



  // ========== ESTADOS DE FILTROS ==========
  const [filtroDashboard, setFiltroDashboard] = useState({
    dataInicio: '',
    dataFim: '',
    mes: '',
    ano: new Date().getFullYear().toString()
  });

  const [filtroVendas, setFiltroVendas] = useState({
    dataInicio: '',
    dataFim: '',
    status: 'todos'
  });

  // ========== EFEITOS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
  const fetchData = async () => {
    try {
      setLoading(true);

      const resumoPeriodo = await serviceFinanceiro.getReceitaMes(
        Number(filtroDashboard.ano), 
        Number(filtroDashboard.mes)
      );
      
      console.log(resumoPeriodo);
      setResumo(resumoPeriodo);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES DO DASHBOARD ==========
  const handleBuscarResumoPorPeriodo = async () => {
    try {
      setCarregandoResumo(true);

      const condicao = filtroDashboard.dataInicio || filtroDashboard.dataFim || filtroDashboard.mes || filtroDashboard.ano;
      const segundaCondicaoDataInicioeFim = filtroDashboard.dataInicio && filtroDashboard.dataFim;

      if (condicao) {
        if (segundaCondicaoDataInicioeFim) {
          const resumoFiltro = await serviceFinanceiro.getReceitaFiltro(
            filtroDashboard.dataInicio, 
            filtroDashboard.dataFim
          );
          
          setResumo(resumoFiltro);
          setCarregandoResumo(false);
          setLoading(false);
        } else if (filtroDashboard.mes) {
          const resumoPeriodo = await serviceFinanceiro.getReceitaDoMes(
            Number(filtroDashboard.ano), 
            Number(filtroDashboard.mes)
          );
          
          console.log(resumoPeriodo);
          setResumo(resumoPeriodo);
        } else {
          showError("Selecione um periodo ou um mês para prosseguir com a busca");
        }
      } else {
        setResumo(resumo);
      }
    } catch (error) {
      showError('Falha ao salvar dados. Tente novamente.');
      console.error("Erro ao buscar resumo por período:", error);
    } finally {
      setCarregandoResumo(false);
      setLoading(false);
    }
  };

  const handleLimparFiltrosDashboard = () => {
    setFiltroDashboard({
      dataInicio: '',
      dataFim: '',
      mes: '',
      ano: new Date().getFullYear().toString()
    });
    setResumo(resumo);
  };


  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const ifDeficit = resumo?.lucroTotal && resumo.lucroTotal < 0;


  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (loading) {
    return (
      <Layout titulo="Carregando...">
        <div className="container mt-6">
          <div className="notification is-info is-light has-text-centered">
            <span className="icon is-large">
              <FaSpinner className="fa-spin" />
            </span>
            <p>Carregando dados financeiros...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Controle Financeiro - Loja">
      <div className="container mt-6">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />
        
        {/* Tabs de Navegação */}
        <div className="tabs is-boxed">
          <ul>
            <li className={activeTab === 'dashboard' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('dashboard')}>
                <span className="icon is-small"><FaChartLine /></span>
                <span>Balanço</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          {/* Conteúdo das Tabs */}
          {activeTab === 'dashboard' ? (
            <DashboardContent
              resumoFiltrado={resumo}
              ifDeficit={ifDeficit}
              carregandoResumo={carregandoResumo}
              showResumo={showResumo}
              filtroDashboard={filtroDashboard}
              setFiltroDashboard={setFiltroDashboard}
              setShowResumo={setShowResumo}
              handleBuscarResumoPorPeriodo={handleBuscarResumoPorPeriodo}
              handleLimparFiltrosDashboard={handleLimparFiltrosDashboard}
            />
          ) : ('')}
        </div>
      </div>
    </Layout>
  );
};

export default ControleFinanceiroLoja;