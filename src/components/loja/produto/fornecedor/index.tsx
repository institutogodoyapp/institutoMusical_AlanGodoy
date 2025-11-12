import { Layout, useNotifications } from '@/components';
import { useState, useEffect, useRef } from 'react';
import { CustomButton } from '@/components';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { Fornecedor, FornecedorForm } from '@/app/models/loja/venda';
import { useProdutoService } from '@/app/services/loja/produto/produto.service';
import CardList from '@/components/common/tableMobile';
import ModalGenerico, { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';

export const GerenciamentoFornecedores: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const service = useProdutoService();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [fornecedor, setFornecedor] = useState<Fornecedor[]>([]);
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [formData, setFormData] = useState<FornecedorForm>({ nome: '' });

  // ========== ESTADOS DE UI ==========
  const [loading, setLoading] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ========== EFEITOS ==========
  useEffect(() => {
    fetchFornecedores();
  }, []);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(null);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  // ========== FUNÇÕES DE API ==========
  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const response = await service.getFornecedores();
      setFornecedor(Array.isArray(response) ? response : [response]);
    } catch (err) {
      showError('Erro ao buscar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const salvarFornecedor = async (dados: DadosModal) => {
    try {
      if (fornecedorEditando?.id) {
        await service.atualizarFornecedor(fornecedorEditando.id, dados as FornecedorForm);
        showSuccess("Fornecedor atualizado com sucesso!");
      } else {
        await service.cadastrarFornecedor(dados as FornecedorForm);
        showSuccess("Fornecedor salvo com sucesso!");
      }

      await fetchFornecedores();
      fecharModal();
    } catch (err) {
      showError('Erro ao salvar Fornecedor');
    }
  };

  const excluirFornecedores = async (fornecedor: Fornecedor) => {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        if (fornecedor.produtosEmEstoque === 0) {
          await service.deletarFornecedor(fornecedor.id);
          setFornecedor(prev => prev.filter(d => d.id !== fornecedor.id));
        } else {
          showError('Não é possivel excluir fornecedor com produtos associados');
        }
      } catch (err) {
        showError('Falha ao excluir Fornecedor.');
      }
    }
  };

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const toggleDropdown = (fornecedorId: number) => {
    setDropdownAberto(prev => prev === fornecedorId ? null : fornecedorId);
  };

  const abrirModal = (fornecedor: Fornecedor | null = null) => {
    if (fornecedor?.id) {
      setFornecedorEditando(fornecedor);
      setFormData(fornecedor);
    } else {
      setFormData({ nome: '' });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setFornecedorEditando(null);
  };

  // ========== CONFIGURAÇÕES DO MODAL ==========
  const camposFornecedor: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'nome',
      label: 'Nome',
      placeholder: "Ex: Giannini..",
      required: true
    }
  ];

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="box has-text-centered">
            <span className="icon is-large">
              <FaSpinner className="fa-spin" />
            </span>
            <p>Carregando fornecedores...</p>
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo='Gerenciamento Fornecedores'>
      <section className="section">
        <div className="container">
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          <div className="box" style={{ boxShadow: 'none' }}>
            <div className="columns is-vcentered">
              <div className="column is-2">
                <div className="field">
                  <label className="label">&nbsp;</label>
                  <div className="control">
                    <CustomButton
                      text="Novo"
                      icon={<FaPlus />}
                      onClick={() => abrirModal()}
                      className="is-fullwidth"
                      style={{ borderRadius: '6px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Mobile (Cards) */}
          <div>
            {fornecedor.length > 0 ? (
              <CardList
                data={fornecedor}
                hiddenBreakpoint="none"
                titleField=""
                subtitleField=""
                fields={[
                  { label: 'Nome', key: 'nome' },
                  { label: 'Produtos', key: 'produtosEmEstoque' },
                ]}
                tags={[]}
                actions={[
                  {
                    label: '',
                    color: 'is-warning is-light',
                    onClick: (item) => abrirModal(item),
                    icon: <FiEdit />
                  },
                  {
                    label: '',
                    color: 'is-danger is-light',
                    onClick: (item) => excluirFornecedores(item),
                    icon: <FiTrash />
                  }
                ]}
              />
            ) : (
              <div className="column is-12">
                <div className="notification is-light">Nenhum Fornecedor Cadastrado</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ModalGenerico
        isOpen={modalAberto}
        onClose={fecharModal}
        dados={fornecedorEditando}
        onSave={salvarFornecedor}
        titulo={fornecedorEditando?.id ? 'Editar Fornecedor' : 'Novo Fornecedor'}
        campos={camposFornecedor}
        textoBotaoSalvar={fornecedorEditando ? 'Atualizar' : 'Salvar'}
      />
    </Layout>
  );
};