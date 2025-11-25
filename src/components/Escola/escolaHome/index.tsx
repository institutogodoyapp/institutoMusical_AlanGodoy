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
import { useNotifications } from '@/components/common/notificacao/hookNotify/usoSimples';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';

export const HomeEscolaMusica = () => {
    const {
        notifications,
        showSuccess,
        showError,
        removeNotification
    } = useNotifications();
    const [aulasAgendadas, setAulasAgendadas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(false)
    const service = useAlunoService();

      useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseAulas = await service.getAulasSemana();
                setAulasAgendadas(Array.isArray(responseAulas) ? responseAulas : [responseAulas]);

            } catch (error) {
                 showError(`Erro ao buscar os dados`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
            />
            <HomePage
                title="Escola de Música"
                subtitle="Gerenciamento simplificado para sua escola musical"
                icon={<FaHome size={56} />}
                isMobile= {isMobileView}
                main={""}
                operacoesPrincipais={[
                    { title: 'Alunos', icon: <FaUser size={28} />, route: '/instituto-musical/escola/aluno/gerenciamento-aluno', description: 'Gerencie seus alunos' },
                    { title: 'Instrumentos', icon: <FaMusic size={28} />, route: '/instituto-musical/escola/instrumento', description: 'Gerencie os cursos e conteúdos' },
                    { title: 'Professores', icon: <FaChalkboardTeacher size={28} />, route: '/instituto-musical/escola/professor', description: 'Operações com professores' },
                    { title: 'Marcar Reposição', icon: <FaClock size={28} />, route: '/instituto-musical/escola/reposicao', description: 'Reposições de aula' },
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
