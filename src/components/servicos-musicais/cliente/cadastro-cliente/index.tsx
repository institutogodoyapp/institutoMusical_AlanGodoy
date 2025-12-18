import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSave, FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiXOctagon, FiX } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { Cliente } from '@/app/models/Servicos-musicais/cliente';
import { useClienteService } from '@/app/services/servicos-musicais/cliente/cliente.service';
import { voltar } from '@/util/navegacao';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';

export const CadastroCliente: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const { id } = router.query;
  const clienteId = Number(id);
  const service = useClienteService();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [cliente, setCliente] = useState<Cliente>({
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    observacao: '',
  });

  // ========== ESTADOS DE UI ==========
  const [isClienteLoaded, setIsClienteLoaded] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);

  // ========== EFEITOS ==========
  useEffect(() => {
    if (clienteId && !isClienteLoaded) {
      carregarClienteParaEdicao();
    }
  }, [clienteId, service]);

  // ========== FUNÇÕES DE API ==========
  const carregarClienteParaEdicao = () => {
    setEditando(true);
    setCarregando(true);
    service.getClientById(clienteId)
      .then(clienteEncontrado => {
        setCliente({
          ...cliente,
          id: clienteEncontrado.id,
          nome: clienteEncontrado.nome,
          email: clienteEncontrado.email,
          telefone: clienteEncontrado.telefone,
          observacao: clienteEncontrado.observacao
        });
        setIsClienteLoaded(true);
        setCarregando(false);
      })
      .catch(err => {
        showError('Não foi possível carregar os dados do cliente.');
        console.error('Erro ao Buscar dados de Cliente:', err);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (editando) {
        const response = await service.atualizarCliente(cliente.id, cliente);
      } else {
   
        const response = await service.salvarCliente(cliente);
      }
    } catch (error) {
      showError(`Não foi possivel ${editando ? 'atualizar ' : 'cadastrar '}cliente`);
    } finally {
      setCarregando(false);
      showSuccess(`Cliente ${editando ? 'atualizado ' : 'cadastrado '}com sucesso`);
      setCliente({
        id: 0,
        email: '',
        nome: '',
        observacao: '',
        telefone: ''
      });
    }
  };

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando && editando) {
    return (
      <Layout titulo="Carregando cliente...">
        <div className="container mt-6">
          <div className="notification is-info is-light">Carregando dados do cliente...</div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo={editando ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}>
      <div className="container mt-6">
        <div className="box" style={{ boxShadow: 'none' }}>
          <div className="level is-mobile">
            <NotificationContainer
              notifications={notifications}
              onRemove={removeNotification}
            />

            <div className="level-right">
              <span className="tag is-primary-custom is-light">
                {editando ? 'Editando' : 'Novo Cliente'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="columns is-multiline">
              {/* Informações Pessoais */}
              <div className="column is-6">
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">
                    <span className="icon has-primary-custom">
                      <FiUser />
                    </span>
                    Informações Pessoais
                  </h3>

                  <Input
                    label='Nome Completo *'
                    type="text"
                    placeholder="Ex: João Silva"
                    value={cliente.nome}
                    onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                    required />

                  <Input
                    label='Email *'
                    type="email"
                    placeholder="exemplo@email.com"
                    value={cliente.email}
                    onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                    required= {false} />

                  <Input
                    label='Contato *'
                    type="text"
                    placeholder="(11) 99999-9999"
                    format='telefone'
                    value={cliente.telefone}
                    onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
                    required />

                </div>
              </div>

              {/* Observações */}
              <div className="column is-6">
                <div className="box" style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}>
                  <h3 className="title is-5">Observações</h3>

                  <div className="field">
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="Observações sobre o cliente..."
                        rows={3}
                        value={cliente.observacao}
                        onChange={(e) => setCliente({ ...cliente, observacao: e.target.value })}
                      />
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
                      text={editando ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                      icon={<FiSave />}
                      type="submit"
                      className="is-primary"
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

export default CadastroCliente;