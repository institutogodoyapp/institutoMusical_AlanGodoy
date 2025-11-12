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

export const HomeLoja = () => {
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



 

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <HomePage
                title="Loja"
                subtitle="Gerenciamento simplificado para sua escola musical"
                icon={<FaHome size={56} />}
                useLayout={true}
                main=''
                operacoesPrincipais={[
                    { title: 'Vendas', icon: <FaShoppingCart size={28} />, route: '/instituto-musical/loja/venda/dashboard', description: 'Gerencie vendas a serem feitas e realizadas' },
                    { title: 'Produtos', icon: <FaBox  size={28} />, route: '/instituto-musical/loja/produto/controle-estoque', description: 'Gerencie o seu Estoque ' },
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
