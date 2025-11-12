import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSave, FiArrowLeft, FiPackage, FiDollarSign, FiTrendingUp, FiX } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { Produto, ProdutoForm } from '@/app/models/loja/produto';
import { useProdutoService } from '@/app/services/loja/produto/produto.service';
import { Fornecedor } from '@/app/models/loja/venda';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

export const CadastroProduto: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const { id } = router.query;
  const service = useProdutoService();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [produto, setProduto] = useState<ProdutoForm>({
    id: 0,
    nome: '',
    descricao: '',
    sku: '',
    precoVenda: 0,
    custo: 0,
    quantidadeEstoque: 0,
    estoqueMinimo: 5,
    fornecedorId: 0
  });
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);

  // ========== EFEITOS ==========
  useEffect(() => {
    fetchDados();
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarProdutoParaEdicao();
    }
  }, [id]);

  // ========== FUNÇÕES DE API ==========
  const fetchDados = async () => {
    try {
      setCarregando(true);
      const response = await service.getFornecedores();
      setFornecedores(Array.isArray(response) ? response : [response]);
    } catch (err) {
      showError('Erro ao buscar fornecedores');
    } finally {
      setCarregando(false);
    }
  };

  const carregarProdutoParaEdicao = () => {
    setEditando(true);
    setCarregando(true);
    const idParse = Number(id);

    service.buscarPorId(idParse)
      .then(produtoEncontrado => {
        setProduto({
          ...produto,
          id: produtoEncontrado.id,
          nome: produtoEncontrado.nome,
          sku: produtoEncontrado.sku,
          quantidadeEstoque: produtoEncontrado.quantidadeEstoque,
          precoVenda: produtoEncontrado.precoVenda,
          estoqueMinimo: produtoEncontrado.estoqueMinimo,
          descricao: produtoEncontrado.descricao,
          fornecedorId: produtoEncontrado.fornecedor ? produtoEncontrado.fornecedor.id : 0,
          dataCadastro: produtoEncontrado.dataCadastro,
          custo: produtoEncontrado.custo,
        });
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro ao carregar produto:', err);
        showError('Não foi possível carregar os dados do produto.');
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const produtoCompleto = {
        ...produto,
        fornecedorId: Number(produto.fornecedorId)
      };

      if (editando) {
        await service.atualizarProduto(produto.id, produto).then(produtoResposta => {
          showSuccess("Produto atualizado com sucesso");
        });

      } else {
        await service.cadastrarProduto(produtoCompleto).then(produtoResposta => {
          showSuccess("Produto salvo com sucesso");
        });

      }
    } catch (error) {
      showError(`${editando ? 'Erro ao atualizar produto' : 'Erro ao salvar produto'}`);
    } finally {
      setCarregando(false);
      setProduto({
        id: 0,
        nome: '',
        descricao: '',
        sku: '',
        precoVenda: 0,
        custo: 0,
        quantidadeEstoque: 0,
        estoqueMinimo: 5,
        fornecedorId: 0
      });
    }
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const calcularMargem = () => {
    if (produto.precoVenda > 0 && produto.custo > 0) {
      return ((produto.precoVenda - produto.custo) / produto.precoVenda * 100).toFixed(1);
    }
    return '0.0';
  };

  const calcularValorEstoque = () => {

      return produto.precoVenda * produto.quantidadeEstoque;

    
  };

const formatarMoeda = (valor: number): string => {
  // Verifica se é NaN ou não é um número válido
  if (isNaN(valor) || !isFinite(valor)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

  // ========== FUNÇÕES DE CONTROLE ==========
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const voltar = () => router.back();

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando && editando) {
    return (
      <Layout titulo="Carregando produto...">
        <div className="container mt-6">
          <div className="notification is-info is-light">Carregando dados do produto...</div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo={editando ? 'Editar Produto' : 'Cadastrar Novo Produto'}>
      <div className="container mt-6">
        <div className="box" style={{ boxShadow: 'none' }}>
          <div className="level is-mobile">
            <div className="level-right">
              <span className="tag has-primary-custom is-light">
                {editando ? 'Editando' : 'Novo Produto'}
              </span>
            </div>
          </div>

          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          <form onSubmit={handleSubmit}>
            <div className="columns is-multiline">
              {/* Informações Básicas */}
              <div className="column is-8">
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">
                    <span className="icon has-primary-custom">
                      <FiPackage />
                    </span>
                    Informações do Produto
                  </h3>
                  <Input
                    label='Nome do Produto *'
                    type="text"
                    placeholder="Ex: Violão Acústico Giannini"
                    value={produto.nome}
                    onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
                    required />



                  <div className="field">
                    <label className="label">Descrição</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="Descrição detalhada do produto..."
                        rows={3}
                        value={produto.descricao}
                        onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="columns">
                    <div className="column is-6">
                      <Input
                        label='SKU *'
                        icon={null}
                        type="text"
                        placeholder="Ex: VIO-001"
                        value={produto.sku}
                        onChange={(e) => setProduto({ ...produto, sku: e.target.value })}
                        required />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Fornecedor</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          name="fornecedorId"
                          value={produto.fornecedorId}
                          onChange={handleChange}
                          required
                        >
                          <option value="0">Selecione um fornecedor</option>
                          {fornecedores.map(fornecedor => (
                            <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preços e Estoque */}
              <div className="column is-4">
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">
                    <span className="icon has-primary-custom">
                      <FiDollarSign />
                    </span>
                    Preço e Estoque
                  </h3>

                  <Input
                    label='Preço de Venda *'
                    type="number"
                    // step="0.01"
                    placeholder="0,00"
                    value={produto.precoVenda}
                    onChange={(e) => setProduto({ ...produto, precoVenda: parseFloat(e.target.value) })}
                    required />

                  <Input
                    label='Custo *'
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={produto.custo}
                    onChange={(e) => setProduto({ ...produto, custo: parseFloat(e.target.value) })}
                    required />

                  <Input
                    label='Margem de Lucro'
                    type="text"
                    value={`${calcularMargem()}%`}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                    required />



                  <div className="columns">
                    <div className="column is-6">
                      <Input
                        label='Estoque Atual'
                        type="number"
                        placeholder="0"
                        value={produto.quantidadeEstoque}
                        onChange={(e) => setProduto({ ...produto, quantidadeEstoque: parseInt(e.target.value) })}
                        required />

                    </div>
                    <div className="column is-6">
                      <Input
                        label='Estoque Mínimo'
                        type="number"
                        placeholder="5"
                        value={produto.estoqueMinimo}
                        onChange={(e) => setProduto({ ...produto, estoqueMinimo: parseInt(e.target.value) })}
                        required />
                    </div>
                  </div>
                  <Input
                    label='Valor Total em Estoque'
                    type="text"
                    value={formatarMoeda(calcularValorEstoque())}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                    required />
                </div>

                {/* Card de Resumo */}
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">
                    <span className="icon has-primary-custom">
                      <FiTrendingUp />
                    </span>
                    Resumo
                  </h3>
                  <div className="content">
                    <p><strong>Margem:</strong> {calcularMargem()}%</p>
                    <p><strong>Valor Estoque:</strong> {formatarMoeda(calcularValorEstoque()) || 0}</p>
                    <p><strong>Status Estoque:</strong>
                      <span className={`tag ml-2 ${produto.quantidadeEstoque <= produto.estoqueMinimo ? 'is-warning' : 'is-success'}`}>
                        {produto.quantidadeEstoque <= produto.estoqueMinimo ? 'Atenção' : 'Normal'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <CustomButton
                  text="Cancelar"
                  onClick={voltar}
                  icon={<FiX />}
                  className="is-light"
                  style={{ borderRadius: '6px' }}
                />
              </div>
              <div className="control">
                <CustomButton
                  text={editando ? 'Atualizar Produto' : 'Cadastrar Produto'}
                  icon={<FiSave />}
                  type="submit"
                  className="is-primary"
                  style={{ borderRadius: '6px' }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CadastroProduto;