import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiUser, FiPackage, FiDollarSign, FiTrash, FiX } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { Venda } from '@/app/models/loja/venda';
import { useProdutoService } from '@/app/services/loja/produto/produto.service';
import { Produto } from '@/app/models/loja/produto';
import { itemVenda } from '@/app/models/loja/itemVenda';
import { useVendaService } from '@/app/services/loja/venda/venda.service';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

export const NovaVenda: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const { id } = router.query;
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();
  const servicoProduto = useProdutoService();
  const servicoVenda = useVendaService();

  // ========== ESTADOS DE DADOS ==========
  const [venda, setVenda] = useState<Venda>({
    id: 0,
    clienteNome: '',
    itens: [],
    valorTotal: 0,
    produto: '',
    data: '',
  });
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  // ========== ESTADOS DE UI ==========
  const [quantidade, setQuantidade] = useState<number>(1);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);

  // ========== EFEITOS ==========
  useEffect(() => {
    carregarDados();
  }, [id]);

  // ========== FUNÇÕES DE API ==========
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const produtos = await servicoProduto.getAllProductsWithEstoque();
      setProdutos(produtos);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showError('Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (venda.itens.length === 0) {
      showError('Selecione um cliente e adicione pelo menos um item!');
      return;
    }

    setCarregando(true);
    try {
      console.log(venda);
      await servicoVenda.realizarVenda(venda)
      showSuccess(editando ? 'Venda atualizada com sucesso!' : 'Venda realizada com sucesso!');
    } catch (error) {
      showError('Erro ao salvar venda');
    } finally {
      setCarregando(false);
      setVenda({
        id: 0,
        clienteNome: '',
        itens: [],
        valorTotal: 0,
        produto: '',
        data: '',
      });
    }
  };

  // ========== FUNÇÕES DE MANIPULAÇÃO DE ITENS ==========
  const adicionarItem = () => {
    if (!produtoSelecionado || quantidade <= 0) return;

    const novoItem: itemVenda = {
      id: produtoSelecionado.id,
      produto: produtoSelecionado,
      quantidade,
      precoUnitario: produtoSelecionado.precoVenda,
      subtotal: produtoSelecionado.precoVenda * quantidade,
      produtoNome: produtoSelecionado.nome,
      produtoId: produtoSelecionado.id
    };

    const novosItens = [...venda.itens, novoItem];
    const novoValorTotal = novosItens.reduce((total, item) => total + item.subtotal, 0);

    setVenda({
      ...venda,
      itens: novosItens,
      valorTotal: novoValorTotal
    });

    setProdutoSelecionado(null);
    setQuantidade(1);
  };

  const removerItem = (itemId: number) => {
    const novosItens = venda.itens.filter(item => item.id !== itemId);
    const novoValorTotal = novosItens.reduce((total, item) => total + item.subtotal, 0);

    setVenda({
      ...venda,
      itens: novosItens,
      valorTotal: novoValorTotal
    });
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const voltar = () => router.back();

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando && editando) {
    return (
      <Layout titulo="Carregando venda...">
        <div className="container mt-6">
          <div className="notification is-info is-light">Carregando dados da venda...</div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo={editando ? 'Editar Venda' : 'Nova Venda'}>
      <div className="container mt-6">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />
        <div className="box" style={{ boxShadow: 'none' }}>
          <div className="level is-mobile">
            <div className="level-right">
              <span className="tag has-primary-custom is-light">
                {editando ? 'Editando Venda' : 'Nova Venda'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="columns">
              {/* Cliente e Itens */}
              <div className="column is-8">
                {/* Seleção de Cliente */}
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">
                    <span className="icon has-primary-custom">
                      <FiUser />
                    </span>
                    Cliente
                  </h3>
                  <Input
                    label=''
                    type="text"
                    value={venda.clienteNome}
                    placeholder='Digite Aqui o nome'
                    onChange={(e) => setVenda(prev => ({
                      ...prev,
                      clienteNome: e.target.value
                    }))}
                    required />

                </div>

                {/* Adicionar Itens */}
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">
                    <span className="icon has-primary-custom">
                      <FiPackage />
                    </span>
                    Adicionar Itens
                  </h3>

                  <div className="columns">
                    <div className="column is-6">
                      <div className="field">
                        <label className="label">Produto</label>
                        <div className="control">
                          <div className="select is-fullwidth">
                            <select
                              name='produtoId'
                              value={produtoSelecionado?.id || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const produtoId = parseInt(value);
                                const produto = produtos.find(p => p.id === produtoId);
                                setProdutoSelecionado(produto || null);
                              }}
                            >
                              <option value="">Selecione um produto</option>
                              {produtos.map(produto => (
                                <option key={produto.id} value={produto.id}>
                                  {produto.nome} - {formatarMoeda(produto.precoVenda)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="column is-3">

                      <Input
                        label='Quantidade'
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                        required />

                    </div>
                    <div className="column is-3">
                      <label className="label">&nbsp;</label>
                      <CustomButton
                        text="Adicionar"
                        icon={<FiPlus />}
                        onClick={adicionarItem}
                        className="is-primary"
                        style={{ borderRadius: '6px', width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Itens da Venda */}
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">Itens da Venda</h3>

                  {venda.itens.length === 0 ? (
                    <div className="notification is-light">Nenhum item adicionado</div>
                  ) : (
                    <div className="table-container">
                      <table className="table is-fullwidth is-striped">
                        <thead>
                          <tr>
                            <th>Produto</th>
                            <th>Qtd</th>
                            <th>Valor Unit.</th>
                            <th>Total</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {venda.itens.map(item => (
                            <tr key={item.id}>
                              <td>{item.produtoNome}</td>
                              <td>{item.quantidade}</td>
                              <td>{formatarMoeda(item.precoUnitario)}</td>
                              <td>{formatarMoeda(item.subtotal)}</td>
                              <td>
                                <CustomButton
                                  text="Adicionar"
                                  icon={<FiTrash2 />}
                                  onClick={() => removerItem(item.id)}
                                  className="button is-danger is-small is-light"
                                  style={{ borderRadius: '6px', width: '100%' }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumo e Pagamento */}
              <div className="column is-4">
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">
                    <span className="icon has-primary-custom">
                      <FiDollarSign />
                    </span>
                    Resumo da Venda
                  </h3>

                  <div className="content">
                    <div className="level">
                      <div className="level-left">
                        <span className="has-text-weight-bold">Total:</span>
                      </div>
                      <div className="level-right">
                        <span className="title is-4 has-primary-custom">{formatarMoeda(venda.valorTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Finalizar */}
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <div className="field">
                    <CustomButton
                      text={editando ? 'Atualizar Venda' : 'Finalizar Venda'}
                      icon={<FiSave />}
                      type="submit"
                      className="is-primary is-fullwidth"
                      style={{ borderRadius: '6px' }}
                    />
                  </div>
                  <div className="field">
                    <CustomButton
                      text="Cancelar"
                      icon={<FiX />}
                      onClick={voltar}
                      className="is-light is-fullwidth"
                      style={{ borderRadius: '6px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NovaVenda;