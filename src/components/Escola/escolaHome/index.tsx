import {
    FaHome, FaMusic, FaChalkboardTeacher, FaUser,
    FaUserPlus, FaExclamationTriangle, FaClock, FaFileInvoiceDollar,
    FaCalendarAlt
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAlunoService } from '@/app/services';
import { HomePage } from '@/components/common/homeBase';
import { CardsAvisos } from './cardsAvisos';
import { AlertasPendencias } from '@/components/common/homeBase/cardAlertas';

export const HomeEscolaMusica = () => {
    const [aulasAgendadas, setAulasAgendadas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const service = useAlunoService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseAulas = await service.getAulasSemana();
                setAulasAgendadas(Array.isArray(responseAulas) ? responseAulas : [responseAulas]);
                console.log(responseAulas);
            } catch (error) {
                console.error('Erro ao buscar os dados da API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    const getAlertIcon = (tipo: string) => {
        switch (tipo) {
            case 'manutencao':
                return <FaMusic className="has-text-info" />;
            case 'reposicao':
                return <FaClock className="has-text-warning" />;
            case 'pagamento':
                return <FaFileInvoiceDollar className="has-text-danger" />;
            default:
                return <FaExclamationTriangle className="has-text-danger" />;
        }
    };

    const getPriorityClass = (prioridade: string) => {
        switch (prioridade) {
            case 'alta':
                return 'has-background-danger-light';
            case 'media':
                return 'has-background-warning-light';
            case 'baixa':
                return 'has-background-info-light';
            default:
                return '';
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <HomePage
                title="Escola de Música"
                subtitle="Gerenciamento simplificado para sua escola musical"
                icon={<FaHome size={56} />}
                main={""}
                operacoesPrincipais={[
                    { title: 'Alunos', icon: <FaUser size={28} />, route: '/instituto-musical/escola/aluno/gerenciamento-aluno', description: 'Gerencie seus alunos' },
                    { title: 'Cursos', icon: <FaMusic size={28} />, route: '/instituto-musical/escola/instrumento', description: 'Gerencie os cursos e conteúdos' },
                    { title: 'Professores', icon: <FaChalkboardTeacher size={28} />, route: '/instituto-musical/escola/professor', description: 'Operações com professores' },
                    { title: 'Reposições', icon: <FaClock size={28} />, route: '/instituto-musical/escola/reposicao/gerenciamento', description: 'Gerencie reposições de aula' },
                    { title: 'Financeiro', icon: <FaFileInvoiceDollar size={28} />, route: '/instituto-musical/escola/receita', description: 'Cuide da saúde financeira da sua escola' },
                ]}
                useLayout={true}
            >
                <div className="columns is-multiline">
                   

                    <div className="column is-6-mobile is-4-tablet is-5-desktop">
                        <CardsAvisos
                            title="Próximas Aulas"
                            icon={<FaCalendarAlt size={24} />}
                            proximasAulas={aulasAgendadas || []}
                            loading={loading}
                        />
                    </div>
                </div>
            </HomePage>
        </div>
    );
};

export default HomeEscolaMusica;
