import { Layout, useNotifications } from '@/components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components';
import Link from 'next/link';
import { Reposicao, StatusReposicao } from '@/app/models/escola/reposicao';
import { FaCalendarAlt, FaSearch, FaSpinner, FaTimesCircle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { FiMoreVertical, FiUserPlus } from 'react-icons/fi';
import { useAulaService } from '@/app/services/escola/aula/aula.service';
import { parseApiDate } from '@/util';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

export const VisualizarReposicoes: React.FC = () => {
    // ========== SERVICES E HOOKS ==========
    const service = useAulaService();
    const {
        notifications,
        showSuccess,
        showError,
        removeNotification
    } = useNotifications();
    const router = useRouter();

    // ========== ESTADOS DE DADOS ==========
    const [reposicoes, setReposicoes] = useState<Reposicao[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // ========== ESTADOS DE FILTROS ==========
    const [ano, setAno] = useState<number>(new Date().getFullYear());
    const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
    const [buscaAluno, setBuscaAluno] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'pendentes' | 'canceladas' | 'realizadas'>('pendentes');

    // ========== ESTADOS DE UI ==========
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

    // ========== EFEITOS ==========
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== "undefined") {
                setIsMobile(window.innerWidth < 768);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        fetchReposicoes();
    }, [ano, mes]);

    // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
    const fetchReposicoes = async () => {
        try {
            setLoading(true);
            const response = await service.getAllReposições();
            setReposicoes(response);
            console.log(response)
        } catch (err) {
            showError('Erro ao buscar reposições');
        } finally {
            setLoading(false);
        }
    };

    // ========== FUNÇÕES DE MANIPULAÇÃO DE REPOSIÇÕES ==========
    const cancelarReposição = async (id: number, statusReposicao: StatusReposicao) => {
        if (confirm('Tem certeza que deseja realizar esta operação?')) {
            try {

                await service.cancelarReposicao(id, statusReposicao);
                setReposicoes(prevReposicoes =>
                    prevReposicoes.map(reposicao =>
                        reposicao.id === id ? { ...reposicao, status: statusReposicao } : reposicao
                    )
                );
                showSuccess("Reposição Cancelada!")
            } catch (error) {
                showError('Erro ao cancelar reposição');
            }
        }
    };

    // ========== FUNÇÕES DE CONTROLE DE UI ==========
    const toggleDropdown = (reposicaoId: number) => {
        setDropdownAberto(prev => prev === reposicaoId ? null : reposicaoId);
    };

    // ========== FUNÇÕES DE NAVEGAÇÃO ==========
    const acessarSalaReposicao = () => {
        router.push('/instituto-musical/escola/reposicao')
    }

    // ========== CÁLCULOS E DERIVAÇÕES ==========

    const reposicoesFiltradas = reposicoes.filter(({ novaDataHora, alunoNome, status }) => {
        const dataReposicao = parseApiDate(novaDataHora);
        if (!dataReposicao || isNaN(dataReposicao.getTime())) return false;

        const mesmoMesAno = dataReposicao.getFullYear() === ano && (dataReposicao.getMonth() + 1) === mes;
        const alunoMatch = alunoNome.toLowerCase().includes(buscaAluno.toLowerCase());

        // Se não for mesmo mês/ano ou não match no aluno, já retorna false
        if (!mesmoMesAno || !alunoMatch) return false;

        switch (activeTab) {
            case 'pendentes':
                return status === 'AGENDADA';
            case 'canceladas':
                return status === 'CANCELADA';
            case 'realizadas':
                return status === 'REALIZADA';
            default: // 'todas' ou tab geral
                return true; // Já filtramos por mês/ano e aluno
        }
    });
    console.log(reposicoes)

    const anosDisponiveis = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

    const mesesDisponiveis = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ];

    // ========== RENDERIZAÇÃO PRINCIPAL ==========
    return (
        <Layout titulo="Visualizar Reposições">
            <section className="section">
                <NotificationContainer
                    notifications={notifications}
                    onRemove={removeNotification}
                />

                <div className="level-right">
                    <CustomButton
                        icon={null}
                        text="Marcar Reposição"
                        className="my-custom-class"
                        onClick={acessarSalaReposicao}
                        style={{ padding: '4px 20px', marginLeft: '40px' }}
                    />
                </div>

                <div className="container">
                    <div className="box" style={{ boxShadow: 'none' }}>
                        {/* Filtros */}
                        <div className="box mb-5">
                            <div className={`columns ${isMobile ? 'is-multiline' : ''}`}>
                                <div className={`column ${isMobile ? 'is-6' : 'is-3'}`}>
                                    <div className="field">
                                        <label className="label">Ano</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
                                                    {anosDisponiveis.map((anoOption) => (
                                                        <option key={anoOption} value={anoOption}>
                                                            {anoOption}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`column ${isMobile ? 'is-6' : 'is-3'}`}>
                                    <div className="field">
                                        <label className="label">Mês</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
                                                    {mesesDisponiveis.map((mesOption) => (
                                                        <option key={mesOption.value} value={mesOption.value}>
                                                            {isMobile ? mesOption.value : mesOption.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`column ${isMobile ? 'is-12' : 'is-6'}`}>
                                    <Input
                                        label='Buscar por Aluno'
                                        type="text"
                                        value={buscaAluno}
                                        aditionalClassesControl='has-icons-left'
                                        onChange={(e) => setBuscaAluno(e.target.value)}
                                        iconLeft={<FaSearch />}
                                        placeholder={isMobile ? 'Nome do aluno' : 'Digite o nome do aluno'}
                                    />

                                </div>
                            </div>
                        </div>

                        {/* Tabs de Navegação */}
                        <div className="tabs is-boxed is-fullwidth">
                            <ul>
                                <li className={activeTab === 'pendentes' ? 'is-active' : ''}>
                                    <a onClick={() => setActiveTab('pendentes')}>
                                        <span className="icon is-small is-warning-custom"><FaClock /></span>
                                        {!isMobile ? <span>Pendentes</span> : <span></span>}
                                    </a>
                                </li>
                                <li className={activeTab === 'canceladas' ? 'is-active' : ''}>
                                    <a onClick={() => setActiveTab('canceladas')}>
                                        <span className="icon is-small is-danger-custom"><FaCalendarAlt /></span>
                                        {!isMobile ? <span>Canceladas</span> : <span></span>}
                                    </a>
                                </li>

                            </ul>
                        </div>

                        {/* Conteúdo das Tabs */}
                        {loading ? (
                            <div className="has-text-centered py-6">
                                <span className="icon is-large">
                                    <FaSpinner className="fa-spin" />
                                </span>
                                <p>Carregando reposições...</p>
                            </div>
                        ) : reposicoesFiltradas.length === 0 ? (
                            <div className="notification is-light has-text-centered">
                                Nenhuma reposição encontrada para os critérios selecionados.
                            </div>
                        ) : (
                            <>
                                {/* Tabela para Desktop */}
                                <div className="table-container is-hidden-mobile" style={{ overflowX: 'auto' }}>
                                    <table className={`table ${isMobile ? 'is-narrow' : 'is-fullwidth'} is-striped`}>
                                        <thead>
                                            <tr>
                                                <th>Aluno</th>
                                                <th>Data/Hora</th>
                                                <th>Motivo</th>
                                                <th>Status</th>
                                                <th>Aula Original</th>
                                                {activeTab === 'pendentes' && <th>Ações</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reposicoesFiltradas.map((reposicao) => (
                                                <tr key={reposicao.id + reposicao.alunoNome}>
                                                    <td>{reposicao.alunoNome}</td>
                                                    <td>{reposicao.novaDataHora}</td>
                                                    <td>{reposicao.motivo}</td>
                                                    <td>
                                                        <span
                                                            className={`tag ${reposicao.status === 'AGENDADA'
                                                                ? 'is-warning'
                                                                : reposicao.status === StatusReposicao.REALIZADA
                                                                    ? 'is-success'
                                                                    : 'is-danger'}`}
                                                        >
                                                            {reposicao.status}
                                                        </span>
                                                    </td>
                                                    <td>{reposicao.dataHoraAulaOriginal}</td>
                                                    <td>
                                                        <div className="buttons are-small">
                                                            {reposicao.status === 'AGENDADA' && (
                                                                <CustomButton
                                                                    text={<span className="is-hidden-mobile">Cancelar</span>}
                                                                    icon={<FaTimesCircle />}
                                                                    onClick={() => cancelarReposição(reposicao.id, StatusReposicao.CANCELADA)}
                                                                    style={{ borderRadius: '6px' }}
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Cards para Mobile */}
                                <div className="columns is-multiline is-hidden-tablet">
                                    {reposicoesFiltradas.map((reposicao) => (
                                        <div className="column is-12" key={reposicao.id}>
                                            <div className="card" style={{ position: 'relative' }}>
                                                <div className="dropdown" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                                    {activeTab === 'pendentes' && (
                                                        <div className="dropdown-trigger">
                                                            <button
                                                                className="button is-small"
                                                                aria-haspopup="true"
                                                                aria-controls={`dropdown-menu-${reposicao.id}`}
                                                                onClick={() => toggleDropdown(reposicao.id)}
                                                            >
                                                                <span className="icon"><FiMoreVertical /></span>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {dropdownAberto === reposicao.id && (
                                                        <div className="dropdown-menu" role="menu" style={{ display: 'block', top: '10px', right: '100px', left: '-170px' }}>
                                                            <div className="dropdown-content">
                                                                <a
                                                                    className="dropdown-item"
                                                                    onClick={() => console.log("Cancelando reposição")}
                                                                >
                                                                    <span className="icon"><FaTimesCircle /></span> Cancelar
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="card-content">
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <span className="icon"><FiUserPlus /></span>
                                                        </div>
                                                        <div className="media-content">
                                                            <p className="title is-5">{reposicao.alunoNome}</p>
                                                            <p className="subtitle is-6">{reposicao.novaDataHora}</p>
                                                        </div>
                                                    </div>

                                                    <div className="content">
                                                        <p><strong>Motivo:</strong> {reposicao.motivo}</p>
                                                        <p><strong>Aula Original:</strong> {reposicao.dataHoraAulaOriginal}</p>
                                                        <p><strong>Status:</strong>
                                                            <span
                                                                className={`tag ${reposicao.status === 'AGENDADA'
                                                                    ? 'is-warning'
                                                                    : reposicao.status === StatusReposicao.REALIZADA
                                                                        ? 'is-success'
                                                                        : 'is-danger'}`}
                                                            >
                                                                {isMobile
                                                                    ? (reposicao.status === 'AGENDADA' ? 'Agendada' :
                                                                        reposicao.status === StatusReposicao.REALIZADA ? 'Realizada' : 'Cancelada')
                                                                    : reposicao.status
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
};