import { CustomButton, Layout, useNotifications } from '@/components';
import { useState, useEffect } from 'react';
import { Mensalidades, Config } from '@/app/models/escola/financeiro/mensalidade'
import { useMensalidadeService } from '@/app/services/escola/finanças/mensalidade.service';
import { FaEdit } from 'react-icons/fa';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import ModalGenerico, { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';

interface ConfiguraçãoGlobalProps { }

export const ConfiguraçãoGlobal: React.FC<ConfiguraçãoGlobalProps> = () => {
    // ========== SERVICES E HOOKS ==========
    const {
        notifications,
        showSuccess,
        showError,
        removeNotification
    } = useNotifications();
    const mensalidadeService = useMensalidadeService();

    // ========== ESTADOS DE DADOS ==========
    const [configuracao, setConfiguracao] = useState<Config | null>(null);

    // ========== ESTADOS DE UI ==========
    const [loading, setLoading] = useState(true);
    const [showConfigModal, setShowConfigModal] = useState(false);

    // ========== EFEITOS ==========
    useEffect(() => {
        fetchData();
    }, []);

    // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
    const fetchData = async () => {
        try {
            setLoading(true);

            // Mock data para configuração
            const responseConfig: Config = await mensalidadeService.getConfig()

            setConfiguracao(responseConfig);

        } catch (error) {
            showError("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };


    // ========== CONFIGURAÇÕES ==========
    const camposConfig: CampoModal[] = [
        {
            tipo: 'number',
            nome: 'valorMensalidade',
            label: 'Valor Base',
            placeholder: "R$ 0,00",
            required: true
        },

        {
            tipo: 'number',
            nome: 'diaVencimento',
            label: 'Vencimento',
            required: true
        }

    ];

    // ========== FUNÇÕES DE CRUD ==========
    const handleAtualizarConfiguracao = async (dados: DadosModal) => {
     
        if (dados)
            await mensalidadeService.postConfig(dados as Config)
        showSuccess("Configuração atualizada com sucesso!");
        setShowConfigModal(false);
        fetchData()
    };

    // ========== RENDERIZAÇÃO PRINCIPAL ==========
    return (
        <div className="box mb-5 mt-7" style={{ boxShadow: 'none' }}>
            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
            />

            {/* Cabeçalho */}
            <div className="level is-mobile">
                <div className="level-left">
                    <h2 className="title is-5">Configuração Global</h2>
                </div>
                <div className="level-right">
                    <CustomButton
                        className="is-small-mobile"
                        onClick={() => setShowConfigModal(true)}
                        text={'Editar'}
                        icon={<FaEdit />}
                    />
                </div>
            </div>
            {configuracao && (
                <div className="physical-card">
                    <div className="card-stripe"></div>

                    <div className="card-content">
                        <div className="card-chip"></div>

                        <div className="card-info">
                            <div className="card-field">
                                <label>VALOR BASE</label>
                                <div className="card-value highlight">R$ {configuracao.valorMensalidade.toFixed(2)}</div>
                            </div>

                            <div className="card-row">
                                <div className="card-field">
                                    <label>VENCIMENTO</label>
                                    <div className="card-value">DIA {configuracao.diaVencimento}</div>
                                </div>

                                <div className="card-field">
                                    <label>ATUALIZADO</label>
                                    <div className="card-value small">
                                        {configuracao.ultimaAtualizacao || 'NUNCA'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-logo">CONFIG</div>
                    </div>
                </div>
            )}
            {/* Modal de Configuração */}


            <ModalGenerico
                isOpen={showConfigModal}
                onClose={() => setShowConfigModal(false)}
                dados={configuracao}
                onSave={handleAtualizarConfiguracao}
                titulo={'Configuração'}
                campos={camposConfig}
                textoBotaoSalvar="Salvar"
            />

        </div>
    )
}