import { Layout, ModalGenerico, useNotifications } from '@/components';
import { useState, useEffect } from 'react';
import { FiTrendingDown } from 'react-icons/fi';
import { FaSpinner, FaChartLine } from 'react-icons/fa';
import { format, parse } from 'date-fns';

import { useReceitaServicoService } from '@/app/services/servicos-musicais/receita/receita.service';
import { CategoriaDespesaServico, CategoriaDespesaServicoCadastro, DespesasServico, DespesasServicoCadastro } from '@/app/models/Servicos-musicais/receita/despesa';
import { Receita } from '@/app/models/Servicos-musicais/receita';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CategoriasContent, DashboardContent, DespesasContent } from '@/components/common/controle-financeiro';

export const ControleFinanceiroServicos: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const financasService = useReceitaServicoService();
  const {
    notifications,
    showSuccess,
    showError,
    showWarning,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE CONTROLE DE UI ==========
  const [showResumo, setShowResumo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [showDespesaPorCategoria, setShowDespesaPorCategoria] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'despesas' | 'categoria'>('dashboard');
  const [carregandoResumo, setCarregandoResumo] = useState(false);

  // ========== ESTADOS DE DADOS ==========
  const [categorias, setCategorias] = useState<CategoriaDespesaServico[]>([]);
  const [despesas, setDespesas] = useState<DespesasServico[]>([]);
  const [resumo, setResumo] = useState<Receita | null>(null);
  const [resumoFiltrado, setResumoFiltrado] = useState<Receita | null>(null);

  // ========== ESTADOS DE EDIÇÃO ==========
  const [despesaEditando, setDespesaEditando] = useState<DespesasServico | null>(null);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaDespesaServicoCadastro | null>(null);

  // ========== ESTADOS DE FORMULÁRIOS ==========
  const [formData, setFormData] = useState<CategoriaDespesaServicoCadastro>({
    id: 0,
    nome: '',
    descricao: ''
  });

  const [formDataDespesas, setFormDataDespesas] = useState<DespesasServicoCadastro>({
    id: 0,
    descricao: '',
    categoriaId: 0,
    data: '',
    valor: 0.0
  });

  // ========== ESTADOS DE FILTROS ==========
  const [periodoInicio, setPeriodoInicio] = useState<string>('');
  const [periodoFim, setPeriodoFim] = useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
  
  const [filtroDashboard, setFiltroDashboard] = useState({
    dataInicio: '',
    dataFim: '',
    mes: '',
    ano: new Date().getFullYear().toString()
  });

  // ========== EFEITOS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
  const fetchData = async () => {
    try {
      setLoading(true);

      const [responseCategorias, responseDespesas, responseDespesaTotal, mockResumo] = await Promise.all([
        financasService.listarCategoriaDespesas(),
        financasService.listarDespesas(),
        financasService.ValorTotalDespesa(),
        financasService.receita()
      ]);

      setCategorias(responseCategorias);
      setDespesas(responseDespesas);
      setResumo(mockResumo);
      setResumoFiltrado(mockResumo);
    } catch (error) {
      showError('Erro ao carregar dados');
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
          const resumoPeriodo = await financasService.receitaPorPeriodo(filtroDashboard.dataInicio, filtroDashboard.dataFim);
          setResumoFiltrado(resumoPeriodo);
          setShowDespesaPorCategoria(true);
        } else if (filtroDashboard.mes) {
          const resumoPeriodo = await financasService.receitaPorMes(Number(filtroDashboard.ano), Number(filtroDashboard.mes));
          setResumoFiltrado(resumoPeriodo);
          setShowDespesaPorCategoria(true);
        } else {
          showError("Selecione um periodo ou um mês para prosseguir com a busca");
        }
      } else {
        setResumoFiltrado(resumo);
      }
    } catch (error) {
      showError('Falha ao salvar dados. Tente novamente.');
      console.error("Erro ao buscar resumo por período:", error);
    } finally {
      setCarregandoResumo(false);
    }
  };

  const handleLimparFiltrosDashboard = () => {
    setFiltroDashboard({
      dataInicio: '',
      dataFim: '',
      mes: '',
      ano: new Date().getFullYear().toString()
    });
    setResumoFiltrado(resumo);
    setShowDespesaPorCategoria(false);
  };

  // ========== FUNÇÕES DE DESPESAS ==========
  const handleBuscarDespesas = () => {
    console.log("Buscar despesas de", periodoInicio, "até", periodoFim, "categoria:", categoriaFiltro);
  };

  const handleAddDespesa = async (dados: DadosModal) => {
    try {
      console.log("Dados recebidos do modal:", dados);

      const formattedData = {
        ...dados,
        data: format(parse(dados.data, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
      };

      if (despesaEditando?.id) {
        await financasService.atualizarDespesa(despesaEditando.id, formattedData);
        showSuccess("Despesa atualizada com sucesso!");
      } else {
        await financasService.adicionarDespesas(formattedData as DespesasServico);
        showSuccess("Despesa criada com sucesso!");
      }

      fecharModalDespesa();
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      showError('Falha ao salvar despesa. Tente novamente.');
    }
  };

  const handleDeleteDespesa = async (despesa: DespesasServico) => {
    try {
      if (confirm("Tem certeza que deseja excluir esta despesa?")) {
        await financasService.deletarDespesa(despesa.id);
        setDespesas(prev => prev.filter(d => d.id !== despesa.id));
      }
    } catch (error) {
      showError('Falha ao deletar. Tente novamente.');
    }
  };

  // ========== FUNÇÕES DE CATEGORIAS ==========
  const handleAddCategoria = async (dados: DadosModal) => {
    try {
      console.log("Dados recebidos do modal categoria:", dados);

      if (categoriaEditando?.id) {
        await financasService.atualizarCategoria(categoriaEditando.id, dados);
        showSuccess("Categoria atualizada com sucesso!");
      } else {
        await financasService.adicionarCategoria(dados as CategoriaDespesaServico);
        showSuccess("Categoria criada com sucesso!");
      }

      fecharModalCategoria();
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      showError('Falha ao salvar categoria. Tente novamente.');
    }
  };

  const handleDeleteCategoria = async (categoria: CategoriaDespesaServico) => {
    try {
      if (confirm("Tem certeza que deseja excluir esta despesa?")) {
        if (!categoria.comDespesa) {
          await financasService.DeletarCategoria(categoria.id);
          setCategorias(prev => prev.filter(d => d.id !== categoria.id));
        } else {
           showWarning('Não é possivel excluir categoria com despesa associada');
        }
      }
    } catch (error) {
      showError('Falha ao deletar. Tente novamente.');
    }
  };

  // ========== FUNÇÕES DE MODAIS ==========
  const abrirModalDespesa = (despesa: DespesasServico | null = null) => {
    if (despesa?.id) {
      if (!despesa) return;

      const dataParaInput = despesa.data.includes('/')
        ? format(parse(despesa.data, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
        : despesa.data;

      const formattedData = {
        ...despesa,
        data: dataParaInput
      };

      setShowDespesaModal(true);
      setDespesaEditando(formattedData as DespesasServico);
      setFormDataDespesas(despesa);
    } else {
      setShowDespesaModal(true);
      console.log(showDespesaModal);
      setFormDataDespesas({
        id: 0,
        descricao: '',
        categoriaId: 0,
        data: '',
        valor: 0.0
      });
    }
  };

  const abrirModalCategoria = (categoria: CategoriaDespesaServico | null = null) => {
    if (categoria?.id) {
      console.log(categoria.id);
      setShowCategoriaModal(true);
      setCategoriaEditando(categoria);
      setFormData(categoria);
    } else {
      setShowCategoriaModal(true);
      setFormData({
        id: 0,
        descricao: '',
        nome: ''
      });
    }
  };

  const fecharModalDespesa = () => {
    setShowDespesaModal(false);
    setDespesaEditando(null);
  };

  const fecharModalCategoria = () => {
    setShowCategoriaModal(false);
    setCategoriaEditando(null);
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const abrirDash = () => {
    fetchData();
    setActiveTab('dashboard');
  };

  // ========== CONFIGURAÇÕES DE CAMPOS DOS MODAIS ==========
  const camposDespesa: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'descricao',
      label: 'Descrição',
      placeholder: "Ex: Despesa referente..",
      required: true
    },
    {
      tipo: 'number',
      nome: 'valor',
      label: 'Valor',
      required: true
    },
    {
      tipo: 'date',
      nome: 'data',
      label: 'Data',
      required: true
    },
    {
      tipo: 'select',
      nome: 'categoriaId',
      label: 'Categoria',
      opcoes: categorias.map(cat => ({
        valor: cat.id.toString(),
        label: cat.nome
      })),
      required: true
    },
  ];

  const camposCategoria: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'nome',
      label: 'Nome',
      placeholder: "Ex: Licença software..",
      required: true
    },
    {
      tipo: 'text',
      nome: 'descricao',
      label: 'Descrição',
      placeholder: "Ex: Categoria se refere..",
      required: true
    },
  ];

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const ifDeficit = resumoFiltrado?.lucroTotal && resumoFiltrado.lucroTotal < 0;

  const despesasFiltradas = despesas.filter(despesa => {
    if (periodoInicio && new Date(despesa.data) < new Date(periodoInicio)) return false;
    if (periodoFim && new Date(despesa.data) > new Date(periodoFim)) return false;
    if (categoriaFiltro && despesa.categoriaId !== categoriaFiltro) return false;
    return true;
  });

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (loading) {
    return (
      <Layout titulo="Carregando...">
        <div className="section">
          <div className="container">
            <div className="box has-text-centered">
              <span className="icon is-large">
                <FaSpinner className="fa-spin" />
              </span>
              <p>Carregando dados financeiros...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Controle Financeiro - Projetos">
      <section className="section" style={{ padding: '0.1rem' }}>
        <div className="container">
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />
          
          {/* Tabs de Navegação */}
          <div className="tabs is-boxed">
            <ul>
              <li className={activeTab === 'dashboard' ? 'is-active' : ''}>
                <a onClick={abrirDash}>
                  <span className="icon is-small"><FaChartLine /></span>
                  <span>Balanço</span>
                </a>
              </li>
              <li className={activeTab === 'despesas' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('despesas')}>
                  <span className="icon is-small"><FiTrendingDown /></span>
                  <span>Despesas</span>
                </a>
              </li>
              <li className={activeTab === 'categoria' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('categoria')}>
                  <span className="icon is-small"><FiTrendingDown /></span>
                  <span>Categoria</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === 'dashboard' ? (
            <DashboardContent
              resumoFiltrado={resumoFiltrado}
              ifDeficit={ifDeficit}
              showDespesaPorCategoria={showDespesaPorCategoria}
              carregandoResumo={carregandoResumo}
              showResumo={showResumo}
              filtroDashboard={filtroDashboard}
              setFiltroDashboard={setFiltroDashboard}
              setShowResumo={setShowResumo}
              handleBuscarResumoPorPeriodo={handleBuscarResumoPorPeriodo}
              handleLimparFiltrosDashboard={handleLimparFiltrosDashboard}
            />
          ) : activeTab === 'despesas' ? (
            <DespesasContent
              despesasFiltradas={despesasFiltradas}
              categorias={categorias}
              periodoInicio={periodoInicio}
              periodoFim={periodoFim}
              categoriaFiltro={categoriaFiltro}
              setPeriodoInicio={setPeriodoInicio}
              setPeriodoFim={setPeriodoFim}
              setCategoriaFiltro={setCategoriaFiltro}
              abrirModalDespesa={abrirModalDespesa}
              handleBuscarDespesas={handleBuscarDespesas}
              handleDeleteDespesa={handleDeleteDespesa}
            />
          ) : (
            <CategoriasContent
              categorias={categorias}
              abrirModalCategoria={abrirModalCategoria}
              handleDeleteCategoria={handleDeleteCategoria}
            />
          )}
        </div>

        {/* Modais */}
        <ModalGenerico
          isOpen={showDespesaModal}
          onClose={fecharModalDespesa}
          dados={despesaEditando}
          onSave={handleAddDespesa}
          titulo={despesaEditando?.id ? 'Editar Despesa' : 'Nova Despesa'}
          campos={camposDespesa}
          textoBotaoSalvar={despesaEditando ? 'Atualizar' : 'Salvar'}
        />

        <ModalGenerico
          isOpen={showCategoriaModal}
          onClose={fecharModalCategoria}
          dados={categoriaEditando}
          onSave={handleAddCategoria}
          titulo={categoriaEditando?.id ? 'Editar Categoria' : 'Nova Categoria'}
          campos={camposCategoria}
          textoBotaoSalvar={categoriaEditando ? 'Atualizar' : 'Salvar'}
        />
      </section>
    </Layout>
  );
};