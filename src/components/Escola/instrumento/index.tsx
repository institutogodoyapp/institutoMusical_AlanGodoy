import { Layout, ModalGenerico, useNotifications } from '@/components';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomButton } from '@/components';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaCalendar,
  FaBook
} from 'react-icons/fa';
import { FiSearch, FiTrash2, FiEdit, FiUserPlus, FiToggleLeft, FiToggleRight, FiChevronUp, FiChevronRight, FiChevronDown, FiBarChart2, FiMoreVertical, FiBook } from 'react-icons/fi';

import { FaArrowPointer } from 'react-icons/fa6';
import { Instrumento, InstrumentoTipo, InstrumentoCadastro } from '@/app/models/escola/instrumentos';
import { useInstrumentoService } from '@/app/services/escola';
import { getInstrumentoIcon } from '@/util'
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import LoadingSpinner from '@/components/common/loading';
import CardList from '@/components/common/tableMobile';

export const GerenciamentoInstrumentos: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const instrumentoService = useInstrumentoService();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();
  const router = useRouter();

  // ========== REFS ==========
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ========== ESTADOS DE DADOS ==========
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [instrumentoEditando, setInstrumentoEditando] = useState<Instrumento | null>(null);

  // ========== ESTADOS DE FILTROS ==========
  const [filtroTipo, setFiltroTipo] = useState<InstrumentoTipo | 'TODOS'>('TODOS');
  const [busca, setBusca] = useState<string>('');

  // ========== ESTADOS DE FORMULÁRIOS ==========
  const [formData, setFormData] = useState<InstrumentoCadastro>({
    nome: '',
    tipo: InstrumentoTipo.CORDA,
  });

  // ========== ESTADOS DE UI ==========
  const [loading, setLoading] = useState<boolean>(true);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  // ========== CONSTANTES ==========
  const tiposInstrumentosDisponiveis: InstrumentoTipo[] = [
    InstrumentoTipo.CORDA,
    InstrumentoTipo.PERCUSSAO,
    InstrumentoTipo.SOPRO,
    InstrumentoTipo.TECLAS,
    InstrumentoTipo.VOCAL,
  ];

  // ========== EFEITOS ==========

useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(null);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  useEffect(() => {
    fetchInstrumentos();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
  const fetchInstrumentos = async () => {
    try {
      setLoading(true);
      const response = await instrumentoService.getAllInstrumentos();
    
      setInstrumentos(Array.isArray(response) ? response : [response]);
    } catch (err) {
        setLoading(false);
      showError('Erro ao buscar instrumentos');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES AUXILIARES ==========
const getInstrumentoIcon = (tipo: string) => {
  switch (tipo) {
    case 'CORDA':
      return <img src="/icons/instrumentos.svg" alt="Cordas" className="w-6 h-6" />;
    case 'SOPRO':
      return <img src="/icons/sopro.svg" alt="Sopro" className="w-6 h-6" />;
    case 'PERCUSSAO':
      return <img src="/icons/percussão.svg" alt="Percussão" className="w-6 h-6" />;
    case 'TECLAS':
      return <img src="/icons/teclas.svg" alt="Teclas" className="w-6 h-6" />;
    case 'VOCAL':
      return <img src="/icons/voz.svg" alt="Voz" className="w-6 h-6" />;
    default:
      return <img src="/icons/others.svg" alt="Outros" className="w-6 h-6" />;
  }
};


  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const toggleDropdown = (instrumentoId: number) => {
    setDropdownAberto(prev => prev === instrumentoId ? null : instrumentoId);
  };

  const abrirModal = (instrumento: Instrumento | null = null) => {
    
    if (instrumento?.id) {
      setInstrumentoEditando(instrumento);
      setFormData(instrumento);
    } else {
      setFormData({ nome: '', tipo: InstrumentoTipo.CORDA });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setInstrumentoEditando(null);
  };

  // ========== CONFIGURAÇÕES ==========
  const camposInstrumento: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'nome',
      label: 'Nome do Instrumento',
      placeholder: "Ex: Violão..",
      required: true
    },

    {
      tipo: 'select',
      nome: 'tipo',
      label: 'Tipo',
      opcoes: tiposInstrumentosDisponiveis.map(type => ({
        valor: type,
        label: type
      })),
      required: true
    }

  ];

  // ========== FUNÇÕES DE CRUD ==========
  const salvarInstrumento = async (dados: DadosModal) => {
    try {
        setLoading(true);
      let response;
      if (instrumentoEditando?.id) {
      
        response = await instrumentoService.AtualizarInstrumentos(instrumentoEditando.id, dados);
        showSuccess("Instrumento atualizado com sucesso!");
      } else {
        response = await instrumentoService.cadastrarInstrumento(dados as InstrumentoCadastro);
        showSuccess("Instrumento salvo com sucesso!");
      }
  setLoading(false);
      await fetchInstrumentos();
      fecharModal();
    } catch (err) {
        setLoading(false);
      showError('Erro ao salvar instrumento');
    }
  };

  const excluirInstrumento = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este instrumento?')) {
      try {
          setLoading(true);
        await instrumentoService.removerInstrumento(id);
        showSuccess("Instrumento excluído com sucesso!");
          setLoading(false);
        await fetchInstrumentos();
      } catch (err) {
          setLoading(false);
        showError('Erro ao excluir instrumento');
      }
    }
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const irParaConteudo = (id: number) => {
 
    router.push(`/instituto-musical/escola/instrumento/conteudo?id=${id}`)
  }

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const instrumentosFiltrados = instrumentos.filter(instrumento => {
    const matchTipo = filtroTipo === 'TODOS' || instrumento.tipo === filtroTipo;
    const matchBusca = instrumento.nome.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const instrumentosComIcon = instrumentosFiltrados.map(instrumento => ({
  ...instrumento,
  icon: getInstrumentoIcon(instrumento.tipo)  // Adiciona ícone ao objeto
}));

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
   if (loading) {
        return (
            <div className="section">
                <div className="container">
                           <LoadingSpinner show = {loading} isMobile={isMobile}/>
                </div>
            </div>
        );
    }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo='Gerenciamento de Instrumentos'>
      <section className="section">
        <div className="container">
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          {/* Filtros */}
          <div className="box" style={{ boxShadow: 'none' }}>
            <div className="columns is-vcentered">
              <div className="column is-4">
                <div className="field">
                  <label className="label">Filtrar por Tipo</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value as InstrumentoTipo | 'TODOS')}
                      >
                        <option value="TODOS">Todos os Tipos</option>
                        {tiposInstrumentosDisponiveis.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Buscar Instrumento</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Digite o nome do instrumento"
                    />
                    <span className="icon is-left">
                      <FaSearch />
                    </span>
                  </div>
                </div>
              </div>

              <div className="column is-2">
                <div className="field">
                  <label className="label">&nbsp;</label>
                  <div className="control">
                    <CustomButton
                      text="Novo"
                      icon={<FaPlus />}
                      onClick={() => abrirModal()}
                      className="is-fullwidth"
                      style={{ borderRadius: '6px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela para Desktop */}
          <div className="box" style={{ boxShadow: 'none' }}>
            {instrumentosFiltrados.length === 0 ? (
              <div className="notification is-light has-text-centered">
                Nenhum instrumento encontrado com os filtros selecionados.
              </div>
            ) : (
              <div className="table-container">
                <table className="table is-fullwidth  is-hidden-mobile">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Alunos</th>
                      <th>Conteudo Programático</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instrumentosFiltrados.map(instrumento => (
                      <tr key={instrumento.id}>
                        <td>{instrumento.nome}</td>
                        <td>
                          <span className={'tag is-primary-custom'}>
                            {instrumento.tipo}
                          </span>
                        </td>
                        <td>{instrumento.quantidadeDeAluno}</td>
                        <td>
                          <div className="buttons">
                            <button className="button is-small is-primary-custom"
                              onClick={() => irParaConteudo(instrumento.id)}>
                              <span className="icon">
                                <FaBook />
                              </span>
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="buttons">
                            <button
                              className="button is-small is-primary-custom"
                              onClick={() => abrirModal(instrumento)}
                            >
                              <span className="icon">
                                <FaEdit />
                              </span>
                            </button>
                            <button
                              className="button is-small is-danger"
                              onClick={() => excluirInstrumento(instrumento.id)}
                            >
                              <span className="icon">
                                <FaTrash />
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cards para Mobile */}
          <div className="columns is-multiline is-hidden-tablet">
            
              {instrumentosFiltrados.length > 0 ? (
              <CardList
                data={instrumentosComIcon}
                titleField='nome'
                icon={null}
                iconColor='is-primary-custom'
                subtitleField=''
                fields={[
                 
                ]}
                tags={[
                  { label: '', key: 'tipo', color: 'has-primary-custom' },
                  { label: 'Alunos', key: 'quantidadeAlunos', color: 'has-primary-custom' },



                ]}
                actions={[
                  {
                    label: '',
                    color: 'is-success is-light',
                    onClick: (item) => irParaConteudo(item.id),
                    icon: <FaBook />,
                    itemAtivo: true
                  },
                  {
                    label: '',
                    color: 'is-info is-light',
                    onClick: (item) => abrirModal(item),
                    icon: <FiEdit />,
                    itemAtivo: true
                  },
                  {
                    label: '',
                    color: 'is-danger is-light',
                    onClick: (item) => excluirInstrumento(item.id),
                    icon: <FiTrash2 />,
                    itemAtivo:true
                  }
                ]}
              />
            ) : (
              <div className="column is-12">
                {isMobile && <div className="notification is-light">
                  Nenhum Aluno encontrado
                </div>}
              </div>
            
            )}
          </div>
        </div>
      </section>


      {/* Modal de Cadastro/Edição */}

      <ModalGenerico
        isOpen={modalAberto}
        onClose={() => fecharModal()}
        dados={instrumentoEditando || formData}
        onSave={salvarInstrumento}
        titulo={instrumentoEditando?.id ? 'Editar Instrumento' : 'Novo Instrumento'}
        campos={camposInstrumento}
        isEdit={instrumentoEditando?.id ? true : false}
        textoBotaoSalvar="Salvar"
      />
     
    </Layout>
  );
};