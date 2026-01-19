import {
    FaHome, FaMusic, FaChalkboardTeacher, FaUser,
    FaUserPlus, FaExclamationTriangle, FaClock, FaFileInvoiceDollar,
    FaCalendarAlt,
    FaShoppingCart,
    FaProductHunt,
    FaBox,
    FaUserTie
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAlunoService } from '@/app/services';
import { HomePage } from '@/components/common/homeBase';
//import { CardsAvisos } from './cardsAvisos';
import { AlertasPendencias } from '@/components/common/homeBase/cardAlertas';
import { useNotifications } from '@/components/common/notificacao/hookNotify/usoSimples';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';

export const HomeLoja = () => {
    const [aulasAgendadas, setAulasAgendadas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(false)
    const service = useAlunoService();
    const {
        notifications,
        showSuccess,
        showError,
        removeNotification
    } = useNotifications();


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
                title="Loja"
                isMobile={isMobileView}
                subtitle="Gerenciamento para sua Loja"
                icon={<FaHome size={56} />}
                useLayout={true}
                main=''
                operacoesPrincipais={[
                    { title: 'Vendas', icon: <FaShoppingCart size={28} />, route: '/instituto-musical/loja/venda/dashboard', description: 'Gerencie vendas a serem feitas e realizadas' },
                    { title: 'Produtos', icon: <FaBox size={28} />, route: '/instituto-musical/loja/produto/controle-estoque', description: 'Gerencie o seu Estoque ' },
                    // { title: 'Clientes', icon: <FaUserTie size={28} />, route: '/loja/cliente/gerenciamento', description: 'Gerencie o os seus clientes' },

                    { title: 'Financeiro', icon: <FaFileInvoiceDollar size={28} />, route: '/instituto-musical/loja/receita', description: 'Cuide da saúde financeira da sua escola' },
                ]}
            >
                <div className="columns is-multiline">


                    <div className="column is-6-mobile is-4-tablet is-5-desktop">
                        {/* <CardsAvisos
                            title="Próximas Aulas"
                            icon={<FaCalendarAlt size={24} />}
                            proximasAulas={aulasAgendadas || []}
                            loading={loading}
                        /> */}
                    </div>
                </div>
            </HomePage>
        </div>
    );
};

export default HomeLoja;
