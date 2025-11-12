import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiEdit, FiPlus, FiDollarSign, FiShoppingCart, FiUsers, FiBarChart2, FiChevronRight, FiMoreVertical, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { Venda } from '@/app/models/loja/venda';
import { useVendaService } from '@/app/services/loja/venda/venda.service';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import CardList from '@/components/common/tableMobile';
import { Input } from '@/components/common/input';

export const GerenciamentoVendas: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const service = useVendaService();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [vendas, setVendas] = useState<Venda[]>([]);

  // ========== ESTADOS DE FILTROS ==========
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroData, setFiltroData] = useState<string>('');

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState<boolean>(true);
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const [vendasExpandidas, setVendasExpandidas] = useState<Set<number>>(new Set());

  // ========== EFEITOS ==========
  useEffect(() => {
    carregarVendas();
  }, []);

  // ========== FUNÇÕES DE API ==========
  const carregarVendas = async () => {
    setCarregando(true);
    try {
      const responseVendas = await service.getVendas();
      setVendas(responseVendas);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      showError('Erro ao carregar vendas');
    } finally {
      setCarregando(false);
    }
  };

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const toggleExpandirProduto = (id: number) => {
    const novosExpandidos = new Set(vendasExpandidas);
    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id);
    } else {
      novosExpandidos.add(id);
    }
    setVendasExpandidas(novosExpandidos);
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const acessarNovaVenda = () => router.push('/instituto-musical/loja/venda');

  // ========== FUNÇÕES DE MANIPULAÇÃO DE VENDAS ==========
  const handleCancelarVenda = async (id: number) => {
    if (window.confirm('Tem certeza que deseja cancelar esta venda?')) {
      try {
        setVendas(vendas.map(venda =>
          venda.id === id ? { ...venda, status: 'cancelada' } : venda
        ));
        alert('Venda cancelada com sucesso!');
      } catch (error) {
        alert('Erro ao cancelar venda');
      }
    }
  };

  const handleConcluirVenda = async (id: number) => {
    try {
      setVendas(vendas.map(venda =>
        venda.id === id ? { ...venda, status: 'concluida' } : venda
      ));
      alert('Venda concluída com sucesso!');
    } catch (error) {
      alert('Erro ao concluir venda');
    }
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const vendasFiltradas = vendas.filter(venda => {
    const clienteMatch = venda.clienteNome.toLowerCase().includes(filtroCliente.toLowerCase());
    const dataMatch = !filtroData || venda.data === filtroData;
    return clienteMatch && dataMatch;
  });

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando) return <div className="container mt-6"><div className="notification is-info is-light">Carregando vendas...</div></div>;

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Gerenciamento de Vendas">
      <div className="container mt-6">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />

        <div className="box" style={{ boxShadow: 'none' }}>
          <div className="level is-mobile">
            <div className="level-left">
        
            </div>
            <div className="level-right">
              <CustomButton
                text="Nova Venda"
                icon={<FiPlus />}
                onClick={acessarNovaVenda}
                className="is-primary"
                style={{ borderRadius: '6px' }}
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="columns is-multiline is-mobile">
            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <Input
                label=''
                iconLeft={<FiSearch />}
                aditionalClassesControl='has-icons-left'
                className="input is-fullwidth"
                type="text"
                placeholder="Filtrar por cliente"
                value={filtroCliente}
                onChange={e => setFiltroCliente(e.target.value)}
                required />

            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <Input
                label=''
                className="input is-fullwidth"
                type="date"
                value={filtroData}
                onChange={e => setFiltroData(e.target.value)}
                required />
            </div>
          </div>

          {/* Tabela Desktop */}
          <div className="table-container is-scrollable">
            <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
              <thead>
                <tr>
                  <th></th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Valor Total</th>
                  <th>Itens</th>
                </tr>
              </thead>
              <tbody>
                {vendasFiltradas.length > 0 ? vendasFiltradas.map(venda => (
                  <React.Fragment key={venda.id}>
                    <tr className="is-clickable" onClick={() => toggleExpandirProduto(venda.id)}>
                      <td style={{ borderBottomWidth: '0', border: 'none', padding: '1.5rem' }}>
                        <span className="icon">
                          {vendasExpandidas.has(venda.id) ? <FiChevronRight style={{ transform: 'rotate(90deg)' }} /> : <FiChevronRight />}
                        </span>
                      </td>
                      <td>{venda.clienteNome}</td>
                      <td>{venda.data}</td>
                      <td>
                        <span className="has-text-weight-bold">{formatarMoeda(venda.valorTotal)}</span>
                      </td>
                      <td>
                        <span className="tag is-light">
                          {venda.itens.length} item(s)
                        </span>
                      </td>
                    </tr>

                    {vendasExpandidas.has(venda.id) && (
                      <tr>
                        <td colSpan={8}>
                          <div className="box">
                            <div className="columns is-multiline">
                              <div className="column is-4">
                                {venda.itens.map((item, index) => (
                                  <div key={index} className="box">
                                    <p><strong>Produto:</strong> {item.produtoNome}</p>
                                    <p><strong>Quantidade:</strong> {item.quantidade}</p>
                                    <p><strong>Preço unitário:</strong> R$ {item.precoUnitario}</p>
                                    <p><strong>Subtotal:</strong> R$ {item.subtotal}</p>
                                  </div>
                                ))}
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
                      <div className="notification is-light">Nenhuma venda encontrada com os filtros atuais</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Cards Mobile */}
            {vendasFiltradas.length < 0 ? (
              <div className="column is-12">
                <div className="notification is-light">Nenhuma venda encontrada com os filtros atuais</div>
              </div>
            ) : (
              <CardList
                data={vendasFiltradas}
                titleField=""
                icon={<FiShoppingCart />}
                iconColor='is-primary-custom'
                subtitleField=""
                fields={[
                  { label: '', key: 'clienteNome' },
                  { label: '', key: 'data' },
                ]}
                tags={[
                  { label: 'Valor Total', key: 'valorTotal', color: 'is-primary-custom' },
                ]}
                actions={[]}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GerenciamentoVendas;