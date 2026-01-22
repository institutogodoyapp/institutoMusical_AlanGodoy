import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { CustomButton, Layout, useNotifications } from '@/components';
import { FaUser, FaSpinner, FaCheck, FaTimes, FaCalendarAlt, FaLock, FaArrowLeft, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { useAlunoService } from '@/app/services';
import { useAulaService } from '@/app/services/escola/aula/aula.service';
import { AulaForm as AulaOriginal } from '@/app/models/escola/aula';
import { extrairData } from '@/util';
import { StatusReposicao } from '@/app/models/escola/reposicao';
import { Aluno } from '@/app/models/escola/aluno';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { FaX } from 'react-icons/fa6';
import { Professor } from '@/app/models';
import { useProfessorService } from '@/app/services/escola/professor/professor.service';

export const MarcarReposicao: React.FC = () => {
    // ========== SERVICES E HOOKS ==========
    const {
        notifications,
        showSuccess,
        showError,
        removeNotification
    } = useNotifications();
    const service = useAlunoService();
    const serviceAula = useAulaService();
    const serviceProf = useProfessorService()
    const router = useRouter();

    // ========== REFS ==========
    const buscaAlunoRef = useRef<HTMLDivElement>(null);
    const buscaProfessorRef = useRef<HTMLDivElement>(null);
    // ========== ESTADOS DE DADOS ==========
    const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
    const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);
    const [aulaOriginal, setAulaOriginal] = useState<AulaOriginal | null>(null);
    const [sugestoesAlunos, setSugestoesAlunos] = useState<Aluno[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [professorId, setProfessorId] = useState<number>()
    const [alunoId, setAlunoId] = useState<number>()


    // ========== ESTADOS DE FORMULÁRIO ==========
    const [buscaAluno, setBuscaAluno] = useState('');
    const [buscaProfessor, setBuscaProfessor] = useState('');
    const [novaData, setNovaData] = useState('');
    const [novoHorario, setNovoHorario] = useState('');
    const [motivo, setMotivo] = useState('');

    // ========== ESTADOS DE UI ==========
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [loading, setLoading] = useState(false);

    // ========== DADOS DO FORMULÁRIO ==========
    const formData = {
        id: 0,
        aulaOriginalId: Number(aulaOriginal?.id),
        novaDataHora: `${novaData}T${novoHorario}:00Z`,
        motivo: motivo,
        dataHoraAulaOriginal: '',
        alunoNome: '',
        status: StatusReposicao.PENDENTE,
        dataSolicitacao: '',
    };


    // ========== EFEITOS ==========
    useEffect(() => {
        const savedState = localStorage.getItem('reposicaoState');
        if (savedState) {
            const { aluno, aula, novaData: savedData, novoHorario: savedHorario } = JSON.parse(savedState);
            if (!alunoSelecionado && aluno) setAlunoSelecionado(aluno);
            if (!aulaOriginal && aula) setAulaOriginal(aula);
            if (!novaData && savedData) setNovaData(savedData);
            if (!novoHorario && savedHorario) setNovoHorario(savedHorario);
        }
    }, []);



    useEffect(() => {
        if (alunoSelecionado || aulaOriginal || novaData || novoHorario) {
            localStorage.setItem('reposicaoState', JSON.stringify({
                aluno: alunoSelecionado,
                aula: aulaOriginal,
                novaData,
                novoHorario
            }));
        }
    }, [alunoSelecionado, aulaOriginal, novaData, novoHorario]);



    const carregarProfessoresDoAluno = () => {
        const professores: Professor[] = (
            alunoSelecionado?.instrumentos || [] 
        )
            .map(item => item.professor)
            .filter((prof): prof is Professor => Boolean(prof?.id)) 
            .filter((prof, index, self) =>
                self.findIndex(p => p.id === prof.id) === index 
            );
        setProfessores(professores); 
    };

useEffect(() => {
  console.log('=== FLUXO MARCAR REPOSIÇÃO ===');
  console.log('1. alunoSelecionado atualizado:', alunoSelecionado);
  console.log('2. professorId atualizado:', professorId);
  console.log('3. aulaOriginal atualizado:', aulaOriginal);
  console.log('4. Router query:', router.query);
}, [alunoSelecionado, professorId, aulaOriginal, router.query]);

    useEffect(() => {

        if (!buscaAluno.trim()) {
            setSugestoesAlunos([]);
            setProfessores([])
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await service.getAlunos();
                setSugestoesAlunos(Array.isArray(response) ? response : [response]);
                setMostrarSugestoes(true);
            } catch {
                setSugestoesAlunos([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [buscaAluno]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buscaAlunoRef.current && !buscaAlunoRef.current.contains(event.target as Node)) {
                setMostrarSugestoes(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
        async function buscarAulaOriginal(aulaId: number) {
            setLoading(true);
            try {
                const response = await serviceAula.getAulaPorId(aulaId);
                setAulaOriginal(response);



                if (!alunoSelecionado && response.alunoNome) {
                    try {
                        const alunos: Aluno[] = await service.getAlunos();
                        const alunoEncontrado = Array.isArray(alunos)
                            ? alunos.find(a => a.nome === response.alunoNome)
                            : response.alunoNome ? alunos : null;

                        if (alunoEncontrado) {
                            setAlunoSelecionado(alunoEncontrado);
                            setBuscaAluno(alunoEncontrado.nome);
                            router.replace({
                                pathname: router.pathname,
                                query: { ...router.query, alunoId: alunoEncontrado.id }
                            }, undefined, { shallow: true });
                        }
                    } catch (error) {
                        showError('Erro ao buscar aluno');
                    }
                }

                setNovaData('');
                setNovoHorario('');
            } catch {
                showError('Não foi possível buscar os dados da aula original.');
            } finally {
                setLoading(false);
            }
        }

        if (router.query.tipo === 'original' && router.query.aulaId) {
            buscarAulaOriginal(Number(router.query.aulaId));
            const newQuery = router.query.alunoId ? { alunoId: router.query.alunoId } : {};
            router.replace({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
        }

        if (router.query.tipo === 'reposicao' && router.query.selectedDate && router.query.selectedTime) {
            setNovaData(router.query.selectedDate as string);
            setNovoHorario(router.query.selectedTime as string);
            const newQuery = router.query.alunoId ? { alunoId: router.query.alunoId } : {};
            router.replace({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
        }

        if (router.query.alunoId && !alunoSelecionado) {
            const fetchAluno = async () => {
                try {
                    const alunos = await service.getAlunos();
                    const alunoEncontrado = Array.isArray(alunos)
                        ? alunos.find(a => a.id === Number(router.query.alunoId))
                        : Number(router.query.alunoId) ? alunos : null;

                    if (alunoEncontrado) {
                        setAlunoSelecionado(alunoEncontrado);
                        setBuscaAluno(alunoEncontrado.nome);
                    }
                } catch (error) {
                    showError('Erro ao carregar aluno');
                }
            };
            fetchAluno();
        }
    }, [router.query]);

    // ========== FUNÇÕES DE NAVEGAÇÃO ==========
    const irParaAgendaAulaOriginal = () => {

        if (!alunoSelecionado?.id) {
            showError('Selecione um aluno primeiro');
            return;
        }


        router.push({
            pathname: '/instituto-musical/escola/aula/agenda',
            query: {
                mode: 'select',
                tipo: 'original',
                alunoId: alunoSelecionado.id,
                professorId: professorId,
                returnUrl: `${router.pathname}?alunoId=${alunoSelecionado.id}`
            }
        });
    };

    const irParaAgendaReposicao = () => {
    const alunoId = alunoSelecionado?.id || Number(router.query.alunoId);
    const professorId = aulaOriginal?.professorId;
    
    console.log('=== irParaAgendaReposicao DEBUG ===');
    console.log('alunoId:', alunoId);
    console.log('professorId:', professorId);
    console.log('aulaOriginal:', aulaOriginal);
    
    if (!alunoId) {
        showError('Selecione um aluno válido primeiro');
        const input = document.querySelector('.aluno-input');
        if (input) {
            input.classList.add('is-danger');
            setTimeout(() => input.classList.remove('is-danger'), 2000);
        }
        return;
    }
    
    if (!professorId) {
        showError('Professor não encontrado na aula original. Selecione novamente a aula original.');
        return;
    }

    // Criar os parâmetros de query
    const queryParams = new URLSearchParams({
        mode: 'select',
        tipo: 'reposicao',
        alunoId: alunoId.toString(),
        professorId: professorId.toString(),
        returnUrl: `${window.location.pathname}?alunoId=${alunoId}`
    });

    // Adicionar aulaOriginalId se existir (opcional, para referência)
    if (aulaOriginal?.id) {
        queryParams.append('aulaOriginalId', aulaOriginal.id.toString());
    }

    // Navegação completa usando window.location
    const agendaUrl = `/instituto-musical/escola/aula/agenda?${queryParams.toString()}`;
    
    console.log('Navegando para:', agendaUrl);
    
    // Forçar navegação completa (reload da página)
    window.location.href = agendaUrl;
    // Ou alternativamente: window.location.assign(agendaUrl);
};
    const voltarParaListagem = () => {
        localStorage.removeItem('reposicaoState');
        router.push('/instituto-musical/escola/aluno/gerenciamento-aluno');
    };

    // ========== FUNÇÕES DE SUBMISSÃO ==========
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!alunoSelecionado || !aulaOriginal || !novaData || !novoHorario) {
            showError('Preencha todos os campos obrigatórios.');
            return;
        }
        setLoading(true);

        try {


            const response = await serviceAula.marcarReposicao(formData)

            showSuccess('Reposição agendada com sucesso!');
            setAulaOriginal(null);
            setNovaData('');
            setNovoHorario('');
            setMotivo('');
            setBuscaAluno('');
            setAlunoSelecionado(null);
            localStorage.removeItem('reposicaoState');
        } catch {
            showError('Erro ao agendar reposição. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // ========== RENDERIZAÇÃO PRINCIPAL ==========
    return (
        <Layout titulo="Marcar Reposição">
            <section className="section">
                <NotificationContainer
                    notifications={notifications}
                    onRemove={removeNotification}
                />
                <div className="container">
                    <div className="box" style={{ boxShadow: 'none' }}>
                        {/* Botão Voltar */}
                        <div className="control mb-6">
                            <CustomButton
                                text=""
                                icon={<FaX />}
                                onClick={voltarParaListagem}
                                className="control"
                            />
                        </div>

                        {/* Título */}
                        <h1 className="title is-4">
                            <span className="icon-text">
                                <span className="icon"><FaCalendarAlt /></span>
                                <span>Agendar Reposição</span>
                            </span>
                        </h1>

                        {/* Busca de Aluno */}
                        <div className="field mb-4" ref={buscaAlunoRef}>
                            <label className="label">Buscar Aluno</label>
                            <div className="control has-icons-left has-icons-right">
                                <input
                                    className="input aluno-input"
                                    type="text"
                                    value={
                                        aulaOriginal
                                            ? aulaOriginal.alunoNome
                                            : alunoSelecionado
                                                ? alunoSelecionado.nome
                                                : buscaAluno
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setBuscaAluno(value);

                                        if (!value.trim() && alunoSelecionado) {
                                            setAlunoSelecionado(null);
                                            const newQuery = { ...router.query };
                                            delete newQuery.alunoId;
                                            router.replace(
                                                { pathname: router.pathname, query: newQuery },
                                                undefined,
                                                { shallow: true }
                                            );
                                        }

                                        setMostrarSugestoes(true);
                                    }}
                                    onFocus={() => !aulaOriginal && setMostrarSugestoes(true)}
                                    placeholder={alunoSelecionado ? "" : "Digite o nome do aluno"}
                                    readOnly={!!aulaOriginal}
                                />
                                <span className="icon is-left"><FaUser /></span>
                                {buscaAluno && (
                                    <span
                                        className="icon is-right is-clickable"
                                        onClick={() => {
                                            setBuscaAluno('');
                                            setAlunoSelecionado(null);
                                        }}
                                    >
                                        <FaTimes />
                                    </span>
                                )}
                            </div>

                            {/* Sugestões de Alunos */}
                            {mostrarSugestoes && sugestoesAlunos.length > 0 && !aulaOriginal && (
                                <div className="dropdown-menu mt-0" style={{ display: 'block', width: '100%' }}>
                                    <div className="dropdown-content" style={{ marginTop: '-40px' }}>
                                        {sugestoesAlunos.map((aluno) => (
                                            <a
                                                key={aluno.id}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setAlunoSelecionado(aluno);
                                                    setBuscaAluno(aluno.nome);
                                                    setAlunoId(aluno.id)
                                                    setAulaOriginal(null);
                                                    setNovaData('');
                                                    setNovoHorario('');
                                                    setMostrarSugestoes(false);
                                                    router.replace(
                                                        {
                                                            pathname: router.pathname,
                                                            query: { ...router.query, alunoId: aluno.id },
                                                        },
                                                        undefined,
                                                        { shallow: true }
                                                    );
                                                }}
                                            >
                                                {aluno.nome}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>



                        {alunoSelecionado && (
                            <div className="field mb-4">
                                <label className="label">
                                    <span className="icon-text has-text-descrition-cinza-custom has-text-bold-normal">
                                        <span className="icon"><FaChalkboardTeacher /></span>
                                        <span>Professor</span>
                                    </span>
                                </label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            name="professorId"
                                            value={professorId || ''}
                                            onChange={(e) => setProfessorId(Number(e.target.value))}
                                            onClick={() => carregarProfessoresDoAluno()}
                                        >
                                            <option value="">Selecione um professor</option>
                                            {Array.isArray(professores) && professores.length > 0 ? (
                                                professores.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.nome}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Carregando professores...</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Seleção de Aula Original */}
                        {alunoSelecionado &&
                            <div className="field mb-4">
                                <label className="label">Aula Original</label>
                                {!aulaOriginal &&
                                    <CustomButton
                                        text="Selecionar Aula Original na Agenda"
                                        icon={<FaCalendarAlt />}
                                        onClick={irParaAgendaAulaOriginal}
                                        type="button"
                                        className="is-fullwidth"
                                    />
                                }
                            </div>}

                        {/* Formulário de Reposição */}
                        {aulaOriginal && (
                            <form onSubmit={handleSubmit}>
                                <div className="box mb-4">
                                    <label className="label mb-2">Aula que será reposta</label>
                                    <div className="is-flex is-flex-direction-column is-align-items-flex-start">
                                        <input
                                            className="input mb-2"
                                            type="text"
                                            value={`Data: ${extrairData(aulaOriginal.dataHora)}`}
                                            disabled
                                            readOnly
                                        />
                                        <input
                                            className="input mb-2"
                                            type="text"
                                            value={`Horário: ${aulaOriginal.horarioAula}`}
                                            disabled
                                            readOnly
                                        />
                                        <input
                                            className="input mb-2"
                                            type="text"
                                            value={`Professor: ${aulaOriginal.professorNome}`}
                                            disabled
                                            readOnly
                                        />
                                        <input
                                            className="input mb-2"
                                            type="text"
                                            value={`Instrumento: ${aulaOriginal.matricula?.instrumento?.nome}`}
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Seleção de Nova Data/Horário */}
                                <div className="box mb-4">
                                    <div className="is-flex is-align-items-center mb-2">
                                        <label className="label mr-2">Reposição para</label>
                                        <CustomButton
                                            text="Selecionar nova data/hora na Agenda"
                                            icon={<FaCalendarAlt />}
                                            onClick={irParaAgendaReposicao}
                                            type="button"
                                            className="ml-2"
                                        />
                                    </div>
                                    <input
                                        className="input mb-2"
                                        type="text"
                                        value={novaData ? `Data: ${novaData}` : ''}
                                        placeholder="Data da Reposição"
                                        disabled
                                        readOnly
                                    />
                                    <input
                                        className="input mb-2"
                                        type="text"
                                        value={novoHorario ? `Horário: ${novoHorario}` : ''}
                                        placeholder="Horário da Reposição"
                                        disabled
                                        readOnly
                                    />
                                </div>

                                {/* Motivo e Confirmação */}
                                {novaData && novoHorario && (
                                    <>
                                        <div className="field">
                                            <label className="label">Motivo (opcional)</label>
                                            <textarea
                                                className="textarea"
                                                rows={2}
                                                value={motivo}
                                                onChange={(e) => setMotivo(e.target.value)}
                                            />
                                        </div>
                                        <div className="field is-grouped is-grouped-right">
                                            <div className="control">
                                                <CustomButton
                                                    type="submit"
                                                    text={loading ? "Agendando..." : "Confirmar Reposição"}
                                                    icon={loading ? <FaSpinner className="fa-spin" /> : <FaCheck />}
                                                    disabled={loading}
                                                    className="is-primary"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </form>
                        )}

                        {/* Indicador de Carregamento */}
                        {loading && (
                            <div className="has-text-centered mt-4">
                                <FaSpinner className="fa-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout >
    );
};

export default MarcarReposicao;