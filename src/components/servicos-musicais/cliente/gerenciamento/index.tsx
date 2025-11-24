import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiUserPlus, FiEdit, FiTrash2, FiPhone, FiMail, FiUser, FiChevronRight, FiPlus, FiBookOpen, FiTrash } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { Cliente } from '@/app/models/Servicos-musicais/cliente';
import { useClienteService } from '@/app/services/servicos-musicais/cliente/cliente.service';
import { Pedido } from '@/app/models/Servicos-musicais/pedido';
import { usePedidoService } from '@/app/services/servicos-musicais/pedidos/pedido.service';
import { ListaProfessoresMobile } from '@/components/Escola/professor';
import { formatarMoeda } from '@/util';
import CardList from '@/components/common/tableMobile';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

export const GerenciamentoClientesPage: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const serviceCliente = useClienteService();
  const servicePedido = usePedidoService();

  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidosClientes, setPedidosClientes] = useState<Pedido[]>([]);

  // ========== ESTADOS DE FILTROS ==========
  const [filtros, setFiltros] = useState({
    nome: '',
    status: 'todos'
  });

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState(true);
  const [clientesExpandidos, setClientesExpandidos] = useState<Set<number>>(new Set());
  const [carregandoPedidos, setCarregandoPedidos] = useState<Set<number>>(new Set());

  // ========== EFEITOS ==========
  useEffect(() => {
    carregarDadosCliente();
  }, []);

  // ========== FUNÇÕES DE API ==========
  const carregarDadosCliente = async () => {
    try {
      const response = await serviceCliente.getClient();
    
      setClientes(response);
    } catch (error) {
      showError('Erro ao carregar clientes');
    } finally {
      setCarregando(false);
    }
  };

  const carregarPedidosDoCliente = async (clienteId: number) => {
    try {
      toggleExpandirCliente(clienteId);
      setCarregandoPedidos(prev => new Set(prev).add(clienteId));

      const responsePedido = await servicePedido.getPedidoByClienteId(clienteId);
      setPedidosClientes(responsePedido);
    } catch (error) {
      showError(`Erro ao carregar pedidos do cliente`);
    } finally {
      setCarregandoPedidos(prev => {
        const novos = new Set(prev);
        novos.delete(clienteId);
        return novos;
      });
    }
  };

  const handleDelete = async (cliente: Cliente) => {
        try {
          if (confirm("Tem certeza que deseja excluir?")) {
         
              await serviceCliente.deletar(cliente.id);
              setClientes(prev => prev.filter(d => d.id !== cliente.id));
            
          }
        } catch (error) {
          showError('Falha ao deletar. Tente novamente.');
        }
      };

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const toggleExpandirCliente = async (id: number) => {
    const novosExpandidos = new Set(clientesExpandidos);

    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id);
    } else {
      novosExpandidos.add(id);
      if (!pedidosClientes[id]) {
        await servicePedido.getPedidoByClienteId(id);
      }
    }
    setClientesExpandidos(novosExpandidos);
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const editarCliente = (clienteId: number) => {
    router.push(`/instituto-musical/servicos-musicais/cliente/cadastro-cliente?id=${clienteId}`);
  };

  const irParaGerentePedido = () => {
    router.push("/instituto-musical/servicos-musicais/pedido/gerenciamento");
  };

  const irParaNovoCliente = () => {
    router.push("/instituto-musical/servicos-musicais/cliente/cadastro-cliente");
  };

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const clientesFiltrados = clientes.filter(cliente => {
    const nomeMatch = cliente.nome.toLowerCase().includes(filtros.nome.toLowerCase());
    return nomeMatch;
  });

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando) return <div className="container mt-6"><div className="notification is-info is-light">Carregando clientes...</div></div>;

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Gerenciamento de Clientes">
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
                text="Novo Cliente"
                icon={<FiUserPlus />}
                onClick={irParaNovoCliente}
                className="is-primary"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="columns is-multiline is-mobile">
            <div className="column is-12-mobile is-6-tablet is-6-desktop">
              <Input
                label=''
                iconLeft={<FiSearch />}
                aditionalClassesControl='has-icons-left'
                type="text"
                placeholder="Filtrar por nome"
                value={filtros.nome}
                onChange={e => setFiltros(prev => ({ ...prev, nome: e.target.value }))}
                required />
             
            </div>
          </div>

          {/* Tabela Desktop */}
          <div className="table-container is-scrollable">
            <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
              <thead>
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Contato</th>
                  <th>Cadastro</th>
                  <th>Pedidos</th>
                  <th>Valor Investido</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length > 0 ? clientes.map(cliente => (
                  <React.Fragment key={cliente.id}>
                    <tr className="is-clickable" onClick={() => carregarPedidosDoCliente(cliente.id)}>
                      <td style={{ borderBottomWidth: '0', border: 'none', padding: '1.5rem' }}>
                        <span className="icon">
                          {clientesExpandidos.has(cliente.id) ? <FiChevronRight style={{ transform: 'rotate(90deg)' }} /> : <FiChevronRight />}
                        </span>
                      </td>
                      <td>
                        <div className="media">
                          <div className="media-content">
                            <p className="has-text-weight-semibold">{cliente.nome}</p>
                          </div>
                        </div>
                      </td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefone}</td>
                      <td>{cliente.dataCadastro}</td>
                      <td>{cliente.pedidosRealizados ? cliente.pedidosRealizados : 0}</td>
                      <td>
                        <span>
                          {formatarMoeda(cliente.totalGasto)}
                        </span>
                      </td>
                      <td>
                        <div className="buttons are-small">
                          <button
                            className="button is-info is-light"
                            title="Editar produto"
                            onClick={(e) => { e.stopPropagation(); editarCliente(cliente.id); }}
                          >
                            <span className="icon"><FiEdit /></span>
                          </button>
                          <button
                            className="button is-danger is-light"
                            title="Excluir produto"
                            onClick={(e) => { e.stopPropagation(); handleDelete(cliente); }}
                          >
                            <span className="icon"><FiTrash2 /></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {clientesExpandidos.has(cliente.id) && (
                      <tr>
                        <td colSpan={8}>
                          <div className="box">
                            <div className="columns is-multiline">
                              {/* Seção de pedidos */}
                              <div className="column is-12">
                                <h4 className="title is-6">Pedidos do Cliente</h4>
                                {carregandoPedidos.has(cliente.id) ? (
                                  <div className="notification is-info is-light">
                                    Carregando pedidos...
                                  </div>
                                ) : pedidosClientes.length > 0 ? (
                                  <div className="table-container">
                                    <table className="table is-striped is-fullwidth is-hoverable">
                                      <thead>
                                        <tr>
                                          <th>Nº Pedido</th>
                                          <th>Data Pedido</th>
                                          <th>Valor Total</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {pedidosClientes.map((pedido) => (
                                          <tr key={pedido.id}>
                                            <td>{pedido.numeroPedido}</td>
                                            <td>
                                              {pedido.dataPedido}
                                            </td>
                                            <td>
                                              {formatarMoeda(pedido.valorTotal)}
                                            </td>
                                            <td>
                                              {pedido.status}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="notification is-light is-warning">
                                    Nenhum pedido encontrado para este cliente.
                                  </div>
                                )}
                              </div>
                              <div className="column is-4">
                                <div className="column is-4">
                                  <div className="buttons">
                                    <CustomButton
                                      text="Todos Pedidos"
                                      icon={<FiBookOpen />}
                                      onClick={irParaGerentePedido}
                                      className="button is-primary is-small"
                                      style={{ borderRadius: '6px' }}
                                    />
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
                      <div className="notification is-light">Nenhum produto encontrado com os filtros atuais</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {clientesFiltrados.length > 0 ? (
              <CardList
                data={clientesFiltrados}
                titleField='nome'
                subtitleField='email'
                fields={[
                
                  { label: 'Cadastro', key: 'dataCadastro' },

                ]}
                tags={[

                  { label: 'Pedidos', key: 'pedidosRealizados', color: 'is-info', defaultValue: 0 },
                  { label: 'Total', key: 'totalGasto', color: 'is-success', defaultValue: 0, prefix: 'R$ ' }
                ]}
                actions={[
                  {
                    label: '',
                    color: 'is-info is-light',
                    onClick: (item) => editarCliente(item.id),
                    icon: <FiEdit />
                  },
                  {
                    label: '',
                    color: 'is-danger is-light',
                    onClick: (item) => editarCliente(item.id),
                    icon: <FiTrash />
                  },
                  {
                    label: '',
                    color: 'is-primary-custom is-light',
                    onClick: irParaGerentePedido,
                    icon: <FiBookOpen />
                  }
                ]}
              />


            ) : (
              <div className="column is-12">
                <div className="notification is-light">
                  Nenhum cliente encontrado
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </Layout >
  );
};

export default GerenciamentoClientesPage;