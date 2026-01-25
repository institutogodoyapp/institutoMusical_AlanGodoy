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
import { DividerGradient } from '@/components/common/divisor';
import LoadingSpinner from '@/components/common/loading';

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
  const [progressos, setProgressos] = useState<ProgressoAluno[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // ========== ESTADOS DE CONTROLE DE UI ==========
  const [expandedDisciplinas, setExpandedDisciplinas] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);

  // ========== EFEITOS ==========
useEffect(() => {

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768)
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)

  return () => window.removeEventListener('resize', checkMobile)
}, [])



useEffect(() => {
  if (progressos && progressos.length > 0 && !activeTab) {
    // Só define a primeira tab se NENHUMA estiver ativa
    setActiveTab(progressos[0].instrumentoId);
  }
}, [progressos, activeTab]);

const fetchProgresso = async () => {
        setLoading(true);
        try {
          const response = await service.getAlunoProgresso(parseId);
          setProgressos(response)
          if (response && Array.isArray(response) && response.length > 0) {
            setProgresso({
              ...response[0]
            });
          } else {
            showError('Dados não encontrados');
          }
        } catch (err) {
          setLoading(false);
          showError('Erro ao carregar os dados do aluno');
        } finally {
          setLoading(false);
        }
      };

  useEffect(() => {

    if (parseId > 0) {
      

      fetchProgresso();
    }
  }, [parseId]);

  // ========== FUNÇÕES DE ATUALIZAÇÃO DE PROGRESSO ==========
const atualizarStatusTopico = async (topicoId: number, novoStatus: StatusTopico) => {
 setUpdating(true); // ✅ Adicionado
  setLoading(false);
  try {

  
    // Atualização OTIMISTA no progressos (corrige progressoAtivo)
    setProgressos(prev => {
      if (!prev) return prev;
      
      return prev.map(p => {
        if (p.instrumentoId === activeTab) { // ✅ Mantém a tab ativa atual
          console.log(activeTab)
          const disciplinasAtualizadas = p.disciplinas.map(disciplina => ({
            ...disciplina,
            topicos: disciplina.topicos.map(topico =>
              topico.id === topicoId ? { ...topico, status: novoStatus } : topico
            )
          }));
          const { disciplinas, percentualConclusao } = atualizarProgresso(disciplinasAtualizadas);
          
          return { ...p, disciplinas, percentualConclusao };
        }
        return p;
      });
    });

    // API em background
    if (novoStatus === StatusTopico.TOPICO_CONCLUIDO) {
      await serviceProgresso.concluirTopico(topicoId);
    } else {
      await serviceProgresso.IniciarTopico(topicoId, parseId);
       }

  } catch (error) {
    showError(`Erro na atualização: ${error}`);
    // ✅ Remova o setProgresso daqui
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

  const progressoAtivo = progressos?.find(
    (p) => p.instrumentoId === activeTab
  );



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
  if (!progressoAtivo) return;

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
                <h1 className="title is-4-mobile is-3-tablet is-2-desktop has-text-centered-mobile mr-6"  
                style={{color: "#555", fontWeight: "bold"}}>
                  {progresso.alunoNome}
                </h1>
                <div className="tags is-justify-content-center-mobile is-flex-wrap-wrap">
                  <span className="tag has-primary-custom is-medium">
                    <img
                      src={getInstrumentoIcon(progressoAtivo.instrumentoTipo)}
                      // alt={progressoAtivo.instrumentoNome}
                      className="icon-img"
                      style={{
                        width: '45px',
                        height: '45px',
                        objectFit: 'contain',
                        maxWidth: '400%',
                        padding: '10px'
                      }}
                    />
                    {progressoAtivo.instrumentoNome}
                  </span>
                  <span className="tag has-primary-custom is-medium">
                    <FaCalendarAlt className="mr-2" />
                    Iniciado em: {progressoAtivo.dataInicio}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de Navegação */}
          <div className="tabs is-boxed">
            <ul>
              {progressos?.map((p) => (
                <li
                  key={p.instrumentoId}
                  className={activeTab === p.instrumentoId ? "is-active" : ""}
                  onClick={() => setActiveTab(p.instrumentoId)}
                >
                  <a>
                    <span className="icon is-small">
                      <img
                        src={getInstrumentoIcon(p.instrumentoTipo)}
                        // alt={progressoAtivo.instrumentoNome}
                        className="icon-img"
                        style={{
                          width: '55px',
                          height: '55px',
                          objectFit: 'contain',
                          maxWidth: '400%',
                          padding: '8px'
                        }}
                      /></span>
                    <span style={{
                      color: "#555", fontSize: "1.2rem", fontWeight: "bold",
                      width: '120px',
                      marginLeft: '20px',
                      padding: '5px'
                    }}>  {p.instrumentoNome}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* <DividerGradient /> */}
          {/* Conteúdo das Tabs */}

          <div>
            <div className="columns is-multiline">
              <div className="column is-full-mobile is-half-tablet">
                <div className="box" style={{ boxShadow: 'none' }}>
                  <article className="media">
                    <div className="media-content">
                      <div className="content">
                        <h3 className="title is-5 has-text-grey-dark">Progresso Geral</h3>
                        <p className="subtitle is-6 has-text-grey">{(progressoAtivo.percentualConclusao)}% completo</p>
                        <progress className="progress is-success is-medium" value={progressoAtivo.percentualConclusao} max="100"></progress>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="column is-full-mobile is-half-tablet">
                <div className="box" style={{ boxShadow: 'none' }}>
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
                          {progressoAtivo.disciplinas.filter(d => d.status === StatusProgresso.DISCIPLINA_CONCLUIDA).length} de {progresso.disciplinas.length}
                        </p>
                        <div className="tags are-medium is-flex-wrap-wrap">
                          {progressoAtivo.disciplinas.filter(d => d.status === StatusProgresso.DISCIPLINA_CONCLUIDA).length === 0 && (
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
          <div className="box" style={{ boxShadow: 'none' }}>

            {progressoAtivo.disciplinas.map(disciplina => (
              <div key={disciplina.id} className="card mb-4" style={{ boxShadow: 'none' }}>
                <header
                  className="card-header is-clickable"
                  style={{ boxShadow: 'none' }}
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
                            {disciplina.topicos.map(topico => {
                              const status = topico.status;
                              const isConcluido = status === StatusTopico.TOPICO_CONCLUIDO;
                              const isEmAndamento = status === StatusTopico.TOPICO_EM_ANDAMENTO;

                              return (
                                <tr key={topico.id}>
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