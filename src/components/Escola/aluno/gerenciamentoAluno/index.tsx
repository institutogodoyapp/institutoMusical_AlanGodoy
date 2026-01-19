import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiTrash2, FiEdit, FiUserPlus, FiChevronUp, FiChevronRight, FiChevronDown, FiBarChart2, FiMoreVertical, FiX, FiPlus } from 'react-icons/fi';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { Aluno, Instrumento, Professor } from '@/app/models/escola';
import { useAlunoService } from '@/app/services';
import { traduzirDiaSemana } from '@/util/traduçãoApi';
import { FaCalendar, FaUserGraduate } from 'react-icons/fa';
import { formatarMoeda } from '@/util/moeda';
import CardList from '@/components/common/tableMobile';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import { Matricula } from '@/app/models/escola/aluno/matricula';
import { useProfessorService } from '@/app/services/escola/professor/professor.service';
import { parseApiDate } from '@/util';
import { formatarDataString } from '@/util/Datas';

export const GerenciamentoAlunos: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const service = useAlunoService();
  const professorService = useProfessorService()
  const router = useRouter();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunosExpandidos, setAlunosExpandidos] = useState<Set<number>>(new Set());
  const [carregando, setCarregando] = useState<boolean>(true);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [professores, setProfessores] = useState<Professor[]>([])
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [alunoIdMatricula, setAlunoIdMatricula] = useState<number>()
  const [formData, setFormData] = useState<Matricula>({
    id: 0,
    professorId: 0,
    instrumentoId: 0,
    diaSemanaAula: '',
    horarioAula: ''
  });

  // ========== ESTADOS DE FILTROS E ORDENAÇÃO ==========
  const [filtroNome, setFiltroNome] = useState<string>('');
  const [filtroCPF, setFiltroCPF] = useState<string>('');
  const [filtroInstrumento, setFiltroInstrumento] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('ativo');
  const [ordem, setOrdem] = useState<{ campo: keyof Aluno; direcao: 'asc' | 'desc' }>({ campo: 'nome', direcao: 'asc' });

  // ========== EFEITOS ==========
  useEffect(() => {

    carregarAlunos();
  }, []);

  useEffect(() => {
    const carregarProfessores = async () => {
      try {
        const resposta = await professorService.getAllProfessores();
        setProfessores(resposta);
      } catch (error) {
        showError('Falha ao carregar dados.');
      } finally {
        setCarregando(false);
      }
    };
    carregarProfessores();
  }, []);

  const carregarInstrumento = async (professorId: string) => {
    try {

      const resposta = await professorService.getInstrumentoByProfessorId(Number(professorId));
      setInstrumentos(resposta);
    } catch (error) {
      showError('Falha ao carregar dados.');
    } finally {

    }
  };

  const carregarAlunos = async () => {
    try {
      setCarregando(true);
      const resposta = await service.getAlunos();
      setAlunos(Array.isArray(resposta) ? resposta : [resposta]);
    } catch (error) {
      showError('Falha ao carregar dados.');
    } finally {
      setCarregando(false);
    }
  };



  // ========== FUNÇÕES DE CONTROLE DE UI ==========

  const getColorTag = (professorAtivo: boolean | undefined): string => {

    if (professorAtivo === true) {
      return 'is-primary'
    } else {
      return 'is-danger'
    }

  }

  const toggleExpandirAluno = (id: number) => {
    const novosExpandidos = new Set(alunosExpandidos);
    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id);
    } else {
      novosExpandidos.add(id);
    }
    setAlunosExpandidos(novosExpandidos);
  };

  const fecharModal = () => {
    setModalAberto(false)
    setFormData({
      id: 0,
      professorId: 0,
      instrumentoId: 0,
      diaSemanaAula: '',
      horarioAula: ''
    })


  }

  const fecharModalAção = async () => {
    setModalAberto(false)
    setFormData({
      id: 0,
      professorId: 0,
      instrumentoId: 0,
      diaSemanaAula: '',
      horarioAula: ''
    })

    await carregarAlunos()

  }


  const abriModal = (aluno: Aluno) => {
    setModalAberto(true)
    setAlunoIdMatricula(aluno.id)

  }

  // ========== FUNÇÕES DE ORDENAÇÃO ==========
  const ordenarAlunos = (campo: keyof Aluno) => {
    const direcao = ordem.campo === campo && ordem.direcao === 'asc' ? 'desc' : 'asc';
    setOrdem({ campo, direcao });
  };

  const getIconeOrdenacao = (campo: keyof Aluno) => {
    if (ordem.campo !== campo) return null;
    return ordem.direcao === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  // ========== FUNÇÕES DE FILTRO E ORDENAÇÃO ==========
  const alunosFiltradosOrdenados = alunos
    .filter(aluno => {
      const nomeMatch = aluno.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const cpfMatch = aluno.cpf.includes(filtroCPF);
      const statusMatch = filtroStatus === 'todos' || (filtroStatus === 'ativo' && aluno.ativo) || (filtroStatus === 'inativo' && !aluno.ativo);
      return nomeMatch && cpfMatch && statusMatch;
    })
    .sort((a, b) => {
      const valorA = a[ordem.campo] || '';
      const valorB = b[ordem.campo] || '';
      if (valorA < valorB) return ordem.direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordem.direcao === 'asc' ? 1 : -1;
      return 0;
    });


  // ========== CONFIGURAÇÕES ==========

  const diasSemana: { valor: string, label: string }[] = [
    { valor: 'MONDAY', label: 'Segunda-feira' },
    { valor: 'TUESDAY', label: 'Terça-feira' },
    { valor: 'WEDNESDAY', label: 'Quarta-feira' },
    { valor: 'THURSDAY', label: 'Quinta-feira' },
    { valor: 'FRIDAY', label: 'Sexta-feira' },
    { valor: 'SATURDAY', label: 'Sábado' }];


  const camposMatricula: CampoModal[] = [
    {
      tipo: 'select',
      nome: 'professorId',
      label: 'Professor',
      opcoes: professores.map(type => ({
        valor: String(type.id),
        label: type.nome
      })),
      required: true
    },
    {
      tipo: 'select',
      nome: 'instrumentoId',
      label: 'Instrumento',
      opcoes: instrumentos.map(type => ({
        valor: String(type.id),
        label: type.nome
      })),
      required: true
    },
    {
      tipo: 'select',
      nome: 'diaSemanaAula',
      label: 'Dia da Semana',
      opcoes: diasSemana.map(type => ({
        valor: type.valor,
        label: type.label
      })),
      required: true
    },
    {
      tipo: 'time',
      nome: 'horarioAula',
      label: 'Horario da Aula',
      //placeholder: "Ex: Violão..",
      required: true
    },
    {
      tipo: 'date',
      nome: 'dataMatricula',
      label: 'Data da Matrícula',
      //placeholder: "Ex: Violão..",
      required: false
    },



  ];

  // ========== FUNÇÕES DE CRUD ==========
  const handleExcluirAluno = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
      try {
        await service.removerAluno(id);
        setAlunos(alunos.filter(aluno => aluno.id !== id));
        showSuccess('Aluno excluído com sucesso!');
      } catch (error) {
        showError('Erro ao excluir aluno');

      }
    }
  };

  const cancelarMatricula = async (id: number) => {
    if (window.confirm('Tem certeza que deseja desmatricular aluno deste Curso? Esta ação não pode ser desfeita.')) {
      try {
        await service.cancelarMatricula(id);
        showSuccess('Aluno desmatriculado com sucesso!');
        fecharModalAção()
      } catch (error) {
        showError('Erro ao desmatricular');

      }
    }
  };

  const matricularAluno = async (dados: DadosModal) => {
    
      console.log("dados" + dados.dataMatricula)
    try {
      const dadostypes = {
        ...dados,
        instrumentoId: Number(dados.instrumentoId),
        professorId: Number(dados.professorId),
        alunoId: Number(alunoIdMatricula),
      
        dataMatricula: dados.dataMatricula && dados.dataMatricula !== 'NaN/NaN/NaN' 
    ? formatarDataString(dados.dataMatricula) 
    : dados.dataMatricula
        
    }

      

      console.log("dados" + dadostypes.dataMatricula)

    const aluno = alunos.find(a => a.id === dadostypes.alunoId)
    const instrumento = aluno?.instrumentos
      .flatMap(matricula => matricula.instrumento)
      .find(instr => instr?.id === dadostypes.instrumentoId);

    if (instrumento?.id !== dadostypes.instrumentoId) {
      await service.matricular(dadostypes);
      showSuccess('Aluno matriculado com sucesso!');
      fecharModalAção()
    } else {
      showError('Aluno já cadastrado neste Instrumento')
    }

  } catch (error) {
    showError('Erro ao matricular');

  }
}



// ========== FUNÇÕES DE NAVEGAÇÃO ==========


const acessarProgressoAluno = async (aluno: Aluno) => {
  try {
    if (aluno.instrumentos.length > 0) {
      await router.push(`/instituto-musical/escola/aluno/progresso-aluno?id=${aluno.id}`);

    }
    showError('Aluno não esta matriculado em nenhum curso');

  } catch (error) {
    showError('Falha na navegação');
  }
};

const acessarCadastroAluno = () => router.push('/instituto-musical/escola/aluno/cadastro-aluno');

const editar = (aluno: Aluno) => {
  const url = `/instituto-musical/escola/aluno/cadastro-aluno?id=${aluno.id}`;
  router.push(url);
};

const acessarSalaReposicao = () => router.push('/instituto-musical/escola/reposicao');

// ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
if (carregando) return <div className="container mt-6"><div className="notification is-info is-light">Carregando alunos...</div></div>;

// ========== RENDERIZAÇÃO PRINCIPAL ==========
return (
  <Layout titulo="Gerenciamento de Alunos">
    <div className="container mt-6">
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
      <div className="box" style={{ boxShadow: 'none' }}>
        <div className="level is-mobile">
          <div className="level-left">
            {/* Espaço reservado para elementos futuros */}
          </div>
          <div className="level-right">
            <CustomButton
              text={<span className="is-hidden-mobile">Adicionar Aluno</span>}
              icon={<FiUserPlus />}
              onClick={() => acessarCadastroAluno()}
              className="is-small-mobile"
              style={{ borderRadius: '6px' }}
            />

            <CustomButton
              text={<span className="is-hidden-mobile">Marcar Reposição</span>}
              icon={<FaCalendar />}
              onClick={() => acessarSalaReposicao()}
              className="is-small-mobile"
              style={{ borderRadius: '6px', marginLeft: '10px' }}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="columns is-multiline is-mobile">
          <div className="column is-12-mobile is-6-tablet is-3-desktop">
            <div className="field">
              <div className="control">
                <div className="select is-fullwidth">
                  <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
                    <option value="todos">Todos status</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="column is-12-mobile is-6-tablet is-3-desktop">
            <div className="field">
              <div className="control">
                <div className="select is-fullwidth">

                </div>
              </div>
            </div>
          </div>

          <div className="column is-12-mobile is-6-tablet is-3-desktop">
            <div className="field">
              <div className="control has-icons-left">
                <input className="input is-fullwidth" type="text" placeholder="Filtrar por nome" value={filtroNome} onChange={e => setFiltroNome(e.target.value)} />
                <span className="icon is-left"><FiSearch /></span>
              </div>
            </div>
          </div>

          <div className="column is-12-mobile is-6-tablet is-3-desktop">
            <div className="field">
              <div className="control">
                <input className="input is-fullwidth" type="text" placeholder="Filtrar por CPF" value={filtroCPF} onChange={e => setFiltroCPF(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Alunos */}
        <div className="table-container is-scrollable">
          <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
            <thead>
              <tr>
                <th></th>
                <th onClick={() => ordenarAlunos('nome')} className="is-clickable">
                  <div className="is-flex is-align-items-center">
                    <span>Nome</span>
                    {getIconeOrdenacao('nome')}
                  </div>
                </th>
                <th onClick={() => ordenarAlunos('cpf')} className="is-clickable">
                  <div className="is-flex is-align-items-center">
                    <span>CPF</span>
                    {getIconeOrdenacao('cpf')}
                  </div>
                </th>
                <th onClick={() => ordenarAlunos('email')} className="is-clickable">
                  <div className="is-flex is-align-items-center">
                    <span>E-mail</span>
                    {getIconeOrdenacao('email')}
                  </div>
                </th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosFiltradosOrdenados.length > 0 ? alunosFiltradosOrdenados.map(aluno => (
                <React.Fragment key={aluno.id}>
                  <tr className="is-clickable" onClick={() => toggleExpandirAluno(aluno.id)}>
                    <td style={{ borderBottomWidth: '0', border: 'none', padding: '1.5rem' }}><span className="icon">{alunosExpandidos.has(aluno.id) ? <FiChevronDown /> : <FiChevronRight />}</span></td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.cpf}</td>
                    <td>{aluno.email}</td>
                    <td>{<div className={`tag ${getColorTag(aluno.ativo)}`}>{`${aluno.ativo === false ? 'Inativo' : 'Ativo'}`}</div>}</td>
                    <td>
                      <div className="buttons are-small">
                        <button className="button is-info is-light" title="Editar aluno" onClick={(e) => { e.stopPropagation(); editar(aluno); }}><span className="icon"><FiEdit /></span></button>
                        {aluno.ativo === true ? <button className="button is-primary is-light"
                          title="Ver progresso"
                          onClick={(e) => {
                            e.stopPropagation();
                            acessarProgressoAluno(aluno);
                          }}><span className="icon"><FiBarChart2 /></span></button> : ''}
                        {aluno.ativo === true ? <button className="button is-danger is-light"
                          title="Excluir aluno"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExcluirAluno(aluno.id);
                          }}><span className="icon"><FiTrash2 /></span></button> : ''}
                      </div>
                    </td>
                  </tr>
                  {alunosExpandidos.has(aluno.id) && (
                    <tr>
                      <td colSpan={7}>
                        <div className="box">
                          <div className="columns is-multiline">
                            <div className="column is-6">
                              <p><strong>Telefone:</strong> {aluno.telefone}</p>
                              <p><strong>Data de Cadastro:</strong> {aluno.dataCadastro || ''}</p>
                              {aluno.ativo && <p><strong>Mensalidade:</strong> {formatarMoeda(aluno.mensalidades?.[0]?.valor || 0)}</p>}
                              {aluno.instrumentos.map(instAluno => <div className="box is-6" style={{ margin: '19px', padding: '1.2rem' }}>
                                <h1><strong>Matrícula: </strong> {instAluno.numeroMatricula}</h1>
                                <h1><strong>Curso: </strong>{instAluno.instrumento?.nome}</h1>
                                {aluno.ativo && <p><strong>Horário da Aula:</strong> {instAluno.horarioAula}</p>}
                                {aluno.ativo && <p><strong>Professor:</strong> {instAluno.professor?.nome}</p>}
                                {aluno.ativo && <p><strong>Dia da Aula:</strong> {traduzirDiaSemana(instAluno.diaSemanaAula)}</p>}
                                {aluno.ativo && <p><strong>Data Matrícula:</strong> {instAluno.dataMatricula}</p>}


                                <button className="button is-danger  is-small mt-5"
                                  onClick={() => cancelarMatricula(instAluno.id ? instAluno.id : 0)}>
                                  <span className="icon"><FiX /></span>
                                  <span>Cancelar</span>
                                </button>


                              </div>)}
                              {aluno.ativo &&
                                <button className="button is-primary-custom is-small mt-5"
                                  onClick={() => acessarProgressoAluno(aluno)}>
                                  <span className="icon"><FiBarChart2 /></span>
                                  <span>Ver Progresso Completo</span>
                                </button>

                              }

                              {aluno.ativo &&
                                <button className="button is-primary-custom is-small mt-5"
                                  style={{ margin: '.2rem' }}
                                  onClick={() => abriModal(aluno)}>
                                  <span className="icon"><FiPlus /></span>
                                  <span>Nova Matrícula</span>
                                </button>

                              }
                            </div>

                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan={7} className="has-text-centered">
                    <div className="notification is-light">Nenhum aluno encontrado com os filtros atuais</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>



          {alunosFiltradosOrdenados.length > 0 ? (
            <CardList
              data={alunosFiltradosOrdenados}
              titleField='nome'
              icon={<FaUserGraduate />}
              iconColor='is-primary-custom'
              subtitleField='instrumentoNome'
              fields={[
                { label: 'CPF:', key: 'cpf' },
                { label: 'Email:', key: 'email' },
                { label: 'Contato:', key: 'telefone' }
              ]}
              tags={[
                { label: 'Cadastro', key: 'dataCadastro', color: 'has-primary-custom' },

                {
                  label: 'Status', key: 'ativo',
                  color: (item: any) => getColorTag(item.ativo),
                  format: (ativo: boolean) => ativo ? 'Ativo' : 'Inativo'
                }


              ]}
              actions={[
                {
                  label: '',
                  color: 'is-success is-light',
                  onClick: (item) => acessarProgressoAluno(item.id),
                  icon: <FiBarChart2 />,
                  itemAtivo: alunosFiltradosOrdenados.some(aluno => aluno.ativo)
                },
                {
                  label: '',
                  color: 'is-info is-light',
                  onClick: (item) => editar(item),
                  icon: <FiEdit />,
                  itemAtivo: true
                },
                {
                  label: '',
                  color: 'is-danger is-light',
                  onClick: (item) => handleExcluirAluno(item.id),
                  icon: <FiTrash2 />,
                  itemAtivo: alunosFiltradosOrdenados.some(aluno => aluno.ativo)
                }
              ]}
            />
          ) : (
            <div className="column is-12">
              <div className="notification is-light">
                Nenhum Aluno encontrado
              </div>
            </div>
          )}

        </div>
      </div>
    </div>


    <ModalGenerico
      isOpen={modalAberto}
      onClose={() => fecharModal()}
      dados={formData}
      instrumentosPorProfessor={(item) => carregarInstrumento(item)}
      onSave={matricularAluno}
      titulo={'Nova Matrícula'}
      campos={camposMatricula}
      isEdit={false}
      textoBotaoSalvar="Salvar"
    />

  </Layout>
);
};

export default GerenciamentoAlunos;