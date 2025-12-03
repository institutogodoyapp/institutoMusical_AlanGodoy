import { Layout, useNotifications } from '@/components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CustomButton } from '@/components';
import { Professor, ProfessorCadastro } from '@/app/models/escola/professor';
import { Instrumento } from '@/app/models/escola/instrumentos';
import {
  FaUserTie,
  FaMusic,
  FaEdit,
  FaPlus,
  FaTrash,
  FaEllipsisV,
  FaSearch,
  FaSpinner,
  FaIdCard,
  FaEnvelope,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { useInstrumentoService } from '@/app/services/escola';
import { useProfessorService } from '@/app/services/escola/professor/professor.service';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';
import CardList from '@/components/common/tableMobile';
import { FiEdit, FiMessageCircle, FiTrash2, FiUser } from 'react-icons/fi';
import { FaX } from 'react-icons/fa6';
import { TfiAgenda } from 'react-icons/tfi';

export const GerenciamentoProfessores: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const {
    notifications,
    showSuccess,
    showError,
    showWarning,
    removeNotification
  } = useNotifications();
  const router = useRouter()
  const serviceInstrumento = useInstrumentoService();
  const serviceProfessor = useProfessorService();

  // ========== ESTADOS DE DADOS ==========
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [professorEditando, setProfessorEditando] = useState<Professor | null>(null);
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);

  // ========== ESTADOS DE FORMULÁRIOS ==========
  const [formData, setFormData] = useState<ProfessorCadastro>({
    id: 0,
    nome: '',
    cpf: '',
    instrumentosIds: [],
    email: '',
    telefone: ''
  });

  // ========== ESTADOS DE FILTROS ==========
  const [busca, setBusca] = useState('');

  // ========== ESTADOS DE UI ==========
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showActionsId, setShowActionsId] = useState<number | null>(null);

  // ========== EFEITOS ==========
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (professorEditando) {
      setFormData({
        id: professorEditando.id,
        nome: professorEditando.nome,
        cpf: professorEditando.cpf,
        instrumentosIds: professorEditando.instrumentos?.map(i => i.id) || [],
        email: professorEditando.email,
        telefone: professorEditando.telefone
      });
    } else {
      setFormData({
        id: 0,
        nome: '',
        cpf: '',
        instrumentosIds: [],
        email: '',
        telefone: ''
      });
    }
  }, [professorEditando]);

  useEffect(() => {
    fetchData();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
  const fetchData = async () => {
    try {
      setLoading(true);
      const responseInst = await serviceInstrumento.getAllInstrumentos();

      setInstrumentos(responseInst);

      const responseProf = await serviceProfessor.getAllProfessores();
   
      setProfessores(responseProf);

    } catch (error) {
      showError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES DE CRUD ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (professorEditando?.id) {
        await serviceProfessor.atualizarProfessor(professorEditando.id, formData);
        showSuccess("Professor atualizado com sucesso!");
      } else {
        await serviceProfessor.cadastrarProfessor(formData);
        showSuccess("Professor criado com sucesso!");
      }

      setProfessorEditando(null);
      await fetchData();
      fecharModal();
    } catch (error) {
      showError('Não foi possível realizar a operação');
    }
  };

  const handleDelete = async (prof: Professor) => {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
 
      if (!prof.alunos) return
      if (prof.alunos.length === 0) {
        try {
          if (!prof.id) return
          await serviceProfessor.exluirProfessor(prof.id);
          showSuccess("Professor excluído com sucesso!");
          await fetchData();
        } catch (err) {
          showError('Erro ao excluir professor');
        }
      } else {
        showWarning('Não é possivel desativar: professor tem alunos cadastrados!')
      }

    }
  };

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const professoresFiltrados = professores.filter(professor =>
    professor.nome.toLowerCase().includes(busca.toLowerCase()) ||
    professor.email.toLowerCase().includes(busca.toLowerCase()) ||
    professor.cpf.includes(busca)
  );

  // ========== FUNÇÕES DE MODAIS ==========
  const abrirModal = (professor: Professor | null = null) => {
    setProfessorEditando(professor);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setProfessorEditando(null);
  };

  //=========== FUNÇÕES AXILIARES =================

  const getColorTag = (professorAtivo: boolean): string => {

    if (professorAtivo === true) {
      return 'is-primary'
    } else {
      return 'is-danger'
    }

  }



  // ========== MANIPULAÇÃO DO FORMULÁRIO ==========
  const handleFormChange = (field: keyof ProfessorCadastro, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const irParaAgenda = (id: number) => {
    router.push(`/instituto-musical/escola/aula/agenda?id=${id}`)
  }

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
              <p>Carregando professores...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Gerenciamento de Professores">
      <section className="section">
        <div className="container">
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          {/* Cabeçalho e Busca */}
          <div className="box mb-4">
            <div className="level is-mobile">
              <div className="level-left">
              </div>
              <div className="level-right">
                <CustomButton
                  className={`my-custom-class ${isMobileView ? 'is-small' : ''}`}
                  icon={<FaPlus />}
                  text={`${isMobileView ? '' : 'Novo Professor'}`}
                  onClick={() => abrirModal()}
                  aria-label="Adicionar novo professor"
                />
              </div>
            </div>
            <Input
              label=''
              aditionalClassesControl='has-icons-left'
              iconLeft={<FaSearch />}
              type="text"
              placeholder={isMobileView ? 'Buscar professor...' : 'Buscar professor por nome, email ou CPF'}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* Lista de Professores */}
          <div className="box" style={{ boxShadow: 'none' }}>
            {professoresFiltrados.length === 0 ? (
              <div className="has-text-centered py-6">
                <p>Nenhum professor encontrado.</p>
                {busca && (
                  <CustomButton
                    className="button is-text mt-2"
                    icon={null}
                    text={`${isMobileView ? '' : 'Limpar busca'}`}
                    onClick={() => setBusca('')}

                  />

                )}
              </div>
            ) : isMobileView ? (
              <CardList
                data={professoresFiltrados}
                titleField='nome'
                icon={<FaChalkboardTeacher />}
                iconColor='is-primary-custom'
                subtitleField=""
                fields={[
                  { label: 'CPF:', key: 'cpf' },
                  { label: 'Email:', key: 'email' },
                  { label: 'Contato:', key: 'telefone' }
                ]}
                tags={[
                  {
                    label: 'Status', key: 'ativo',
                    color: (item: any) => getColorTag(item.ativo),
                    format: (ativo: boolean) => ativo ? 'Ativo' : 'Inativo'
                  },

                ]}
                actions={[
                  {
                    label: '',
                    color: 'is-info is-light',
                    onClick: (item) => abrirModal(item),
                    icon: <FiEdit />,
                    itemAtivo: professoresFiltrados.some(prof => prof.ativo)

                  },
                  {
                    label: '',
                    color: 'is-primary-custom is-light',
                    onClick: (item) => irParaAgenda(item.id),
                    icon: <TfiAgenda />,
                    itemAtivo: professoresFiltrados.some(prof => prof.ativo)
                  },
                  {
                    label: '',
                    color: 'is-danger is-light',
                    onClick: (item) => handleDelete(item),
                    icon: <FiTrash2 />,
                    itemAtivo: professoresFiltrados.some(prof => prof.ativo)
                  }
                ]}
              />


            ) : (
              <ListaProfessoresDesktop
                professores={professoresFiltrados}
                setProfessorEditando={setProfessorEditando}
                irParaAgenda={irParaAgenda}
                setShowModal={setShowModal}
                handleDelete={handleDelete}
                getColorTag={getColorTag}
              />
            )}
          </div>
        </div>
      </section>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={fecharModal}></div>
          <div className={`modal-card ${isMobileView ? 'modal-card-sm' : ''}`}>
            <header className="modal-card-head">
              <p className="modal-card-title">
                {professorEditando ? 'Editar Professor' : 'Novo Professor'}
              </p>
              <button
                className="delete"
                aria-label="Fechar modal"
                onClick={fecharModal}
              ></button>
            </header>
            <form onSubmit={handleSubmit}>
              <section className="modal-card-body">
                <Input
                  label='Nome Completo'
                  type="text"
                  icon={<FiUser />}
                  placeholder="Nome do professor"
                  value={formData.nome}
                  onChange={(e) => handleFormChange('nome', e.target.value)}
                  required
                />

                <div className="columns is-mobile">
                  <div className="column">
                    <Input
                      label='CPF'
                      type="text"
                      format='cpf'
                      icon={<FaIdCard />}
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => handleFormChange('cpf', e.target.value)}
                      required
                    />
                  </div>
                  <div className="column">
                    <Input
                      label='Telefone'
                      type="tel"
                      format='telefone'
                      icon={<FaEnvelope />}
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => handleFormChange('telefone', e.target.value)}
                      required
                    />
                  </div>
                  {professorEditando && <div className="column">
                    <div className="field">
                      <label className="label">
                        <span className="icon-text has-text-descrition-cinza-custom has-text-bold-normal">
                          <span>Status</span>
                        </span>
                      </label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            name="ativo"
                            value={formData.ativo ? "true" : "false"}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              ativo: e.target.value === "true"
                            }))}
                          >
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>}
                </div>

                <Input
                  label='Email'
                  type="email"
                  icon={<FaEnvelope />}
                  placeholder="email@escola.com"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  required
                />



                <div className="field">
                  <label className="label">Instrumentos Lecionados</label>
                  <div className="select is-fullwidth is-multiple">
                    <select
                      multiple
                      value={formData.instrumentosIds.map(id => id.toString())}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                          option => Number(option.value)
                        );
                        handleFormChange('instrumentosIds', selectedOptions);
                      }}
                    >
                      {instrumentos.map((instrumento) => (
                        <option key={instrumento.id} value={instrumento.id}>
                          {instrumento.nome} ({instrumento.tipo})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
              <footer className="modal-card-foot is-flex is-justify-content-flex-end">
                <button
                  type="button"
                  className="button "
                  onClick={fecharModal}
                >
                  <span className="icon">
                    <FaX />
                  </span>
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  className="button is-primary-custom"
                >
                  <span>{professorEditando ? 'Atualizar' : 'Salvar'}</span>
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};


// ========== COMPONENTES AUXILIARES ==========

export const ListaProfessoresDesktop = ({ professores, setProfessorEditando, setShowModal, handleDelete, getColorTag, irParaAgenda }: any) => (
  <div className="table-container">
    <table className="table is-fullwidth is-striped is-hoverable">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>Instrumentos</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {professores.map((professor: Professor) => (
          <tr key={professor.id}>
            <td>{professor.nome}</td>
            <td>{professor.email}</td>
            <td>{professor.cpf}</td>
            <td>{professor.telefone}</td>
            <td>
              {professor.instrumentos && professor.instrumentos.length > 0
                ? professor.instrumentos.map((instrumento: Instrumento) => instrumento.nome).join(', ')
                : 'Sem instrumentos'}
            </td>

            <td>{<div className={`tag ${getColorTag(professor.ativo)}`}>{`${professor.ativo === false ? 'Inativo' : 'Ativo'}`}</div>}</td>
            <td>
              <div className="buttons">
                {professor.ativo && <button
                  className="button is-primary-custom is-small"
                  onClick={() =>
                    irParaAgenda(professor.id)
                  }
                  aria-label={`Editar ${professor.nome}`}
                >
                  <span className="icon">
                    <TfiAgenda />
                  </span>
                </button>}

                <button
                  className="button is-info is-small"
                  onClick={() => {
                    setProfessorEditando(professor);
                    setShowModal(true);
                  }}
                  aria-label={`Editar ${professor.nome}`}
                >
                  <span className="icon">
                    <FaEdit />
                  </span>
                </button>
                {professor.ativo && <button
                  className="button is-danger is-small"
                  onClick={() => handleDelete(professor)}
                  aria-label={`Excluir ${professor.nome}`}
                >
                  <span className="icon">
                    <FaTrash />
                  </span>
                </button>
                }</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ListaProfessoresMobile = ({
  professores,
  setProfessorEditando,
  setShowModal,
  handleDelete,
  showActionsId,
  setShowActionsId
}: any) => (
  <div className="is-hidden-tablet">
    {professores.map((professor: Professor) => (
      <div key={professor.id} className="card mb-4">
        <div className="card-content">
          <div className="media">
            <div className="columns is-mobile is-multiline">
              <span className="icon is-small">
                <FaUserTie />
              </span>
              <p className="title is-5" style={{ marginLeft: '10px' }}>
                {professor.nome}
              </p>
              <p className="subtitle is-6">{professor.email}</p>
              <div className="tags">
                <span className="tag is-primary-custom">
                  <FaMusic className="mr-4" />
                  {professor.instrumentos && professor.instrumentos.length > 0
                    ? professor.instrumentos.map((instrumento: Instrumento) => instrumento.nome).join(', ')
                    : 'Sem instrumentos'}
                </span>
              </div>
            </div>

            <div className="media-right">
              <div className={`dropdown is-right ${showActionsId === professor.id ? 'is-active' : ''}`}>
                <div className="dropdown-trigger">
                  <button
                    className="button is-text"
                    aria-haspopup="true"
                    aria-controls={`dropdown-menu-${professor.id}`}
                    onClick={() => setShowActionsId(showActionsId === professor.id ? null : professor.id)}
                  >
                    <span className="icon">
                      <FaEllipsisV />
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu" id={`dropdown-menu-${professor.id}`} role="menu">
                  <div className="dropdown-content">
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setProfessorEditando(professor);
                        setShowModal(true);
                        setShowActionsId(null);
                      }}
                    >
                      <span className="icon">
                        <FaEdit />
                      </span>
                      Editar
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        handleDelete(professor.id);
                        setShowActionsId(null);
                      }}
                    >
                      <span className="icon">
                        <FaTrash />
                      </span>
                      Excluir
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <p>
              <strong>Fone:</strong> {professor.telefone}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);