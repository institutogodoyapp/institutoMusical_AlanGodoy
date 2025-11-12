import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiTrash2, FiEdit, FiPlus, FiPackage, FiTrendingDown, FiAlertTriangle, FiCheckCircle, FiChevronRight, FiMoreVertical, FiBarChart2 } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { useProdutoService } from '@/app/services/loja/produto/produto.service';
import { MetricasEstoque, Produto, ProdutoAddEstoque } from '@/app/models/loja/produto';
import MetricaCard from '../../../common/metricaComponent';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

interface Categoria {
  id: number;
  nome: string;
  quantidadeProdutos: number;
}

export const GerenciamentoEstoque: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();
  const service = useProdutoService();

  // ========== ESTADOS DE DADOS ==========
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [metricas, setMetricas] = useState<MetricasEstoque | null>(null);
  const [produtoEditando, setprodutoEditando] = useState<Produto | null>(null);
  const [produtoAddEstoque, setprodutoAddEstoque] = useState<ProdutoAddEstoque | null>(null);

  // ========== ESTADOS DE FILTROS ==========
  const [filtroNome, setFiltroNome] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState<boolean>(true);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const [produtosExpandidos, setProdutosExpandidos] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false)

  // ========== EFEITOS ==========
  useEffect(() => {
    const mobileCheck = window.innerWidth < 768
    const checkMobile = () => {
      setIsMobile(mobileCheck)
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [])


  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        const metricasData = await service.getMetrics()
        const produtosData = await service.getAllProducts()
        setMetricas(metricasData)
        setProdutos(produtosData);
      } catch (error) {
        showError('Erro ao carregar dados');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const toggleDropdown = (produtoId: number) => {
    setDropdownAberto(prev => prev === produtoId ? null : produtoId);
  };

  const toggleExpandirProduto = (id: number) => {
    const novosExpandidos = new Set(produtosExpandidos);
    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id);
    } else {
      novosExpandidos.add(id);
    }
    setProdutosExpandidos(novosExpandidos);
  };

  const abrirModal = (produto: Produto) => {
    setprodutoAddEstoque({
      id: produto.id,
      quantidadeEstoque: produto.quantidadeEstoque || 0
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setprodutoAddEstoque(null);
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const getEstoqueStatus = (estoqueAtual: number, estoqueMinimo: number) => {
    if (estoqueAtual === 0) return 'is-danger';
    if (estoqueAtual <= estoqueMinimo) return 'is-warning';
    return 'is-success';
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularMargem = (preco: number, custo: number) => {
    return ((preco - custo) / preco * 100).toFixed(1);
  };

  // ========== FUNÇÕES DE CRUD ==========
  const addEstoque = async () => {
    try {
      if (!produtoAddEstoque?.id) {
        showError('ID do produto não encontrado');
        return;
      }

      await service.addEstoque(produtoAddEstoque?.id, produtoAddEstoque?.quantidadeEstoque)
      showSuccess("Categoria criada com sucesso!");
    } catch {
      showError('Falha ao adiconar ao estoque.');
    }
  }

  const removerEstoque = async () => {
    try {
      if (!produtoAddEstoque?.id) {
        showError('ID do produto não encontrado');
        return;
      }
      await service.removeEstoque(produtoAddEstoque?.id, produtoAddEstoque?.quantidadeEstoque)
      showSuccess("Categoria criada com sucesso!");
    } catch {
      showError('Falha ao adiconar ao estoque.');
    }
  }

  const handleExcluirProduto = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      try {
        await service.desativarProduto(id)
        setProdutos(produtos.filter(produto => produto.id !== id));
        showSuccess('Produto excluído com sucesso!');
      } catch (error) {
        showError('Erro ao excluir produto');
      }
    }
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const acessarCadastroProduto = () => router.push('/instituto-musical/loja/produto');
  const editarProduto = (produto: Produto) => router.push(`/instituto-musical/loja/produto?id=${produto.id}`);
  const acessarFornecedores = () => router.push('/instituto-musical/loja/produto/fornecedores');

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const produtosFiltrados = produtos.filter(produto => {
    const nomeMatch = produto.nome.toLowerCase().includes(filtroNome.toLowerCase());
    return nomeMatch;
  });

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando) return <div className="container mt-6"><div className="notification is-info is-light">Carregando estoque...</div></div>;

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Controle de Estoque">
      <div className="container mt-6">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />

        {/* Cards de Métricas */}
        {!isMobile &&

          <div className="columns is-multiline is-mobile">
            <MetricaCard titulo='Total Produtos' valor={metricas?.totalProdutos ? metricas.totalProdutos : 0} icone={<FiPackage />} cor={"info"} />
            <MetricaCard titulo='Estoque Baixo' valor={metricas?.produtosEstoqueBaixo ? metricas.produtosEstoqueBaixo : 0} icone={<FiAlertTriangle />} cor={"warning"} />
            <MetricaCard titulo='Fora de Estoque' valor={metricas?.produtosForaEstoque ? metricas.produtosForaEstoque : 0} icone={<FiTrendingDown />} cor={"danger"} />
            <MetricaCard titulo='Valor Total' valor={formatarMoeda(metricas?.valorTotalEstoque ? metricas.valorTotalEstoque : 0)} icone={<FiBarChart2 />} cor={"success"} />
          </div>

        }

        {/* Lista de Produtos */}
        <div className="box" style={{ boxShadow: 'none' }}>
          <div className="level is-mobile">
            <div className="level-left">
              <h2 className="title is-4">Produtos</h2>
            </div>
            <div className="level-right">
              <CustomButton
                text={isMobile ? '' : "Novo Produto"}
                icon={<FiPlus />}
                onClick={acessarCadastroProduto}
                className="is-primary"
                style={{ borderRadius: '6px' }}
              
              />

              <CustomButton
                text={isMobile ? '' : "Fornecedor"}
                icon={<FiBarChart2 />}
                onClick={acessarFornecedores}
                className="is-light"
                style={{ borderRadius: '6px', marginLeft: '10px' }}
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="columns is-multiline is-mobile">
            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                {/* Filtros podem ser adicionados aqui */}
              </div>
            </div>
          </div>

          {/* Tabela Desktop */}
          <div className="table-container is-scrollable">
            <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
              <thead>
                <tr>
                  <th></th>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.length > 0 ? produtos.map(produto => (
                  <React.Fragment key={produto.id}>
                    <tr className="is-clickable" onClick={() => toggleExpandirProduto(produto.id)}>
                      <td style={{ borderBottomWidth: '0', border: 'none', padding: '1.5rem' }}>
                        <span className="icon">
                          {produtosExpandidos.has(produto.id) ? <FiChevronRight style={{ transform: 'rotate(90deg)' }} /> : <FiChevronRight />}
                        </span>
                      </td>
                      <td>
                        <div className="media">
                          <div className="media-left">
                            <span className="icon has-text-grey">
                              <FiPackage />
                            </span>
                          </div>
                          <div className="media-content">
                            <p className="has-text-weight-semibold">{produto.nome}</p>
                            {produto.descricao && (
                              <p className="is-size-7 has-text-grey">{produto.descricao}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{produto.sku}</td>
                      <td>{formatarMoeda(produto.precoVenda)}</td>
                      <td>
                        <span className={`tag ${getEstoqueStatus(produto.quantidadeEstoque, produto.estoqueMinimo)}`}>
                          {produto.quantidadeEstoque} uni.
                        </span>
                      </td>

                      <td>
                        <div className="buttons are-small">
                          <button
                            className="button is-info is-light"
                            title="Editar produto"
                            onClick={(e) => { e.stopPropagation(); editarProduto(produto); }}
                          >
                            <span className="icon"><FiEdit /></span>
                          </button>
                          <button
                            className="button is-danger is-light"
                            title="Excluir produto"
                            onClick={(e) => { e.stopPropagation(); handleExcluirProduto(produto.id); }}
                          >
                            <span className="icon"><FiTrash2 /></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {produtosExpandidos.has(produto.id) && (
                      <tr>
                        <td colSpan={8}>
                          <div className="box">
                            <div className="columns is-multiline">
                              <div className="column is-4">
                                <p><strong>Fornecedor:</strong> {produto.fornecedor.nome}</p>
                                <p><strong>Custo:</strong> {formatarMoeda(produto.custo)}</p>
                                <p><strong>Margem:</strong> {calcularMargem(produto.precoVenda, produto.custo)}%</p>
                              </div>
                              <div className="column is-4">
                                <p><strong>Estoque Mínimo:</strong> {produto.estoqueMinimo} uni.</p>
                                <p><strong>Data Cadastro:</strong> {new Date(produto.dataCadastro).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Valor em Estoque:</strong> {formatarMoeda(produto.precoVenda * produto.quantidadeEstoque)}</p>
                              </div>
                              <div className="column is-4">
                                <div className="buttons">
                                  <CustomButton
                                    text="Movimentação Estoque"
                                    icon={<FiPlus />}
                                    onClick={() => abrirModal(produto)}
                                    className="button is-primary is-small"
                                    style={{ borderRadius: '6px' }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )) : (
                  <tr>
                    <td colSpan={8} className="has-text-centered">
                      <div className="notification is-light">Nenhum produto encontrado com os filtros atuais</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Cards Mobile */}
            <div className="columns is-multiline is-hidden-tablet" >
              {produtos.length > 0 ? produtos.map(produto => (
                <div className="column is-12" key={produto.id}>
                  <div className="card" style={{ position: 'relative',boxShadow: 'none', padding:'10px'}}>
                    <div className="dropdown" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <div className="dropdown-trigger">
                        <button
                          className="button is-small"
                          aria-haspopup="true"
                          onClick={() => toggleDropdown(produto.id)}
                        >
                          <span className="icon"><FiMoreVertical /></span>
                        </button>
                      </div>
                      {dropdownAberto === produto.id && (
                        <div className="dropdown-menu" role="menu" style={{ display: 'block', top: '10px', right: '100px', left: '-170px' }}>
                          <div className="dropdown-content">
                            <a className="dropdown-item" onClick={() => editarProduto(produto)}>
                              <span className="icon"><FiEdit /></span> Editar
                            </a>
                            <a className="dropdown-item" onClick={() => handleExcluirProduto(produto.id)}>
                              <span className="icon"><FiTrash2 /></span> Excluir
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-content">
                      <div className="media">
                        <div className="media-left">
                          <span className="icon has-text-primary">
                            <FiPackage />
                          </span>
                        </div>
                        <div className="media-content" style={{overflowX: 'clip'}}>
                          <p className="title is-6">{produto.nome}</p>
                          <p className="subtitle is-7">{produto.sku}</p>
                        </div>
                      </div>
                      <div className="content">
                        <div className="level is-mobile">
                          <div className="level-left">
                            <span className="has-text-weight-semibold">{formatarMoeda(produto.precoVenda)}</span>
                          </div>
                          <div className="level-right">
                            <span className={`tag ${getEstoqueStatus(produto.quantidadeEstoque, produto.estoqueMinimo)}`}>
                              {produto.quantidadeEstoque} uni.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="column is-12">
                  <div className="notification is-light">Nenhum produto encontrado com os filtros atuais</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Modal de Movimentação de Estoque */}
      {modalAberto && (
        <div className="modal is-active">
          <div className="modal-background" onClick={fecharModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Adicionar/Remover do Estoque</p>
              <button className="delete" aria-label="close" onClick={fecharModal}></button>
            </header>

            <form>
              <section className="modal-card-body">
                <Input
                  label='Quantidade'
                  type="number"
                  value={produtoAddEstoque?.quantidadeEstoque ?? 0}
                  onChange={(e) => {
                    setprodutoAddEstoque(prev => ({
                      ...prev!,
                      quantidadeEstoque: Number(e.target.value),
                    }));
                  }}
                  required
                  min="0"
                  placeholder="Digite a quantidade"
                />
              </section>

              <footer className="modal-card-foot">
                <button className="button is-danger" onClick={() => removerEstoque()}>
                  <span className="icon"><FiEdit /></span>
                  <span>Remover Estoque</span>
                </button>
                <button type="submit" className="button is-primary" onClick={() => addEstoque()}>Adicionar Estoque</button>
                <button type="button" className="button" onClick={fecharModal}>Cancelar</button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GerenciamentoEstoque;