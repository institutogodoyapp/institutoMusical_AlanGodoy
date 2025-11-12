import { CustomButton, Layout } from '@/components';
import { useState, useEffect } from 'react';
import {
  FaMoneyBillWave,
  FaSearch,
  FaEdit,
  FaCalendarAlt,
  FaSpinner,
  FaCog,
  FaCheck,
  FaUser,
  FaFilter,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa';
import { Aluno } from '@/app/models/escola/aluno'
import { Mensalidades, Config } from '@/app/models/escola/financeiro/mensalidade'
import { useAlunoService } from '@/app/services';
import { useMensalidadeService } from '@/app/services/escola/finanças/mensalidade.service';
import { useRouter } from 'next/router';

// type Aluno = {
//   id: number;
//   nome: string;
//   email: string;
//   instrumento: string;
// };

// type Mensalidade = {
//   id: number;
//   alunoId: number;
//   alunoNome: string;
//   valor: number;
//   dataVencimento: string;
//   dataPagamento: string | null;
//   status: 'PAGA' | 'PENDENTE' | 'ATRASADA';
//   instrumento: string;
// };

type ConfiguracaoMensalidade = {
  id: number;
  valorBase: number;
  dataAtualizacao: string;
  ativo: boolean;
};

interface MensalidadesTabProps { }

export const GerenciamentoMensalidades: React.FC<MensalidadesTabProps> = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const alunoService = useAlunoService()
  const mensalidadeService = useMensalidadeService()

  // ========== ESTADOS DE DADOS ==========
  const [mensalidades, setMensalidades] = useState<Mensalidades[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [mensalidadesEmAberto, setMensalidadesEmAberto] = useState<Mensalidades[]>([])
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);

  // ========== ESTADOS DE FILTROS ==========
  const [periodoInicio, setPeriodoInicio] = useState<string>('');
  const [periodoFim, setPeriodoFim] = useState<string>('');
  const [buscaAluno, setBuscaAluno] = useState<string>('');

  // ========== ESTADOS DE UI ==========
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // ========== EFEITOS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
  const fetchData = async () => {
    try {
      setLoading(true);

      const responseAlunos: Aluno[] = await alunoService.getAlunos()
      const mensalidades: Mensalidades[] = await mensalidadeService.listarMensalidadesAberto();
      
      console.log(mensalidades)
      setMensalidadesEmAberto(mensalidades)
      setAlunos(responseAlunos);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES DE FILTRO E BUSCA ==========
  const handleBuscarPorPeriodo = async () => {
    if (alunoSelecionado?.id == null) {
      return
    }
    console.log("fui chamada")
    const responseMensalidades: Mensalidades[] = await mensalidadeService.listarMensalidadePorAluno(alunoSelecionado?.id)
    console.log(responseMensalidades)
    setMensalidades(responseMensalidades)
  };

  const handleSelecionarAluno = async (aluno: Aluno) => {
    setAlunoSelecionado(aluno);
    setBuscaAluno(aluno.nome);
    setBuscaAluno("")
    setShowFilters(false);
  };

  const fecharAlunoSelecionado = () => {
    setAlunoSelecionado(null)
    setMensalidades([])
  }

  // ========== FUNÇÕES DE MANIPULAÇÃO DE MENSALIDADES ==========
  const handleMarcarComoPaga = async (mensalidadeId: number) => {
    if (confirm("Confirmar pagamento desta mensalidade?")) {
      await mensalidadeService.marcarPaga(mensalidadeId)
    }
    await fetchData()
    await handleBuscarPorPeriodo()
  };

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const mensalidadesFiltradas = mensalidades.filter(mensalidade => {
    if (alunoSelecionado && mensalidade.alunoId !== alunoSelecionado.id) return false;
    if (periodoInicio && new Date(mensalidade.dataVencimento) < new Date(periodoInicio)) return false;
    if (periodoFim && new Date(mensalidade.dataVencimento) > new Date(periodoFim)) return false;
    return true;
  });

  const alunosFiltrados = buscaAluno
    ? alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
      aluno.email.toLowerCase().includes(buscaAluno.toLowerCase()))
    : [];

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="box has-text-centered">
            <span className="icon is-large">
              <FaSpinner className="fa-spin" />
            </span>
            <p>Carregando mensalidades...</p>
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <section className="section">
      <div className="container">
        {/* Botão de Filtros para Mobile */}
        <div className="is-hidden-tablet mb-4">
          <button
            className="button is-primary is-fullwidth"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="icon">
              <FaFilter />
            </span>
            <span>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
          </button>
        </div>

        {/* Filtros */}
        <div className={`box ${!showFilters && 'is-hidden-mobile'} `} style={{ boxShadow: 'none', margin: '0 0 0 0', padding: '0px' }}>
          <div className="level is-mobile">
            <div className="level-left">
              <h2 className="title is-5">Mensalidades</h2>
            </div>
            <div className="level-right is-hidden-tablet">
              <button
                className="delete"
                onClick={() => setShowFilters(false)}
              ></button>
            </div>
          </div>
          <label className="label">Buscar Aluno</label>
          <div className="field is-horizontal">
            <input
              className="input"
              type="text"
              placeholder="Digite o nome ou email do aluno"
              value={buscaAluno}
              onChange={(e) => setBuscaAluno(e.target.value)}
            />
            <div className='field' style={{ marginLeft: '10px' }}>
              <CustomButton
                className="is-hidden-mobile"
                onClick={handleBuscarPorPeriodo}
                text={'Filtrar'}
                icon={<FaFilter />}
              />
            </div>
          </div>
        </div>

        {/* Dropdown de Alunos Filtrados */}
        {buscaAluno && alunosFiltrados.length > 0 && (
          <div className="dropdown is-active" style={{ width: '100%' }}>
            <div className="dropdown-menu" style={{ width: '100%' }}>
              <div className="dropdown-content">
                {alunosFiltrados.map(aluno => (
                  <a
                    key={aluno.id}
                    className="dropdown-item"
                    onClick={() => handleSelecionarAluno(aluno)}
                  >
                    {aluno.nome} - {aluno.instrumento?.nome}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aluno Selecionado */}
        {alunoSelecionado && (
          <div className="mt-2">
            <span className="tag is-info is-medium">
              {alunoSelecionado.nome}
              <button
                className="delete is-small ml-2"
                onClick={() => fecharAlunoSelecionado()}
              ></button>
            </span>
          </div>
        )}

        {/* Lista de Mensalidades */}
        <div className="box" style={{marginTop: '40px',  boxShadow: 'none'}}>
          <div className="level is-mobile">
            <div className="level-left">
              <h2 className="title is-5">
                {alunoSelecionado ? 'Mensalidades do Aluno' : 'Mensalidades em Aberto'}
              </h2>
            </div>
            {/* <div className="level-right">
              <div className="tags has-addons">
                <span className="tag"></span>
                <span className="tag is-primary">
                  {alunoSelecionado ? mensalidadesFiltradas.length : mensalidadesEmAberto.length}
                </span>
              </div>
            </div> */}
          </div>

          {/* Conteúdo das Mensalidades */}
          {alunoSelecionado ? (
            // Mensalidades Filtradas por Aluno
            mensalidadesFiltradas.length === 0 ? (
              <div className="has-text-centered py-6">
                <p>Nenhuma mensalidade encontrada para este aluno.</p>
              </div>
            ) : (
              <div className="table-container">
                {/* Tabela para Desktop */}
                <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
                  <thead>
                    <tr>
                      <th>Aluno</th>
                      <th>Instrumento</th>
                      <th>Valor</th>
                      <th>Vencimento</th>
                      <th>Pagamento</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensalidadesFiltradas.map(mensalidade => (
                      <tr key={mensalidade.id}>
                        <td>{mensalidade.alunoNome}</td>
                        <td>{mensalidade.instrumentoNome}</td>
                        <td>R$ {mensalidade.valor.toFixed(2)}</td>
                        <td>{mensalidade.dataVencimento}</td>
                        <td>{mensalidade.dataPagamento}</td>
                        <td>
                          <span className={`tag ${mensalidade.status === 'PAGA' ? 'is-success' :
                            mensalidade.status === 'ATRASADA' ? 'is-danger' : 'is-warning'
                            }`}>
                            {mensalidade.status === 'PAGA' ? 'Paga' :
                              mensalidade.status === 'ATRASADA' ? 'Atrasada' : 'Pendente'}
                          </span>
                        </td>
                        <td>
                          {mensalidade.status !== 'PAGA' && (
                            <button
                              className="button is-success is-small"
                              onClick={() => handleMarcarComoPaga(mensalidade.id)}
                            >
                              <span className="icon">
                                <FaCheck />
                              </span>
                              <span className="is-hidden-mobile">Marcar como Paga</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Cards para Mobile */}
                <div className="is-hidden-tablet">
                  {mensalidadesFiltradas.map(mensalidade => (
                    <div key={mensalidade.id} className="card mb-4" >
                      <div className="card-content">
                        <div className="media">
                          <div className="media-content">
                            <p className="title is-6">{mensalidade.alunoNome}</p>
                            <p className="subtitle is-7">{mensalidade.instrumentoNome}</p>
                          </div>
                        </div>
                        <div className="content">
                          <div className="columns is-mobile is-multiline">
                            <div className="column is-half">
                              <p className="heading">Valor</p>
                              <p>R$ {mensalidade.valor.toFixed(2)}</p>
                            </div>
                            <div className="column is-half">
                              <p className="heading">Vencimento</p>
                              <p>{mensalidade.dataVencimento}</p>
                            </div>
                            <div className="column is-half">
                              <p className="heading">Pagamento</p>
                              <p>{mensalidade.dataPagamento}</p>
                            </div>
                            <div className="column is-half">
                              <p className="heading">Status</p>
                              <span className={`tag ${mensalidade.status === 'PAGA' ? 'is-success' :
                                mensalidade.status === 'ATRASADA' ? 'is-danger' : 'is-warning'
                                }`}>
                                {mensalidade.status === 'PAGA' ? 'Paga' :
                                  mensalidade.status === 'ATRASADA' ? 'Atrasada' : 'Pendente'}
                              </span>
                            </div>
                          </div>
                          {mensalidade.status !== 'PAGA' && (
                            <div className="has-text-centered mt-3">
                              <button
                                className="button is-success is-small is-fullwidth"
                                onClick={() => handleMarcarComoPaga(mensalidade.id)}
                              >
                                <span className="icon">
                                  <FaCheck />
                                </span>
                                <span>Marcar como Paga</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            // Mensalidades em Aberto
            mensalidadesEmAberto.length === 0 ? (
              <div className="has-text-centered py-6">
                <p>Nenhuma mensalidade em aberto encontrada.</p>
              </div>
            ) : (
              <div className="table-container">
                {/* Tabela para Desktop */}
                <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
                  <thead>
                    <tr>
                      <th>Aluno</th>
                      <th>Instrumento</th>
                      <th>Valor</th>
                      <th>Vencimento</th>
                      <th>Pagamento</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensalidadesEmAberto.map(mensalidade => (
                      <tr key={mensalidade.id}>
                        <td>{mensalidade.alunoNome}</td>
                        <td>{mensalidade.instrumentoNome}</td>
                        <td>R$ {mensalidade.valor.toFixed(2)}</td>
                        <td>{mensalidade.dataVencimento}</td>
                        <td>{mensalidade.dataPagamento}</td>
                        <td>
                          <span className={`tag ${mensalidade.status === 'PAGA' ? 'is-success' :
                            mensalidade.status === 'ATRASADA' ? 'is-danger' : 'is-warning'
                            }`}>
                            {mensalidade.status === 'PAGA' ? 'Paga' :
                              mensalidade.status === 'ATRASADA' ? 'Atrasada' : 'Pendente'}
                          </span>
                        </td>
                        <td>
                          {mensalidade.status !== 'PAGA' && (
                            <button
                              className="button is-success is-small"
                              onClick={() => handleMarcarComoPaga(mensalidade.id)}
                            >
                              <span className="icon">
                                <FaCheck />
                              </span>
                              <span className="is-hidden-mobile">Marcar como Paga</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Cards para Mobile */}
                <div className="is-hidden-tablet" >
                  {mensalidadesEmAberto.map(mensalidade => (
                    <div key={mensalidade.id} className="card"style={{padding: '.2rem', marginBottom: '30px'}}>
                      <div className="card-content">
                        <div className="media">
                          <div className="" >
                            <p className="title is-6">{mensalidade.alunoNome}</p>
                            <p className="subtitle is-7">{mensalidade.instrumentoNome}</p>
                          </div>
                        </div>
                        <div className="content">
                          <div className="columns is-mobile is-multiline">
                            <div className="column is-half">
                              <p className="heading">Valor</p>
                              <p>R$ {mensalidade.valor.toFixed(2)}</p>
                            </div>
                            <div className="column is-half">
                              <p className="heading">Vencimento</p>
                              <p>{mensalidade.dataVencimento}</p>
                            </div>
                            <div className="column is-half">
                              <p className="heading">Pagamento</p>
                              <p>{mensalidade.dataPagamento}</p>
                            </div>
                            <div className="column is-half">
                              <p className="heading">Status</p>
                              <span className={`tag ${mensalidade.status === 'PAGA' ? 'is-success' :
                                mensalidade.status === 'ATRASADA' ? 'is-danger' : 'is-warning'
                                }`}>
                                {mensalidade.status === 'PAGA' ? 'Paga' :
                                  mensalidade.status === 'ATRASADA' ? 'Atrasada' : 'Pendente'}
                              </span>
                            </div>
                          </div>
                          {mensalidade.status !== 'PAGA' && (
                            <div className="has-text-centered mt-3">
                              <button
                                className="button is-success is-small is-fullwidth"
                                onClick={() => handleMarcarComoPaga(mensalidade.id)}
                              >
                                <span className="icon">
                                  <FaCheck />
                                </span>
                                <span>Marcar como Paga</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
};