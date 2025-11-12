import { Layout } from '@/components/layout';
import { useState, useEffect } from 'react';
import { FaFilter, FaCalendarAlt, FaPlus, FaEdit, FaSpinner, FaCog, FaTrash, FaClock, FaUser, FaMusic, FaSquare } from 'react-icons/fa';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { useAulaService } from '@/app/services/escola/aula/aula.service';
import { AulaForm, AulaFormForm, StatusAula, TipoAula } from '@/app/models/escola/aula';
import { Reposicao } from '@/app/models/escola/reposicao';
import { mapearStatus, determinarTipoAula, getDataAtual, traduzirDiaSemana, adicionarDias } from '@/util';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';
import { useProfessorService } from '@/app/services/escola/professor/professor.service';
import { Professor } from '@/app/models/escola/professor';

import { ConfigAgendaModal } from '@/components/common/modal/modalConfigAgenda';
import { useConfigAgendaService } from '@/app/services/escola/aula/agendaConfig.service';
import { ConfigAgenda, DiaSemana } from '@/app/models/escola/aula/configAgenda';
import { Console } from 'console';
import { converterTipoAulaParaTexto } from '@/util/statusETipos';

export const AgendaPage = () => {
  // ========== SERVICES E HOOKS ==========
  const service = useAulaService();
  const profService = useProfessorService()
  const router = useRouter();

  const { id } = router.query;
  const professorId = Number(id)

  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [aulas, setAulas] = useState<AulaForm[]>([]);
  const [professor, setProfessor] = useState<Professor>()
  const [reposicao, setReposicao] = useState<Reposicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);


  // ========== ESTADOS DE FILTROS E CONFIGURAÇÕES ==========
  const [dataInicio, setDataInicio] = useState<string>(getDataAtual());
  const [dataFim, setDataFim] = useState<string>(adicionarDias(getDataAtual(), 7));
  const [dias, setDias] = useState<string[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'regular' | 'reposicao'>('todos');
  const [diaSelecionadoMobile, setDiaSelecionadoMobile] = useState<string>('');

  const [configAgenda, setConfigAgenda] = useState<ConfigAgenda | null>(null);
  const configAgendaService = useConfigAgendaService();

  // ========== ESTADOS DE MODAIS E SELEÇÃO ==========
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [modalConfigAberto, setModalConfigAberto] = useState<boolean>(false);
  const [aulaSelecionada, setAulaSelecionada] = useState<AulaForm | null>(null);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [returnUrl, setReturnUrl] = useState<string>('');

  // ========== ESTADOS DE FORMULÁRIOS ==========
  const [novaAula, setNovaAula] = useState<Partial<AulaForm>>({
    dataHora: '',
    horarioAula: '',
    duracao: 60,
    professorNome: '',
    alunoNome: '',
    instrumentoNome: '',
    observacoes: '',
    status: StatusAula.AGENDADA,
    diaSemanaAula: '',
  });

  // ========== ESTADOS DE UI ==========
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // ========== CONSTANTES ==========
  const HORA_INICIO = 7;
  const HORA_FIM = 23;
  const INTERVALO = 60;

  // ========== EFEITOS ==========
  useEffect(() => {
    const loadConfigAgenda = async () => {
      try {
        setLoadingConfig(true)
        const config = await configAgendaService.getConfig();
        setConfigAgenda(config);
        console.log(config)
      } catch (error) {
        console.error('Erro ao carregar configuração da agenda:', error);
        // Usa configuração padrão se não conseguir carregar
        setConfigAgenda(configAgendaService.getDefaultConfig());

      } finally {
        setLoadingConfig(false)

      }
    };

    loadConfigAgenda();





  }, []);

  let professorIdNovo

  useEffect(() => {
    const fetchReposicoes = async () => {

      const professorIdQuery = Number(router.query.professorId) || Number(router.query.id);

      try {
        const { mode } = router.query;

        if (mode === 'select') {

          professorIdNovo = professorIdQuery
        } else {
          professorIdNovo = professorId
        }
        setLoading(true);
        const responseProf = await profService.getProfessor(professorIdNovo)
        setProfessor(responseProf)


        const response = await service.getReposições(professorIdNovo);
        const reposicoesFormatadas = Array.isArray(response)
          ? response.map((reposicao) => ({
            id: reposicao.id,
            aulaOriginalId: reposicao.aulaOriginalId,
            alunoNome: reposicao.alunoNome,
            novaDataHora: reposicao.novaDataHora,
            motivo: reposicao.motivo,
            Status: reposicao.status,
            dataSolicitacao: reposicao.dataSolicitacao,
            dataHoraAulaOriginal: reposicao.dataHoraAulaOriginal,
          }))
          : [];
        setReposicao(reposicoesFormatadas);
      } catch (error) {
        showError('Erro ao buscar aulas');
      } finally {
        setLoading(false);
      }
    };
    fetchReposicoes();
  }, [dataInicio, dataFim]);

  useEffect(() => {
    const fetchAulas = async () => {

      const professorIdQuery = Number(router.query.professorId) || Number(router.query.id);
      try {
        const { mode } = router.query;
        if (mode === 'select') {
          professorIdNovo = professorIdQuery
        } else {
          professorIdNovo = professorId
        }
        setLoading(true);
        const response = await service.getAulasPorProfessor(professorIdNovo);

        const aulasFormatadas = Array.isArray(response)
          ? response.map((aula) => ({
            id: aula.id,
            tipoAula: aula.tipoAula,
            dataHora: aula.dataHora,
            horarioAula: aula.horarioAula,
            duracao: aula.duracao || 60,
            alunoNome: `${isMobile ? getPrimeiroEUltimoNome(aula.alunoNome) : aula.alunoNome}`,
            professorNome: aula.professorNome,
            observacoes: aula.observacoes,
            instrumentoNome: aula.instrumentoNome,
            professorId: aula.professorId,
            status: mapearStatus(aula.status),
            statusOriginal: aula.statusOriginal,
            diaSemanaAula: aula.diaSemanaAula,
          }))
          : [{
            id: response.id,
            dataHora: response.dataHora,
            horarioAula: response.horarioAula,
            duracao: response.duracao || 60,
            alunoNome: response.alunoNome,
            professorNome: response.professorNome,
            observacoes: response.observacoes,
            instrumentoNome: response.instrumentoNome,
            professorId: response.professorId,
            status: response.status,
            diaSemanaAula: response.diaSemanaAula,
          }];
        setAulas(aulasFormatadas);
      } catch (error) {
        showError('Erro ao buscar aulas');
      } finally {
        setLoading(false);
      }
    };
    fetchAulas();
  }, [dataInicio, dataFim]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { mode, returnUrl } = router.query;
      if (mode === 'select') {
        setSelectionMode(true);
        setReturnUrl(returnUrl as string || '/');
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // useEffect separado para horários que depende de configAgenda
  useEffect(() => {
    if (configAgenda) {
      const novosHorarios = gerarHorariosDia();
      setHorarios(novosHorarios);
    }
  }, [configAgenda, dataInicio, dataFim]);

  useEffect(() => {
    const diasArray: string[] = [];
    const currentDate = new Date(adicionarDias(dataInicio, 2));

    const endDate = new Date(dataFim);
    currentDate.setHours(12, 0, 0, 0);
    endDate.setHours(12, 0, 0, 0);

    while (currentDate <= endDate) {
      const dia = currentDate.toISOString().split('T')[0];
      console.log(dia)
      diasArray.push(dia);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDias(diasArray);


    if (diasArray.length > 0 && !diaSelecionadoMobile) {
      setDiaSelecionadoMobile(diasArray[0]);
    }
  }, [dataInicio, dataFim]);





  // ========== FUNÇÕES AUXILIARES ==========

  const isAulaReposta = (status: StatusAula) => {
    return status === 'REPOSTA';
  };

  const gerarHorariosDia = () => {

    if (!configAgenda) {

      // Configuração padrão se não houver config
      const horarios = [];
      for (let hora = 7; hora < 23; hora++) {
        for (let minuto = 0; minuto < 60; minuto += 60) {
          horarios.push(`${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);
        }
      }

      return horarios;
    }


    const horarios = [];
    const [inicioHora, inicioMinuto] = configAgenda.horaInicio.split(':').map(Number);
    const [fimHora, fimMinuto] = configAgenda.horaFim.split(':').map(Number);

    const inicioTotalMinutos = inicioHora * 60 + inicioMinuto;
    const fimTotalMinutos = fimHora * 60 + fimMinuto;

    for (let minuto = inicioTotalMinutos; minuto < fimTotalMinutos; minuto += configAgenda.duracaoAulaMinutos) {
      const hora = Math.floor(minuto / 60);
      const min = minuto % 60;
      horarios.push(`${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
    }

    return horarios;
  };



  const getPrimeiroEUltimoNome = (nomeCompleto: string): string => {
    const partes = nomeCompleto.split(' ').filter(Boolean);
    if (partes.length <= 2) {
      return nomeCompleto;
    }
    return `${partes[0]} ${partes[partes.length - 1]}`;
  };

  const getAulaNoHorario = (dia: string, horario: string) => {
    return aulas.find((aula) => {
      const [diaAula, horaAula] = aula.dataHora.split(' ');
      const [dd, mm, yyyy] = diaAula.split('/');
      const aulaDataFormatada = `${yyyy}-${mm}-${dd}`;

      if (aulaDataFormatada !== dia) return false;

      if (aula.status === 'REPOSTA') return false;

      const [aulaHoraStr, aulaMinutoStr] = aula.horarioAula.split(':');
      const aulaHora = parseInt(aulaHoraStr);
      const aulaMinuto = parseInt(aulaMinutoStr);
      const aulaInicio = aulaHora * 60 + aulaMinuto;
      const aulaFim = aulaInicio + aula.duracao;

      const [cellHoraStr, cellMinutoStr] = horario.split(':');
      const cellHora = parseInt(cellHoraStr);
      const cellMinuto = parseInt(cellMinutoStr);
      const cellTime = cellHora * 60 + cellMinuto;

      return cellTime >= aulaInicio && cellTime < aulaFim;
    });
  };

  const getAulaNoHorarioMobile = (dia: string, horario: string) => {
    return aulas.find((aula) => {
      const [diaAula, horaAula] = aula.dataHora.split(' ');
      const [dd, mm, yyyy] = diaAula.split('/');
      const aulaDataFormatada = `${yyyy}-${mm}-${dd}`;

      if (aulaDataFormatada !== dia) return false;
 if (aula.status === 'REPOSTA') return false;
      const [aulaHoraStr, aulaMinutoStr] = aula.horarioAula.split(':');
      const aulaHora = parseInt(aulaHoraStr);
      const aulaMinuto = parseInt(aulaMinutoStr);
      const aulaInicio = aulaHora * 60 + aulaMinuto;
      const aulaFim = aulaInicio + aula.duracao;

      const [cellHoraStr, cellMinutoStr] = horario.split(':');
      const cellHora = parseInt(cellHoraStr);
      const cellMinuto = parseInt(cellMinutoStr);
      const cellTime = cellHora * 60 + cellMinuto;

      return cellTime >= aulaInicio && cellTime < aulaFim;
    });
  };


  const getReposicaoNoHorario = (dia: string, horario: string) => {
    return aulas.find((aula) => {
      const [diaAula, horaAula] = aula.dataHora.split(' ');
      const [dd, mm, yyyy] = diaAula.split('/');
      const aulaDataFormatada = `${yyyy}-${mm}-${dd}`;

      if (aulaDataFormatada !== dia) return false;


      if (aula.status !== 'REPOSTA') return false;

      const [aulaHoraStr, aulaMinutoStr] = aula.horarioAula.split(':');
      const aulaHora = parseInt(aulaHoraStr);
      const aulaMinuto = parseInt(aulaMinutoStr);
      const aulaInicio = aulaHora * 60 + aulaMinuto;
      const aulaFim = aulaInicio + aula.duracao;

      const [cellHoraStr, cellMinutoStr] = horario.split(':');
      const cellHora = parseInt(cellHoraStr);
      const cellMinuto = parseInt(cellMinutoStr);
      const cellTime = cellHora * 60 + cellMinuto;

      return cellTime >= aulaInicio && cellTime < aulaFim;
    });
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}`;
  };

  const formatarDiaSemana = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    const dataObj = new Date(Date.UTC(parseInt(ano), parseInt(mes) - 1, parseInt(dia)));
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[dataObj.getUTCDay()];
  };

  function parseReturnUrl(returnUrl: string) {
    try {
      const url = new URL(returnUrl, window.location.origin);
      const params: Record<string, string> = {};
      for (const [key, value] of url.searchParams.entries()) {
        params[key] = value;
      }
      return { pathname: url.pathname, params };
    } catch {
      const [pathname, querystring] = returnUrl.split('?');
      const params: Record<string, string> = {};
      if (querystring) {
        for (const pair of querystring.split('&')) {
          const [key, value] = pair.split('=');
          if (key) params[key] = value;
        }
      }
      return { pathname, params };
    }
  }

  const formatarDataIso = (data: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;
    const [dd, mm, yyyy] = data.split(/[\/\-]/);
    if (yyyy && mm && dd) return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    return data;
  };

  // ========== FUNÇÕES DE MANIPULAÇÃO DE AULAS ==========
  const handleClicarCelula = (dia: string, horario: string) => {
    const aulaExistente = getAulaNoHorario(dia, horario);

    if (selectionMode) {
      const { pathname, params: baseParams } = parseReturnUrl(returnUrl);
      const alunoId = router.query.alunoId;
      if (!alunoId && router.query.tipo === 'reposicao') {
        showError('alunoId não encontrado para reposição');
        return;
      }

      console.log(alunoId)

      router.push({
        pathname,
        query: aulaExistente
          ? {
            ...baseParams,
            aulaId: aulaExistente.id,
            tipo: 'original',
            data: formatarDataIso(dia),
            horario: aulaExistente.horarioAula,
            alunoId,
          }
          : {
            ...baseParams,
            selectedDate: formatarDataIso(dia),
            selectedTime: horario,
            tipo: 'reposicao',
            alunoId,
          },
      });
      return;
    }

    if (aulaExistente) {
      setAulaSelecionada(aulaExistente);
      setNovaAula({
        ...aulaExistente,
        dataHora: dia,
        horarioAula: horario,
      });
    } else {
      setAulaSelecionada(null);
      setNovaAula({
        tipoAula: TipoAula.AULA_REGULAR,
        dataHora: dia,
        horarioAula: horario,
        duracao: 60,
        professorNome: '',
        alunoNome: '',
      });
    }
    setModalAberto(true);
  };




  // Modifique a renderização dos dias para filtrar por dias de trabalho
  const diasFiltrados = dias;



  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo={` ${isMobile ? 'Agenda' : 'Agenda de Aulas'} - ${isMobile ? '' : 'Professor'} ${getPrimeiroEUltimoNome(professor?.nome ? professor.nome : '')}`}>
      <div className="container">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />
        {selectionMode && (
          <div className="notification is-info">
            <div className="is-flex is-justify-content-space-between is-align-items-center">
              <p>Selecione um horário na agenda</p>
              <button className="button is-small is-light" onClick={() => router.push(returnUrl)}>
                Cancelar seleção
              </button>
            </div>
          </div>
        )}



        {/* Filtros */}
        <div className="box " style={{ boxShadow: 'none' }}>
          <div className="is-flex is-align-items-center mb-4">
            <FaFilter className="mr-2 has-primary-custom" />
            <h2 className="subtitle is-4 has-text-grey">Filtros</h2>
          </div>
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <div className="is-flex is-align-items-center">

            </div>

            {/* Botão de Configuração */}
            <CustomButton
              type="button"
              text={'Configurar Agenda'}
              icon={<FaCog className="mr-2" />}
              className="is-primary is-outlined is-rounded"
              onClick={() => setModalConfigAberto(true)}
            />
          </div>


          <div className="columns is-mobile is-multiline">
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <Input
                label='Data Inicial'
                type="date"
                className="input is-rounded"
                aditionalClasseslabel='has-text-weight-semibold'
                aditionalClassesControl='has-icons-left'
                iconLeft={<FaCalendarAlt className="has-primary-custom" />}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                max={dataFim}


              />

            </div>

            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <Input
                label='Data Final'
                type="date"
                className="input is-rounded"
                aditionalClasseslabel='has-text-weight-semibold'
                aditionalClassesControl='has-icons-left'
                iconLeft={<FaCalendarAlt className="has-primary-custom" />}
                value={dataFim}

                onChange={(e) => setDataFim(e.target.value)}
                min={dataInicio}

              />

            </div>

            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <div className="field">
                <label className="label has-text-weight-semibold">Tipo de Aula</label>
                <div className="control is-expanded">
                  <div className="select is-fullwidth is-rounded">
                    <select
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value as 'todos' | 'regular' | 'reposicao')}
                      className="has-text-weight-semibold"
                    >
                      <option value="todos">Todos</option>
                      <option value="regular">Regular</option>
                      <option value="reposicao">Reposição</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de Dia Mobile */}
        {isMobile && diasFiltrados.length > 0 && (
          <div className="box has-background-light">
            <div className="field">
              <label className="label has-text-weight-semibold">Selecione o dia</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth is-rounded">
                  <select
                    value={diaSelecionadoMobile}
                    onChange={(e) => setDiaSelecionadoMobile(e.target.value)}
                    className="has-text-weight-semibold"
                  >
                    {diasFiltrados.map((dia) => (
                      <option key={dia} value={dia}>
                        {formatarDiaSemana(dia)} - {formatarData(dia)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grade de Horários */}
        <div className="schedule-container">
          <div className="schedule-header">
            {!isMobile && <div className="schedule-time-label">Horário</div>
            }           {!isMobile
              ? diasFiltrados.map((dia) => (
                <div key={dia} className="schedule-day-header">
                  <div className="schedule-weekday">{formatarDiaSemana(dia)}</div>
                  <div className="schedule-date">{formatarData(dia)}</div>
                </div>
              ))
              : (
                <div className="schedule-day-header">
                  <div className="schedule-weekday">{formatarDiaSemana(diaSelecionadoMobile)}</div>
                  <div className="schedule-date">{formatarData(diaSelecionadoMobile)}</div>
                </div>
              )}
          </div>

          <div className="schedule-body">
            {horarios.map((horario) => (
              <div key={horario} className="schedule-row">
                <div className="schedule-time">{horario}</div>

                {!isMobile
                  ? diasFiltrados.map((dia) => {
                    const aulaAtiva = getAulaNoHorario(dia, horario);
                    const aulaReposta = getReposicaoNoHorario(dia, horario);

                    return (
                      <div
                        key={`${dia}-${horario}`}
                        onClick={() => {
                          handleClicarCelula(dia, horario);
                        }}
                        className={`schedule-cell ${aulaAtiva
                          ? aulaAtiva.tipoAula === 'AULA_REGULAR'
                            ? 'has-class'
                            : 'has-makeup'
                          : aulaReposta
                            ? 'has-reposta-info' // Classe para célula com aula reposta (mas não ativa)
                            : 'is-available'
                          }`}
                      >
                        {/* Cabeçalho da aula reposta, se existir */}
                        {aulaReposta && (
                          <div className="reposta-info-header">
                            <div className="class-student-minimal">{getPrimeiroEUltimoNome(aulaReposta.alunoNome)}</div>
                            <div className="class-status-minimal is-reposta">Reposta</div>
                          </div>
                        )}

                        {/* Conteúdo da aula ativa ou botão de adicionar */}
                        {aulaAtiva ? (
                          <div className="class-info">
                            <div className="class-student">{getPrimeiroEUltimoNome(aulaAtiva.alunoNome)}</div>

                            <div className={`class-type ${aulaAtiva.tipoAula === TipoAula.AULA_REGULAR
                              ? 'is-regular'
                              : 'is-makeup'
                              }`}>
                              {aulaAtiva.instrumentoNome}
                            </div>
                          </div>
                        ) : (
                          <div className="add-class">
                            { selectionMode && <button
                              className="button is-small is-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClicarCelula(dia, horario);
                              }}
                            >
                              <FaPlus className="has-text-grey-light" />
                            </button>}

                          </div>
                        )}
                      </div>
                    );
                  })
                  : (
                    // Table Mobile - VERSÃO CORRIGIDA
                    <div
                      onClick={() => handleClicarCelula(diaSelecionadoMobile, horario)}
                      className={`schedule-cell ${getAulaNoHorarioMobile(diaSelecionadoMobile, horario)
                        ? getAulaNoHorarioMobile(diaSelecionadoMobile, horario)?.status === 'REPOSTA'
                          ? 'has-reposta' // Usa a mesma classe do desktop
                          : getAulaNoHorarioMobile(diaSelecionadoMobile, horario)?.tipoAula === TipoAula.AULA_REGULAR
                            ? 'has-class'
                            : 'has-makeup'
                        : 'is-available'
                        }`}
                    >
                      {/* Cabeçalho da aula reposta, se existir - IGUAL AO DESKTOP */}
                      {getReposicaoNoHorario(diaSelecionadoMobile, horario) && (
                        <div className="reposta-info-header">
                          <div className="class-student-minimal">
                            {getPrimeiroEUltimoNome(getReposicaoNoHorario(diaSelecionadoMobile, horario)!.alunoNome)}
                          </div>
                          <div className="class-status-minimal is-reposta">Reposta</div>
                        </div>
                      )}

                      {/* Conteúdo da aula ativa ou botão de adicionar */}
                      {getAulaNoHorario(diaSelecionadoMobile, horario) ? (
                        <div className="class-info">
                          <div className="class-student">
                            {getPrimeiroEUltimoNome(getAulaNoHorario(diaSelecionadoMobile, horario)!.alunoNome)}
                          </div>
                          <div className={`class-type ${getAulaNoHorario(diaSelecionadoMobile, horario)!.tipoAula === TipoAula.AULA_REGULAR
                              ? 'is-regular'
                              : 'is-makeup'
                            }`}>
                           {getAulaNoHorario(diaSelecionadoMobile, horario)!.instrumentoNome} - {converterTipoAulaParaTexto(getAulaNoHorario(diaSelecionadoMobile, horario)!.tipoAula)}
                          </div>
                        </div>
                      ) : (
                        <div className="add-class">
                         {selectionMode && <button
                            className="button is-small is-text"
                            disabled= {!selectionMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClicarCelula(diaSelecionadoMobile, horario);
                            }}
                          >
                            <FaPlus className="has-text-grey-light" />
                          </button>}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="box mt-5" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
          <div className="is-flex is-flex-wrap-wrap is-justify-content-center is-gap-3 mr-3"   >
            <span className="tag is-light is-rounded" style={{ marginRight: '30px', marginBottom: '10px' }}>
              <span className="icon has-text-grey">
                <i className="fas fa-square">< FaSquare /> </i>
              </span>
              <span className="has-text-weight-semibold">Horário Livre</span>
            </span>
            <span className="tag is-warning is-rounded" style={{ marginRight: '30px', marginBottom: '10px' }}>
              <span className="icon">
                <i className="fas fa-square">< FaSquare /></i>
              </span>
              <span className="has-text-weight-semibold">Aula Regular</span>
            </span>
            <span className="tag is-danger is-rounded" style={{ marginRight: '30px', marginBottom: '10px' }}>
              <span className="icon">
                <i className="fas fa-square">< FaSquare /></i>
              </span>
              <span className="has-text-weight-semibold">Reposição</span>
            </span>
            <span className="tag is-success is-rounded " style={{ marginRight: '30px', marginBottom: '10px' }}>
              <span className="icon">
                <i className="fas fa-square">< FaSquare /></i>
              </span>
              <span className="has-text-weight-semibold">Aula Reposta</span>
            </span>
          </div>
        </div>
      </div>


      <style jsx>{`
  .schedule-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .schedule-header {
    display: flex;
    background: #f5f5f5;
    border-bottom: 1px solid #e8e8e8;
  }

  .schedule-time-label {
    width: 80px;
    padding: 12px;
    font-weight: bold;
    color: gray;
    text-align: center;
    border-right: 1px solid #e8e8e8;
    flex-shrink: 0;
  }

  .schedule-day-header {
    flex: 1;
    padding: 12px;
    text-align: center;

    min-width: 0; /* Importante para flexbox */
  }

  .schedule-day-header:last-child {
    border-right: none;
  }

  .schedule-weekday {
    font-weight: bold;
    color: #363636;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .schedule-date {
    font-size: 0.9em;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .schedule-body {
    max-height: 600px;
    overflow-y: auto;
  }

  .schedule-row {
    display: flex;
    border-bottom: 1px solid #e8e8e8;
    min-height: 80px; /* Altura fixa mínima */
  }

  .schedule-row:last-child {
    border-bottom: none;
  }

  .schedule-time {
    width: 80px;
    padding: 8px 12px;
    text-align: center;
    font-size: 0.9em;
    color: #666;
    background: #fafafa;
    border-right: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .schedule-cell {
    flex: 1;
    min-height: 80px; /* Altura fixa */
    height: 80px; /* Força altura fixa */
    padding: 4px;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0; /* Importante para flexbox */
    overflow: hidden; /* Impede conteúdo extra */
    position: relative;
  }

  .schedule-cell:last-child {
    border-right: none;
  }

  .schedule-cell:hover {
    background: #f8f9fa;
  }

  .schedule-cell.is-available {
    background: #f8f9fa;
  }

  .schedule-cell.has-class {
    background: #fff3cd;
    border-left: 1px solid #ffc107;
  }

  .schedule-cell.has-makeup {
    background: #f8d7da;
    border-left: 1px solid #dc3545;
  }

  .schedule-cell.has-reposta {
  color: white;
    border-left: 4px solid #28a745;
  }

  .schedule-cell.not-clickable {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .schedule-cell.not-clickable:hover {
    background: inherit;
  }

  /* CONTEÚDO DAS CÉLULAS - ALTURA CONTROLADA */
  .class-info {
    padding: 2px;
    max-height: 72px; /* Altura máxima do conteúdo */
    overflow: hidden;
  }

  .class-student {
    font-weight: bold;
    font-size: 0.75em; /* Reduzido */
    margin-bottom: 1px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .class-teacher {
    font-size: 0.7em; /* Reduzido */
    color: #666;
    margin-bottom: 1px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .class-instrument {
    font-size: 0.65em; /* Reduzido */
    color: #888;
    margin-bottom: 3px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .class-type {
    display: inline-block;
    padding: 1px 4px; /* Reduzido */
    border-radius: 8px;
    font-size: 0.6em; /* Reduzido */
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.2;
  }

  .class-type.is-regular {
    background: #ffc107;
    color: #000;
  }

  .class-type.is-makeup {
    background: #dc3545;
    color: #fff;
  }

  .class-status {
    display: inline-block;
    padding: 1px 4px;
    border-radius: 8px;
    font-size: 0.6em;
    font-weight: bold;
    margin-top: 1px;
    line-height: 1.2;
  }

  .class-status.is-reposta {
    background: #28a745;
    color: #fff;
  }

  .add-class {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  /* AULAS REPOSTAS */
  .schedule-cell.has-reposta-minimal {
    background: #f8f9fa;
    border-left: 1px solid #28a745;
    opacity: 0.7;
  }

  .reposta-minimal-info {
    padding: 2px;
    text-align: center;
    max-height: 72px;
    overflow: hidden;
  }

  .class-student-minimal {
    font-weight: bold;
    font-size: 0.7em;
    margin-bottom: 2px;
    color: #424242;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .class-status-minimal {
    display: inline-block;
    padding: 1px 4px;
    border-radius: 8px;
    font-size: 0.55em;
    font-weight: bold;
    line-height: 1.2;
  }

  .class-status-minimal.is-reposta {
    background: #28a745;
    color: #fff;
  }

  /* DIAS DE FOLGA */
  .schedule-day-header.not-working-day {
    background-color: #f8f9fa;
    opacity: 0.6;
  }

  .schedule-day-off {
    font-size: 0.7em;
    color: #dc3545;
    font-weight: bold;
    margin-top: 2px;
    line-height: 1.2;
  }

  .schedule-cell.not-working-day {
    background-color: #f8f9fa;
    opacity: 0.4;
    cursor: not-allowed;
  }

  

  .day-off-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6c757d;
    font-size: 0.7em;
    font-weight: bold;
    text-align: center;
    line-height: 1.2;
  }

  .schedule-cell.not-clickable:hover {
    background-color: #f8f9fa;
  }

  /* CABEÇALHO DE AULA REPOSTA */
  .reposta-info-header {
    max-height: 72px;
    overflow: hidden;
  }

 
`}</style>

      <ConfigAgendaModal
        isOpen={modalConfigAberto}
        onClose={() => setModalConfigAberto(false)}
        professorId={professorId}
        onConfigUpdate={(newConfig) => {
          setConfigAgenda(newConfig);
          // Recarregar dados quando a configuração mudar
          // Você pode adicionar um refresh dos dados aqui se necessário
        }}
      />

    </Layout>
  );
};