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
import { FiSearch, FiTrash2, FiEdit, FiUserPlus, FiToggleLeft, FiToggleRight, FiChevronUp, FiChevronRight, FiChevronDown, FiBarChart2, FiMoreVertical } from 'react-icons/fi';

import { FaArrowPointer } from 'react-icons/fa6';
import { Instrumento, InstrumentoTipo, InstrumentoCadastro } from '@/app/models/escola/instrumentos';
import { useInstrumentoService } from '@/app/services/escola';
import { getInstrumentoIcon } from '@/util'
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import LoadingSpinner from '@/components/common/loading';

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
      showError('Erro ao buscar instrumentos');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const getInstrumentoIcon = (tipo: string) => {
    switch (tipo) {
      case 'CORDA':
        return '/icons/instrumentos.svg';
      case 'SOPRO':
        return '/icons/sopro.svg';
      case 'PERCUSSAO':
        return '/icons/percussão.svg';
      case 'TECLAS':
        return '/icons/teclas.svg';
      case 'VOCAL':
        return '/icons/voz.svg';
      default:
        return '/icons/others.svg';
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
      
      let response;
      if (instrumentoEditando?.id) {
      
        response = await instrumentoService.AtualizarInstrumentos(instrumentoEditando.id, dados);
        showSuccess("Instrumento atualizado com sucesso!");
      } else {
        response = await instrumentoService.cadastrarInstrumento(dados as InstrumentoCadastro);
        showSuccess("Instrumento salvo com sucesso!");
      }

      await fetchInstrumentos();
      fecharModal();
    } catch (err) {
      showError('Erro ao salvar instrumento');
    }
  };

  const excluirInstrumento = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este instrumento?')) {
      try {
        await instrumentoService.removerInstrumento(id);
        showSuccess("Instrumento excluído com sucesso!");
        await fetchInstrumentos();
      } catch (err) {
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

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
   if (loading) {
        return (
            <div className="section">
                <div className="container">
                           <LoadingSpinner show = {loading}/>
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
            {instrumentosFiltrados.length > 0 ? instrumentosFiltrados.map(instrumento => (
              <div className="column is-12" key={instrumento.id}>
                <div className="card" style={{ position: 'relative' }}>
                  <div className="dropdown" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <div className="dropdown-trigger">
                      <button
                        className="button is-small"
                        aria-haspopup="true"
                        aria-controls={`dropdown-menu-${instrumento.id}`}
                        onClick={() => toggleDropdown(instrumento.id)}
                      >
                        <span className="icon"><FiMoreVertical /></span>
                      </button>
                    </div>

                    {dropdownAberto === instrumento.id && (
                      <div
                        className="dropdown-menu"
                        id={`dropdown-menu-${instrumento.id}`}
                        ref={dropdownRef}
                        role="menu"
                        style={{ display: 'block', top: '10px', right: '100px', left: '-170px' }}
                      >
                        <div className="dropdown-content">
                          <a
                            className="dropdown-item"
                            onClick={() => abrirModal(instrumento)}
                          >
                            <span className="icon"><FiEdit /></span> Editar
                          </a>

                          <a
                            className="dropdown-item"
                            onClick={() => excluirInstrumento(instrumento.id)}
                          >
                            <span className="icon"><FaTrash /></span> Excluir
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-content">
                    <div className="media">
                      <div className="media-left">
                        <img
                          src={getInstrumentoIcon(instrumento.tipo)}
                          alt={instrumento.nome}
                          className="icon-img"
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'contain',
                            maxWidth: '200%',
                            padding: '9px'
                          }}
                        />
                      </div>
                      <div className="media-content">
                        <p className="title is-4 mb-2">{instrumento.nome}</p>
                        <p className={`subtitle is-7 tag ${instrumento.tipo === 'CORDA'
                          ? 'is-primary'
                          : instrumento.tipo === 'SOPRO'
                            ? 'is-info'
                            : instrumento.tipo === 'PERCUSSAO'
                              ? 'is-warning'
                              : instrumento.tipo === 'TECLAS'
                                ? 'is-danger'
                                : 'is-light'
                          }`}>
                          {instrumento.tipo ? instrumento.tipo : 'Não especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="content">
                      <p><strong>Alunos:</strong> {instrumento.quantidadeDeAluno}</p>
                      <p><strong>Conteúdo:</strong>
                        <span className="buttons">
                          <button className="button is-small is-primary-custom"
                            onClick={() => irParaConteudo(instrumento.id)}>
                            <span className="icon">
                              <FaBook />
                            </span>
                          </button>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="column is-12">
                <div className="notification is-light">Nenhum aluno encontrado com os filtros atuais</div>
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