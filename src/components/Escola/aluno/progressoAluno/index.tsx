import { Layout, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import {
  FaMusic,
  FaChartLine,
  FaCheckCircle,
  FaSpinner,
  FaBook,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaUser,
  FaPercent,
  FaArrowLeft,
  FaPlay,
  FaCheck,
  FaUserGraduate
} from 'react-icons/fa';
import { useAlunoService } from '@/app/services';
import { useProgressoService } from '@/app/services/escola/progresso/progresso.service';
import { ProgressoAluno, StatusTopico, DisciplinaProgresso, statusLabels, StatusProgresso } from '@/app/models/escola/aluno/progresso';
import { voltar } from '@/util/navegacao';
import { DividerGradient} from '@/components/common/divisor';

export const ProgressoAlunos: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const service = useAlunoService();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();
  const serviceProgresso = useProgressoService();
  const router = useRouter();
  const { id } = router.query;
  const parseId = id ? Number(id) : 0;

  // ========== ESTADOS DE DADOS ==========
  const [progresso, setProgresso] = useState<ProgressoAluno | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // ========== ESTADOS DE CONTROLE DE UI ==========
  const [expandedDisciplinas, setExpandedDisciplinas] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'resumo' | 'detalhes'>('resumo');

  // ========== EFEITOS ==========
  useEffect(() => {
    if (parseId > 0) {
      const fetchProgresso = async () => {
        setLoading(true);
        try {
          const response = await service.getAlunoProgresso(parseId);

          if (response && Array.isArray(response) && response.length > 0) {
            setProgresso({
              ...response[0]
            });
          } else {
            showError('Dados não encontrados');
          }
        } catch (err) {
          showError('Erro ao carregar os dados do aluno');
        } finally {
          setLoading(false);
        }
      };

      fetchProgresso();
    }
  }, [parseId]);

  // ========== FUNÇÕES DE ATUALIZAÇÃO DE PROGRESSO ==========
  const atualizarStatusTopico = async (topicoId: number, novoStatus: StatusTopico) => {
    setUpdating(true);
    try {
      setProgresso(prev => {
        if (!prev) return prev;

        const disciplinasAtualizadas = prev.disciplinas.map(disciplina => ({
          ...disciplina,
          topicos: disciplina.topicos.map(topico =>
            topico.id === topicoId ? { ...topico, status: novoStatus } : topico
          )
        }));

        const { disciplinas, percentualConclusao } = atualizarProgresso(disciplinasAtualizadas);

        return {
          ...prev,
          disciplinas,
          percentualConclusao
        };
      });

      await (novoStatus === StatusTopico.TOPICO_CONCLUIDO
        ? serviceProgresso.concluirTopico(topicoId)
        : serviceProgresso.IniciarTopico(topicoId, parseId));
    } catch (error) {
      console.error("Erro na atualização:", error);
      setProgresso(prev => prev ? { ...prev } : null);
    } finally {
      setUpdating(false);
    }
  };

  const atualizarProgresso = (disciplinas: DisciplinaProgresso[]) => {
    const disciplinasAtualizadas = disciplinas.map(d => {
      const totalTopicos = d.topicos.length;
      const concluidos = d.topicos.filter(t => t.status === StatusTopico.TOPICO_CONCLUIDO).length;
      const progresso = Math.round((concluidos / totalTopicos) * 100);

      return {
        ...d,
        progresso,
        status: concluidos === totalTopicos
          ? StatusProgresso.DISCIPLINA_CONCLUIDA
          : concluidos > 0
            ? StatusProgresso.EM_ANDAMENTO
            : StatusProgresso.NAO_INICIADA
      };
    });

    const totalDisciplinas = disciplinasAtualizadas.length;
    const disciplinasConcluidas = disciplinasAtualizadas.filter(
      d => d.status === StatusProgresso.DISCIPLINA_CONCLUIDA
    ).length;
    const percentualConclusao = Math.round((disciplinasConcluidas / totalDisciplinas) * 100);

    return {
      disciplinas: disciplinasAtualizadas,
      percentualConclusao
    };
  };

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const toggleDisciplina = (id: number): void => {
    setExpandedDisciplinas(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (loading) {
    return (
      <Layout titulo="Carregando...">
        <div className="section">
          <div className="container">
            <div className="box has-text-centered py-6">
              <span className="icon is-large has-text-primary">
                <FaSpinner className="fa-spin" size={32} />
              </span>
              <p className="mt-3 has-text-grey-dark">Carregando progresso do aluno...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO DE ERRO ==========
  if (!progresso) {
    return (
      <Layout titulo="Erro">
        <div className="section">
          <div className="container">
            <div className="box has-text-centered py-6">
              <button
                className="button is-primary is-medium"
                onClick={voltar}
              >
                <FaArrowLeft className="mr-2" />
                Voltar para lista de alunos
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo={`Progresso do Aluno`}>
      <section className="section">
        <div className="container">
          {/* Cabeçalho do Aluno */}
          <div className="box has-background-white" style={{ boxShadow: 'none' }}>
            <div className="columns is-vcentered is-mobile is-multiline">
              <div className="column is-narrow-mobile is-full-mobile has-text-centered-mobile" style={{ flex: '0 1 0', padding: '.75rem' }}>
                <span className="icon is-large has-primary-custom">
                  <FaUserGraduate size={40} />
                </span>
              </div>

              <div className="column is-full-mobile">
                <h1 className="title is-4-mobile is-3-tablet is-2-desktop has-text-centered-mobile mr-6">
                  {progresso.alunoNome}
                </h1>
                <div className="tags is-justify-content-center-mobile is-flex-wrap-wrap">
                  <span className="tag has-primary-custom is-medium">
                    <FaMusic className="mr-2" />
                    {progresso.instrumentoNome}
                  </span>
                  <span className="tag has-primary-custom is-medium">
                    <FaCalendarAlt className="mr-2" />
                    Iniciado em: {progresso.dataInicio}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de Navegação */}
          {/* <div className="tabs is-boxed is-medium">
            <ul>
              <li className={activeTab === 'resumo' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('resumo')}>
                  <span className="icon is-small has-primary-custom"><FaChartLine /></span>
                  <span className="is-hidden-mobile">Resumo</span>
                </a>
              </li>
            </ul>
          </div> */}
{/* <DividerGradient /> */}
          {/* Conteúdo das Tabs */}
        
            <div>
              <div className="columns is-multiline">
                <div className="column is-full-mobile is-half-tablet">
                  <div className="box" style={{boxShadow: 'none'}}>
                    <article className="media">
                      <div className="media-content">
                        <div className="content">
                          <h3 className="title is-5 has-text-grey-dark">Progresso Geral</h3>
                          <p className="subtitle is-6 has-text-grey">{(progresso.percentualConclusao)}% completo</p>
                          <progress className="progress is-success is-medium" value={progresso.percentualConclusao} max="100"></progress>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
                <div className="column is-full-mobile is-half-tablet">
                  <div className="box" style={{boxShadow: 'none'}}>
                    <article className="media">
                      <div className="media-left">
                        <span className="icon is-large has-text-success">
                          <FaCheckCircle size={30} />
                        </span>
                      </div>
                      <div className="media-content">
                        <div className="content">
                          <h3 className="title is-5 has-text-grey-dark">Disciplinas Concluídas</h3>
                          <p className="subtitle is-6 has-text-grey">
                            {progresso.disciplinas.filter(d => d.status === StatusProgresso.DISCIPLINA_CONCLUIDA).length} de {progresso.disciplinas.length}
                          </p>
                          <div className="tags are-medium is-flex-wrap-wrap">
                            {progresso.disciplinas.filter(d => d.status === StatusProgresso.DISCIPLINA_CONCLUIDA).length === 0 && (
                              <span className="tag is-light">Nenhuma</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
           <DividerGradient />
            <div className="box" style={{boxShadow: 'none'}}>

              {progresso.disciplinas.map(disciplina => (
                <div key={disciplina.id} className="card mb-4" style={{boxShadow: 'none'}}>
                  <header
                    className="card-header is-clickable"
                    style={{boxShadow: 'none'}}
                    onClick={() => toggleDisciplina(disciplina.id)}
                  >
                    <p className="card-header-title has-text-grey-dark is-size-6-mobile">
                      <span className="is-hidden-mobile">{disciplina.disciplinaNome}</span>
                      <span className="is-hidden-tablet">
                        {disciplina?.disciplinaNome ? (
                          disciplina.disciplinaNome.length > 15
                            ? `${disciplina.disciplinaNome.substring(0, 15)}...`
                            : disciplina.disciplinaNome
                        ) : 'N/A'}
                      </span>
                      <span className={`tag ml-3 is-hidden-mobile ${disciplina.progresso === 100 ? 'is-success' :
                        disciplina.progresso > 50 ? 'is-info' : 'is-warning'
                        }`}>
                        {disciplina.progresso}%
                      </span>
                    </p>
                    <span className="card-header-icon">
                      {expandedDisciplinas.includes(disciplina.id) ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                      <span className={`tag ml-3 is-hidden-tablet ${disciplina.progresso === 100 ? 'is-success' :
                        disciplina.progresso > 50 ? 'is-info' : 'is-warning'
                        }`}>
                        {disciplina.progresso}%
                      </span>
                    </span>
                  </header>

                  {expandedDisciplinas.includes(disciplina.id) && (
                    <div className="card-content">
                      <div className="content">
                        <div className="table-container">
                          <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                              <tr>
                                <th>Tópico</th>
                                <th className="is-hidden-mobile">Status</th>
                                <th>Progresso</th>
                              </tr>
                            </thead>
                            <tbody>
                              {disciplina.topicos.map((topico, index) => {
                                const status = topico.status;
                                const isConcluido = status === StatusTopico.TOPICO_CONCLUIDO;
                                const isEmAndamento = status === StatusTopico.TOPICO_EM_ANDAMENTO;

                                return (
                                  <tr key={index}>
                                    <td>
                                      <span className="is-hidden-mobile">{topico.topicoNome}</span>
                                      <span className="is-hidden-tablet">{topico.topicoNome.substring(0, 20)}{topico.topicoNome.length > 20 ? '...' : ''}</span>
                                    </td>
                                    <td className="is-hidden-mobile">
                                      <span className={`tag ${isConcluido ? 'is-success' : isEmAndamento ? 'is-warning' : 'is-light'}`}>
                                        {statusLabels[status]}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="field is-grouped">
                                        <div className="control is-expanded">
                                          <progress
                                            className={`progress is-small ${isConcluido ? 'is-success' : isEmAndamento ? 'is-warning' : 'is-light'}`}
                                            value={isConcluido ? 100 : isEmAndamento ? 50 : 0}
                                            max="100"
                                          />
                                        </div>
                                        <div className="control">
                                          <div className="buttons are-small">
                                            {!isConcluido && (
                                              <button
                                                className={`button ${isEmAndamento ? 'is-static is-light' : 'is-info'}`}
                                                onClick={() => atualizarStatusTopico(topico.id, StatusTopico.TOPICO_EM_ANDAMENTO)}
                                                disabled={updating || isEmAndamento}
                                                title={isEmAndamento ? "Tópico em andamento" : "Iniciar tópico"}
                                              >
                                                <span className="icon">
                                                  <FaPlay />
                                                </span>
                                                <span className="is-hidden-mobile">
                                                  {isEmAndamento ? "Em andamento" : "Iniciar"}
                                                </span>
                                              </button>
                                            )}
                                            {!isConcluido ? (
                                              <button
                                                className="button is-success"
                                                onClick={() => atualizarStatusTopico(topico.id, StatusTopico.TOPICO_CONCLUIDO)}
                                                disabled={updating || isConcluido}
                                                title="Concluir tópico"
                                              >
                                                <span className="icon">
                                                  <FaCheck />
                                                </span>
                                                <span className="is-hidden-mobile">Concluir</span>
                                              </button>
                                            ) : (
                                              <button className="button is-success is-static">
                                                <span className="icon">
                                                  <FaCheck />
                                                </span>
                                                <span className="is-hidden-mobile">Concluído</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
        
        </div>
      </section>
    </Layout>
  );
};

export default ProgressoAlunos;