import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiTrash2, FiEdit, FiUserPlus, FiChevronUp, FiChevronRight, FiChevronDown, FiBarChart2, FiMoreVertical } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { Aluno, Instrumento } from '@/app/models/escola';
import { useAlunoService } from '@/app/services';
import { traduzirDiaSemana } from '@/util/traduçãoApi';
import { FaCalendar, FaUserGraduate } from 'react-icons/fa';
import { formatarMoeda } from '@/util/moeda';
import CardList from '@/components/common/tableMobile';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';

export const GerenciamentoAlunos: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const service = useAlunoService();
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


  // ========== ESTADOS DE FILTROS E ORDENAÇÃO ==========
  const [filtroNome, setFiltroNome] = useState<string>('');
  const [filtroCPF, setFiltroCPF] = useState<string>('');
  const [filtroInstrumento, setFiltroInstrumento] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [ordem, setOrdem] = useState<{ campo: keyof Aluno; direcao: 'asc' | 'desc' }>({ campo: 'nome', direcao: 'asc' });

  // ========== EFEITOS ==========
  useEffect(() => {
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
    carregarAlunos();
  }, []);

  // ========== FUNÇÕES DE CONTROLE DE UI ==========

  const toggleExpandirAluno = (id: number) => {
    const novosExpandidos = new Set(alunosExpandidos);
    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id);
    } else {
      novosExpandidos.add(id);
    }
    setAlunosExpandidos(novosExpandidos);
  };

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
      const instrumentoMatch = filtroInstrumento === 'todos' || aluno.instrumento?.nome === filtroInstrumento;
      const statusMatch = filtroStatus === 'todos' || (filtroStatus === 'ativo' && aluno.ativo) || (filtroStatus === 'inativo' && !aluno.ativo);
      return nomeMatch && cpfMatch && instrumentoMatch && statusMatch;
    })
    .sort((a, b) => {
      const valorA = a[ordem.campo] || '';
      const valorB = b[ordem.campo] || '';
      if (valorA < valorB) return ordem.direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordem.direcao === 'asc' ? 1 : -1;
      return 0;
    });



  const instrumentosDisponiveis = alunos
    .map(aluno => aluno.instrumento)
    .filter((instrumento): instrumento is Instrumento => !!instrumento)
    .filter((instrumento, index, self) =>
      self.findIndex(i => i.id === instrumento.id) === index
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

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

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const acessarProgressoAluno = async (id: number) => {
    try {
      await router.push(`/instituto-musical/escola/aluno/progresso-aluno?id=${id}`);
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
                      <option value="todos">Todos status</option>
                      <option value="ativo">Ativos</option>
                      <option value="inativo">Inativos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={filtroInstrumento} onChange={e => setFiltroInstrumento(e.target.value)}>
                      <option value="todos">Todos instrumentos</option>
                      {instrumentosDisponiveis.map((instrumentoTipo, index) => (
                        <option key={`${instrumentoTipo?.id}-${instrumentoTipo}-${index}`} value={instrumentoTipo?.nome}>
                          {instrumentoTipo?.nome}
                        </option>
                      ))}
                    </select>
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
                  <th onClick={() => ordenarAlunos('instrumento')} className="is-clickable">
                    <div className="is-flex is-align-items-center">
                      <span>Instrumento</span>
                      {getIconeOrdenacao('instrumento')}
                    </div>
                  </th>
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
                      <td>{aluno.instrumento ? aluno.instrumento.nome : 'Não especificado'}</td>
                      <td>
                        <div className="buttons are-small">
                          <button className="button is-info is-light" title="Editar aluno" onClick={(e) => { e.stopPropagation(); editar(aluno); }}><span className="icon"><FiEdit /></span></button>
                          <button className="button is-primary is-light" title="Ver progresso" onClick={(e) => { e.stopPropagation(); acessarProgressoAluno(aluno.id); }}><span className="icon"><FiBarChart2 /></span></button>
                          <button className="button is-danger is-light" title="Excluir aluno" onClick={(e) => { e.stopPropagation(); handleExcluirAluno(aluno.id); }}><span className="icon"><FiTrash2 /></span></button>
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
                                <p><strong>Dia da Aula:</strong> {traduzirDiaSemana(aluno.diaSemanaAula)}</p>
                              </div>
                              <div className="column is-4">
                                <p><strong>Horário da Aula:</strong> {aluno.horarioAula}</p>
                                <p><strong>Professor:</strong> {aluno.professor?.nome}</p>
                                <p><strong>Mensalidade:</strong> {formatarMoeda(aluno.mensalidades?.[0]?.valor || 0)}</p>
                              </div>
                              <div className="column is-4">
                                <button className="button is-primary-custom is-small mt-5" onClick={() => acessarProgressoAluno(aluno.id)}>
                                  <span className="icon"><FiBarChart2 /></span>
                                  <span>Ver Progresso Completo</span>
                                </button>
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
                icon={<FaUserGraduate/>}
                iconColor='is-primary-custom'
                subtitleField='instrumentoNome'
                fields={[
                  { label: 'CPF:', key: 'cpf' },
                  { label: 'Email:', key: 'email' },
                  { label: 'Contato:', key: 'telefone' }
                ]}
                tags={[
                  { label: 'Cadastro', key: 'dataCadastro', color: 'has-primary-custom' }
                ]}
                actions={[
                  {
                    label: '',
                    color: 'is-success is-light',
                    onClick: (item) => acessarProgressoAluno(item.id),
                    icon: <FiBarChart2 />
                  },
                  {
                    label: '',
                    color: 'is-info is-light',
                    onClick: (item) => editar(item),
                    icon: <FiEdit />
                  },
                  {
                    label: '',
                    color: 'is-danger is-light',
                    onClick: (item) => handleExcluirAluno(item.id),
                    icon: <FiTrash2 />
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
    </Layout>
  );
};

export default GerenciamentoAlunos;