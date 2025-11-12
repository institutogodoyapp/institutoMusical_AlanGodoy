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

export const HomeServicos = () => {
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
                title="Serviços Musicais"
                subtitle="Gerenciamento de Trabalho e prestação de serviços"
                icon={<FaHome size={56} />}
                useLayout={true}
                main=''
                operacoesPrincipais={[
                    { title: 'Serviços', icon: <FaShoppingCart size={28} />, route: '/instituto-musical/servicos-musicais/dashboard', description: 'Gerencie e crie projetos' },
                    { title: 'Pedido', icon: <FaBox  size={28} />, route: '/instituto-musical/servicos-musicais/pedido/gerenciamento', description: 'Gerencie e faça pedidos' },
                    { title: 'Clientes', icon: <FaUserTie size={28} />, route: '/instituto-musical/servicos-musicais/cliente/gerenciamento', description: 'Gerencie o os seus clientes' },
            // { title: 'Projetos', icon: <FaFileInvoiceDollar size={28} />, route: '/servicos-musicais/dashboard', description: ' projeto' },
                    { title: 'Financeiro', icon: <FaFileInvoiceDollar size={28} />, route: '/instituto-musical/servicos-musicais/receita', description: 'Cuide da saúde financeira do seu negocio' },
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

export default HomeServicos;
