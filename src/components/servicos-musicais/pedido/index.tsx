import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiPlus, FiTrash2, FiUser, FiCalendar, FiDollarSign, FiSave } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { useClienteService } from '@/app/services/servicos-musicais/cliente/cliente.service';
import { useServicoService } from '@/app/services/servicos-musicais/servico/servico.service';
import { Cliente } from '@/app/models/Servicos-musicais/cliente';
import { Servico } from '@/app/models/Servicos-musicais/servico';
import { ItemPedido } from '@/app/models/Servicos-musicais/item-pedido';
import { usePedidoService } from '@/app/services/servicos-musicais/pedidos/pedido.service';
import { FaSpinner } from 'react-icons/fa';
import { Pedido, StatusPedido } from '@/app/models/Servicos-musicais/pedido';
import { converterDataParaInput, formatarDataString } from '@/util/Datas';
import { voltar } from '@/util/navegacao';
import { FaX } from 'react-icons/fa6';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

export const RealizacaoPedidoPage: React.FC = () => {
  // ========== ROUTER E SERVICES ==========
  const router = useRouter();
  const { id } = router.query;
  const pedidoId = Number(id);
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  const clienteService = useClienteService();
  const servicosService = useServicoService();
  const pedidoService = usePedidoService();

  // ========== ESTADOS DE DADOS ==========
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pedido, setPedido] = useState<Pedido>({
    id: 0,
    clienteId: 0,
    dataPedido: '',
    valorTotal: 0,
    numeroPedido: '',
    previsaoEntrega: '',
    observacao: '',
    status: StatusPedido.PROCESSANDO,
    itens: []
  });

  const [itemAtual, setItemAtual] = useState<ItemPedido>({
    id: 0,
    quantidade: 1,
    precoUnitario: 0,
    servico: {} as Servico,
    servicoNome: '',
    servicoId: 0
  });

  // ========== ESTADOS DE UI ==========
  const [isPedidoLoaded, setIsPedidoLoaded] = useState<boolean>(false);
  const [pedidoEditando, setPedidoEditando] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);


  // ========== EFEITOS ==========
  useEffect(() => {
    if (pedidoId && !isPedidoLoaded) {
      carregarPedidoParaEdicao();
    }
  }, [pedidoId, pedidoService]);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO ==========
  const carregarPedidoParaEdicao = () => {
    setPedidoEditando(true);
    pedidoService.getPedidoById(pedidoId)
      .then(pedidoEncontrado => {
        setPedido({
          ...pedido,
          id: pedidoEncontrado.id,
          previsaoEntrega: converterDataParaInput(pedidoEncontrado.previsaoEntrega),
          clienteId: pedidoEncontrado.clienteId,
          dataPedido: pedidoEncontrado.dataPedido,
          valorTotal: pedidoEncontrado.valorTotal,
          numeroPedido: pedidoEncontrado.numeroPedido,
          observacao: pedidoEncontrado.observacao,
          status: pedidoEncontrado.status,
          itens: pedidoEncontrado.itens
        });
        setIsPedidoLoaded(true);
      })
      .catch(err => {
        console.error('Erro ao carregar pedido:', err);
        showError('Não foi possível carregar os dados do pedido.');
      });
  };

  const carregarDadosIniciais = async () => {
    try {
      const [clientesData, servicosData] = await Promise.all([
        clienteService.getClient(),
        servicosService.getServicos()
      ]);
      setClientes(clientesData);
      setServicos(servicosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES DE ITENS ==========
  const adicionarItem = () => {
    if (itemAtual.servico?.id && itemAtual.quantidade > 0 && itemAtual.precoUnitario > 0) {
      const subtotal = itemAtual.quantidade * itemAtual.precoUnitario;

      const itemParaAdicionar: ItemPedido = {
        id: itemAtual.servico.id,
        servicoId: itemAtual.servico.id,
        servico: itemAtual.servico,
        quantidade: itemAtual.quantidade,
        precoUnitario: itemAtual.precoUnitario,
        servicoNome: itemAtual.servicoNome
      };

      setPedido(prev => ({
        ...prev,
        itens: [...prev.itens, itemParaAdicionar],
        valorTotal: prev.valorTotal + subtotal
      }));

      setItemAtual({
        id: 0,
        quantidade: 1,
        precoUnitario: 0,
        servico: undefined,
        servicoNome: '',
        servicoId: 0
      });
    } else {
      showError('Preencha todos os campos do item: serviço, quantidade e preço unitário');
    }
  };

  const removerItem = (index: number) => {
    setPedido(prev => {
      const itemRemovido = prev.itens[index];
      const novoValorTotal = prev.valorTotal - (itemRemovido.quantidade * itemRemovido.precoUnitario);

      return {
        ...prev,
        itens: prev.itens.filter((_, i) => i !== index),
        valorTotal: Math.max(0, novoValorTotal)
      };
    });
  };

  const atualizarItemAtual = (campo: string, valor: any) => {
    if (campo === 'servicoId') {
      const servicoId = Number(valor);
      const servico = servicos.find(s => s.id === servicoId);

      if (servico) {
        setItemAtual(prev => ({
          ...prev,
          servicoId: servico.id,
          servico: servico,
          precoUnitario: servico.preco || 0,
          id: servico.id
        }));
      } else {
        setItemAtual(prev => ({
          ...prev,
          servicoId: 0,
          servico: undefined,
          precoUnitario: 0,
          id: 0
        }));
      }
    } else {
      setItemAtual(prev => ({
        ...prev,
        [campo]: valor
      }));
    }
  };

  // ========== FUNÇÕES DE CÁLCULO ==========
  const calcularTotal = () => {
    return pedido.itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
  };

  // ========== FUNÇÃO PRINCIPAL ==========
  const finalizarPedido = async () => {
    try {
      setLoading(true);

      if (pedido.itens.length === 0) {
        showError('Adicione pelo menos um item ao pedido');
        return;
      }

      if (pedido.previsaoEntrega === '') {
        showError('Previsão de Entrega obrigatória');
        return;
      }

      if (pedido.clienteId === 0) {
        showError('Selecione um cliente');
        return;
      }

      const pedidoData = {
        ...pedido,
        dataEntrega: '',
        previsaoEntrega: formatarDataString(pedido.previsaoEntrega),
        observacao: pedido.observacao
      };

      let response;
      if (pedidoId) {
        response = await pedidoService.atualizarPedido(pedidoId, pedido);
        showSuccess('Pedido Atualizado com sucesso');
      } else {
        response = await pedidoService.realizarPedido(pedidoData);
        showSuccess('Pedido Realizado com sucesso');
        setPedido(response);
      }

      setTimeout(() => {
        setPedido({
          id: 0,
          clienteId: 0,
          dataPedido: '',
          valorTotal: 0,
          numeroPedido: '',
          previsaoEntrega: '',
          status: StatusPedido.PROCESSANDO,
          observacao: '',
          itens: []
        });
        setItemAtual({
          id: 0,
          quantidade: 1,
          precoUnitario: 0,
          servico: {} as Servico,
          servicoNome: '',
          servicoId: 0
        });
      }, 2000);

    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      if (pedidoEditando) {
        showError(err.message || 'Erro ao atualizar pedido');
      } else {
        showError(err.message || 'Erro ao realizar pedido');
      }
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (loading && clientes.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="box has-text-centered">
            <span className="icon is-large">
              <FaSpinner className="fa-spin" />
            </span>
            <p>Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo={pedidoEditando ? 'Atualizar Pedido' : 'Novo Pedido'}>
      <div className="container mt-6">
        <div className="box" style={{ boxShadow: 'none' }}>

          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          {/* DADOS DO CLIENTE */}
          <div className="columns is-multiline">
            <div className="column is-12">
              <h3 className="title is-5">Dados do Cliente</h3>
            </div>

            <div className="column is-12-mobile is-6-tablet">
              <div className="field">
                <label className="label">Cliente *</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={pedido.clienteId}
                      onChange={(e) => setPedido(prev => ({ ...prev, clienteId: Number(e.target.value) }))}
                      disabled={pedidoEditando}
                      required
                    >
                      <option value={0}>Selecione um cliente</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome} - {cliente.telefone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-12-mobile is-6-tablet">
              <div className="field">
                <label className="label">Previsão de Entrega</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    value={pedido.previsaoEntrega}
                    onChange={(e) => setPedido(prev => ({ ...prev, previsaoEntrega: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO PARA ADICIONAR ITEM */}
          {!pedidoEditando && (
            <div className="columns is-multiline">
              <div className="column is-12">
                <div className="level">
                  <div className="level-left">
                    <h3 className="title is-5">Adicionar Item</h3>
                  </div>
                </div>

                <div className="box">
                  <div className="columns is-multiline ">
                    <div className="column is-6-mobile is-4-tablet">
                      <div className="field">
                        
                        <label className="label">Serviço *</label>
                        <div className="control">
                          <div className="select is-fullwidth">
                            <select
                              value={itemAtual.servicoId || 0}
                              onChange={(e) => atualizarItemAtual('servicoId', e.target.value)}
                            >
                              <option value={0}>Selecione um serviço</option>
                              {servicos.map(servico => (
                                <option key={servico.id} value={servico.id}>
                                  {servico.nome} - R$ {servico.preco}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="column is-6-mobile is-2-tablet">
                      <Input
                        label='Quantidade *'
                        type="number"
                        min="1"
                        value={itemAtual.quantidade}
                        onChange={(e) => atualizarItemAtual('quantidade', Number(e.target.value))}
                        required />
                    </div>

                    <div className="column is-6-mobile is-2-tablet">
                      <Input
                        label='Preço Unit. *'
                        type="number"
                        step="0.01"
                        value={itemAtual.precoUnitario}
                        onChange={(e) => atualizarItemAtual('precoUnitario', Number(e.target.value))}
                        required />
                    </div>

                    <div className="column is-12-mobile is-2-tablet">
                      <div className="field">
                        <label className="label">&nbsp;</label>
                        <div className="control">
                          <CustomButton
                            text="Adicionar"
                            icon={<FiPlus />}
                            onClick={adicionarItem}
                            className="is-primary is-fullwidth"
                            disabled={!itemAtual.servico?.id || itemAtual.quantidade <= 0 || itemAtual.precoUnitario <= 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LISTA DE ITENS DO PEDIDO */}
          <div className="columns is-multiline">
            <div className="column is-12">
              <h3 className="title is-5">Itens do Pedido</h3>

              {pedido.itens.length === 0 ? (
                <div className="box has-text-centered">
                  <p>Nenhum item adicionado ao pedido</p>
                </div>
              ) : (
                pedido.itens.map((item, index) => (
                  <div key={index} className="box">
                    <div className="columns is-multiline is-vcentered">
                      <div className="column is-12-mobile is-4-tablet">
                        <div className="field">
                          <label className="label">Serviço</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              value={item.servicoNome || item.servico?.nome}
                              disabled={true}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="column is-4-mobile is-2-tablet">
                        <div className="field">
                          <label className="label">Quantidade</label>
                          <div className="control">
                            <input
                              className="input"
                              type="number"
                              value={item.quantidade}
                              disabled={true}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="column is-4-mobile is-2-tablet">
                        <div className="field">
                          <label className="label">Preço Unit.</label>
                          <div className="control">
                            <input
                              className="input"
                              type="number"
                              value={item.precoUnitario}
                              disabled={true}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="column is-5-mobile is-2-tablet">
                        <div className="field">
                          <label className="label">Subtotal</label>
                          <div className="control">
                            <input
                              className="input"
                              type="number"
                              value={(item.quantidade * item.precoUnitario)}
                              disabled={true}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {!pedidoEditando && (
                        <div className="column is-3-mobile is-2-tablet">
                          <div className="field">
                            <label className="label">&nbsp;</label>
                            <div className="control">
                              <button
                                type="button"
                                className="button is-danger is-light is-fullwidth"
                                onClick={() => removerItem(index)}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RESUMO E FINALIZAÇÃO */}
          <div className="columns is-multiline">
            <div className="column is-12-mobile is-6-tablet is-offset-6-tablet">
              <div className="box">
                <div className="field">
                  <label className="label">Observações Gerais</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={pedido.observacao}
                      onChange={(e) => setPedido(prev => ({ ...prev, observacao: e.target.value }))}
                      rows={2}
                    />
                  </div>
                </div>

                <hr />

                <div className="level">
                  <div className="level-left">
                    <strong>Total:</strong>
                  </div>
                  <div className="level-right">
                    <strong className="title is-5">
                      R$ {calcularTotal().toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="field is-grouped is-grouped-right">
                  <div className="control">
                    <CustomButton
                      text={<div className='is-hidden-mobile'><span>Cancelar</span></div>}
                      onClick={voltar}
                      icon={<FaX />}
                      className="is-light"
                      style={{ borderRadius: '6px' }}
                    />
                  </div>
                  <div className="control">
                    <CustomButton
                      text={pedidoEditando ? (loading ? "Processando..." : "Atualizar Pedido") : (loading ? "Processando..." : "Finalizar Pedido")}
                      icon={loading ? <FaSpinner className="fa-spin" /> : <FiSave />}
                      onClick={finalizarPedido}
                      className="is-primary is-fullwidth"
                      disabled={pedido.itens.length === 0 || pedido.clienteId === 0 || loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RealizacaoPedidoPage;