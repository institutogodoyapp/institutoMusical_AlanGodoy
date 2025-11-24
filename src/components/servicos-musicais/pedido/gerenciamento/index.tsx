import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiEye, FiEdit, FiTrash2, FiFilter, FiCalendar } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { usePedidoService } from '@/app/services/servicos-musicais/pedidos/pedido.service';
import { Pedido, StatusPedido } from '@/app/models/Servicos-musicais/pedido';
import { FaBox, FaCheckCircle, FaPlayCircle, FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
import CardList from '@/components/common/tableMobile';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

export const GerenciamentoPedidosPage: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const servicosPedido = usePedidoService();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // ========== ESTADOS DE FILTROS ==========
  const [filtros, setFiltros] = useState({
    status: 'todos',
    dataInicio: '',
    dataFim: '',
    cliente: ''
  });

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState(true);
  const [pedidosExpandidos, setPedidosExpandidos] = useState<Set<number>>(new Set());

  // ========== EFEITOS ==========
  useEffect(() => {
    carregarPedidos();
  }, []);

  // ========== FUNÇÕES DE API ==========
  const carregarPedidos = async () => {
    try {
      const pedidosResponse = await servicosPedido.getPedidos();

      setPedidos(pedidosResponse);
    } catch (error) {
      showError('Erro ao carregar pedidos');
    } finally {
      setCarregando(false);
    }
  };

  const mudarStatus = async (pedidoId: number, status: StatusPedido, e: React.FormEvent) => {
    e.preventDefault();
    if (confirm('Tem certeza que deseja realizar esta ação?')) {
      try {
        if (status == StatusPedido.PROCESSANDO) {
          await servicosPedido.mudarStatus(pedidoId, status);
        } else if (status == StatusPedido.ENTREGUE) {
          await servicosPedido.mudarStatus(pedidoId, status);
        } else {
          await servicosPedido.mudarStatus(pedidoId, status);
        }
        carregarPedidos();
      } catch (err) {
        showError('Erro ao mudar status');
      }
    }
  };

  const deletarPedido = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este instrumento?')) {
      try {
        await servicosPedido.deletarPedidos(id);
      } catch (err) {
        showError('Erro ao excluir pedido');
      }
    }
  };

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const toggleExpandirProduto = (id: number) => {
    const novosExpandidos = new Set(pedidosExpandidos);
    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id);
    } else {
      novosExpandidos.add(id);
    }
    setPedidosExpandidos(novosExpandidos);
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const editarPedido = (pedidoId: number) => {
    const url = `/instituto-musical/servicos-musicais/pedido?id=${pedidoId}`;
    router.push(url);
  };

  const irParaRealizarPedido = () => {
    const url = `/instituto-musical/servicos-musicais/pedido`;
    router.push(url);
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const getStatusColor = (status: string) => {
  
    const cores = {
      AGENDADO: 'is-warning',
      PROCESSANDO: 'is-primary',
      ENTREGUE: 'is-success',
      CANCELADO: 'is-danger'
    };
    return cores[status as keyof typeof cores] || 'is-light';
  };

  const traduzirStatus = (status: string) => {
    const traducoes = {
      AGENDADO: 'Pendente',
      PROCESSANDO: 'Em Produção',
      ENTREGUE: 'Concluído',
      CANCELADO: 'Cancelado'
    };
    return traducoes[status as keyof typeof traducoes] || status;
  };

  // ========== CÁLCULOS E DERIVAÇÕES ==========

  const pedidosFiltrados = pedidos.filter(pedido => {
 
    const statusMatch = filtros.status === 'todos' ||
      traduzirStatus(pedido.status) === filtros.status;

    const clienteMatch = !filtros.cliente ||
      (pedido.clienteNome?.toLowerCase() || '').includes(filtros.cliente.toLowerCase());

    const dataPedido = new Date(pedido.dataPedido);
    const dataInicio = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
    const dataFim = filtros.dataFim ? new Date(filtros.dataFim) : null;

    const dataMatch = (!dataInicio || dataPedido >= dataInicio) &&
      (!dataFim || dataPedido <= dataFim);

    return statusMatch && clienteMatch && dataMatch;
  });


  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando) return <div className="container mt-6"><div className="notification is-info is-light">Carregando pedidos...</div></div>;

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Gerenciamento de Pedidos">
      <div className="container mt-6">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />
        <div className="box" style={{ boxShadow: 'none' }}>
          {/* Header */}
          <div className="level is-mobile">
            <div className="level-left">
             
            </div>
            <div className="level-right">
              <CustomButton
                icon={<FaPlusCircle />}
                text="Novo Pedido"
                onClick={irParaRealizarPedido}
                className="is-primary"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="columns is-multiline is-mobile">
            <div className="column is-12-mobile is-6-tablet is-3-desktop" >
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth ">
                    <select
                      value={filtros.status}
                      onChange={e => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="todos">Todos status</option>
                      <option value="pendente">Pendente</option>
                      <option value="Em Produção">Em Produção</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>


                  </div>
                </div>
              </div>

            </div>


            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <Input
                label=''
                iconLeft={<FiCalendar />}
                aditionalClassesControl='has-icons-left'
                type="date"
                placeholder="Data início"
                value={filtros.dataInicio}
                onChange={e => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                required />

            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <Input
                label=''

                iconLeft={<FiCalendar />}
                aditionalClassesControl='has-icons-left'
                type="date"
                placeholder="Data fim"
                value={filtros.dataFim}
                onChange={e => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                required />
            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <Input
                label=''
                iconLeft={<FiSearch />}
                aditionalClassesControl='has-icons-left'
                type="text"
                placeholder="Filtrar por cliente"
                value={filtros.cliente}
                onChange={e => setFiltros(prev => ({ ...prev, cliente: e.target.value }))}
                required />

            </div>

          </div>

          {/* Tabela de Pedidos */}
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente</th>
                  <th>Data Pedido</th>
                  <th>Entrega Estimada</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length > 0 ? pedidosFiltrados.map(pedido => (
                  <React.Fragment key={pedido.id}>
                    <tr key={pedido.id}>
                      <td className="has-text-weight-semibold">{pedido.numeroPedido}</td>
                      <td>{pedido.clienteNome}</td>
                      <td>{pedido.dataPedido}</td>
                      <td>{pedido.previsaoEntrega}</td>
                      <td>
                        <div className="buttons are-small">
                          <button className="button is-info is-light no-select"
                            title="Ver detalhes"
                            onClick={() => toggleExpandirProduto(pedido.id)}>
                            <FiEye />
                          </button>
                          <button className="button is-warning is-light"
                            title="Editar"
                            onClick={() => editarPedido(pedido.id)}>
                            <FiEdit />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {pedidosExpandidos.has(pedido.id) && (
                      <tr>
                        <td colSpan={8}>
                          <div className="box is-shadowless has-background-white-bis">
                            <div className="columns is-mobile is-vcentered">
                              {/* Coluna de Informações do Pedido */}
                              <div className="column is-8">
                                <div className="content is-small">
                                  {/* Header Minimalista */}
                                  <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                    <h4 className="title is-6 has-text-grey-dark mb-0">Detalhes do Pedido</h4>

                                    <span className={`tag is-rounded is-medium ${getStatusColor(pedido.status)} is-light`}>
                                      {traduzirStatus(pedido.status)}
                                    </span>

                                    <div className="buttons are-small">
                                      <button className="button is-primary is-light"
                                        title="Em Produção"
                                        onClick={(e) => mudarStatus(pedido.id, StatusPedido.PROCESSANDO, e)}>
                                        <FaPlayCircle />
                                      </button>
                                      <button className="button is-success is-light"
                                        title="Concluído"
                                        onClick={(e) => mudarStatus(pedido.id, StatusPedido.ENTREGUE, e)}>
                                        <FaCheckCircle />
                                      </button>
                                      <button className="button is-danger is-light"
                                        title="Cancelar"
                                        onClick={(e) => mudarStatus(pedido.id, StatusPedido.CANCELADO, e)}>
                                        <FaTimesCircle />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Observação Discreta */}
                                  {pedido.observacao && (
                                    <div className="notification is-light is-info is-small py-2 px-3 mb-3">
                                      <p className="has-text-weight-medium is-size-7">📝 Observação</p>
                                      <p className="is-size-7">{pedido.observacao}</p>
                                    </div>
                                  )}

                                  {/* Lista de Itens Estilizada */}
                                  <div className="mb-3">
                                    <p className="has-text-weight-semibold is-size-7 has-text-grey mb-2">ITENS CONTRATADOS</p>
                                    <div className="has-background-white py-2 px-3 is-rounded">
                                      {pedido.itens?.map((item, itemIndex) => (
                                        <div key={itemIndex} className="is-flex is-justify-content-space-between is-align-items-center py-1">
                                          <div className="is-flex is-align-items-center">
                                            <span className="has-text-weight-medium is-size-7">{item.quantidade}x</span>
                                            <span className="is-size-7 ml-2 has-text-grey-dark">{item.servicoNome}</span>
                                          </div>
                                          <span className="has-text-weight-semibold is-size-7">
                                            R$ {(item.precoUnitario * item.quantidade)?.toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Coluna de Total - Destaque Visual */}
                              <div className="column is-4">
                                <div className="has-text-centered">
                                  <div className="has-background-primary-light py-3 px-2 is-rounded">
                                    <p className="has-text-weight-semibold is-size-7 has-text-grey">VALOR TOTAL</p>
                                    <p className="title is-5 has-text-primary-dark has-text-weight-bold">
                                      R$ {pedido.valorTotal?.toFixed(2)}
                                    </p>
                                    <p className="is-size-7 has-text-grey">
                                      {pedido.itens?.length || 0} item{pedido.itens?.length !== 1 ? 's' : ''}
                                    </p>
                                  </div>

                                  {/* Informações Adicionais Minimalistas */}
                                  <div className="mt-3">
                                    <p className="is-size-7 has-text-grey">
                                      <strong>Pedido:</strong> {pedido.numeroPedido}
                                    </p>
                                    {pedido.dataEntrega && (
                                      <p className="is-size-7 has-text-grey">
                                        <strong>Entrega:</strong> {pedido.dataEntrega}
                                      </p>
                                    )}
                                  </div>
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
                      <div className="notification is-light">
                        Nenhum pedido encontrado com os filtros atuais
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Cards Mobile */}
            <CardList
              data={pedidosFiltrados}
              icon={<FaBox /> }
              titleField=""
              subtitleField=""
              fields={[
                { label: 'Nº Pedido', key: 'numeroPedido' },
                { label: 'Data Pedido', key: 'dataPedido' },
                { label: 'Data Entrega', key: 'dataEntrega' },
                { label: 'Observação', key: 'observacao' }
              ]}
              tags={[
                {
                  label: 'Status', key: 'status',
                  color: (item: any) => getStatusColor(item.status),
                  format: (value: string) => traduzirStatus(value)
                },
                { label: 'Valor', key: 'valorTotal', color: 'is-success', defaultValue: 0, prefix: 'R$ ' }
              ]}
              actions={[
                {
                  label: '',
                  color: 'is-warning is-light',
                  onClick: (item) => editarPedido(item.id),
                  icon: <FiEdit />
                }
              ]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GerenciamentoPedidosPage;