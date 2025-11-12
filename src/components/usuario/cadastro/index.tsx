import { Layout, useNotifications } from '@/components';
import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaUserShield,
  FaSpinner
} from 'react-icons/fa';
import { Role } from '@/app/models/usuario';
import { useRouter } from 'next/router';
import { Usuario } from '@/app/models/usuario'
import { useUsuarioService } from '@/app/services';
import useAuth from '@/app/services/api/useAuth';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';
import { FaX } from 'react-icons/fa6';
import { voltar } from '@/util/navegacao';

export const CadastroUsuarios: React.FC = () => {
  const { logout } = useAuth();
  const service = useUsuarioService();
  const router = useRouter();
  const { email } = router.query;
  const userEmail = String(email);

  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Usuario>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: { // AGORA É UM ÚNICO ENDEREÇO, NÃO UM ARRAY
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    role: Role.ALUNO
  });

  useEffect(() => {
    if (userEmail && userEmail !== 'undefined') {
      setIsEditMode(true);
      service.getUserByEmail(userEmail)
        .then(userEncontrado => {
          setFormData({
            ...userEncontrado,
            senha: '' // Não carrega a senha por segurança
          });
        })
        .catch(err => {
          showError('Não foi possível carregar os dados do usuário.');
        });
    }
  }, [userEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value
      }
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.nome || !formData.email) {
        showError('Preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      if (!isEditMode && !formData.senha) {
        showError('A senha é obrigatória para novo cadastro');
        setLoading(false);
        return;
      }

      if (isEditMode) {
        // Para atualização, remove a senha se estiver vazia
        const dadosAtualizacao = { ...formData };
        if (!dadosAtualizacao.senha) {
          delete dadosAtualizacao.senha;
        }

        await service.atualizarUsuario(dadosAtualizacao);
        showSuccess('Usuário atualizado com sucesso!');
      } else {
        await service.cadastrarUsuario(formData);
        showSuccess('Usuário cadastrado com sucesso!');

        // Limpa o formulário após sucesso
        setFormData({
          nome: '',
          email: '',
          senha: '',
          endereco: {
            rua: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
          },
          telefone: '',
          role: Role.ALUNO
        });
      }

    } catch (err: any) {
      showError(err.response?.data?.message || `Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} usuário`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout titulo={isEditMode ? 'Editar Usuário' : 'Cadastro de Usuário'}>
      <section className="section">
        <div className="container">
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          <div className="box" style={{ boxShadow: 'none' }}>
            <div className="block">
              <h1 className="title is-4">
                <span className="icon-text">
                  <span className="icon">
                    <FaUserShield />
                  </span>

                </span>
              </h1>
              <p className="subtitle is-6">
                {isEditMode
                  ? 'Atualize os dados do usuário'
                  : 'Preencha os dados para cadastrar um novo usuário'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* DADOS BÁSICOS */}
              <h2 className="title is-5 has-primary-custom">Dados Básicos</h2>

              <div className="columns">
                <div className="column">
                  <Input
                    label='Nome Completo *'
                    type="text"
                    icon={<FaUser />}
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="column">
                  <Input
                    label='E-mail*'
                    icon={<FaEnvelope />}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@email.com"
                    required
                    disabled={isEditMode}
                  />
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <Input
                    label={isEditMode ? 'Nova Senha (deixe em branco para manter atual)' : 'Senha*'}
                    icon={<FaLock />}
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder={isEditMode ? "Não é permitida nenhuma ação" : "Digite uma senha segura"}
                    disabled={isEditMode}
                    required={!isEditMode}
                  />
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">
                      <span className="icon-text has-text-descrition-cinza-custom has-text-weight-normal">
                        <span className="icon">
                          <FaUserShield />
                        </span>
                        <span>Perfil*</span>
                      </span>
                    </label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value={Role.ALUNO}>Aluno</option>
                          <option value={Role.PROFESSOR}>Professor</option>
                          <option value={Role.ADMIN}>Administrador</option>
                          <option value={Role.CLIENTE}>Cliente</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENDEREÇO ÚNICO */}
              <h2 className="title is-5 has-primary-custom mt-5">Endereço</h2>

              <div className="box mb-4">
                <div className="level is-mobile">
                  <div className="level-left">
                    <h3 className="subtitle is-6">
                      <span className="icon-text">
                        <span className="icon">
                          <FaMapMarkerAlt />
                        </span>
                        <span>Endereço Principal</span>
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="columns">
                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Rua*</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="rua"
                          value={formData.endereco.rua}
                          onChange={handleEnderecoChange}
                          required
                          placeholder="Nome da rua"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Número*</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="numero"
                          value={formData.endereco.numero}
                          onChange={handleEnderecoChange}
                          required
                          placeholder="Número"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Complemento</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="complemento"
                          value={formData.endereco.complemento || ''}
                          onChange={handleEnderecoChange}
                          placeholder="Complemento"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Bairro*</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="bairro"
                          value={formData.endereco.bairro}
                          onChange={handleEnderecoChange}
                          required
                          placeholder="Bairro"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Cidade*</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="cidade"
                          value={formData.endereco.cidade}
                          onChange={handleEnderecoChange}
                          required
                          placeholder="Cidade"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Estado*</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="estado"
                          value={formData.endereco.estado}
                          onChange={handleEnderecoChange}
                          required
                          placeholder="Estado"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">CEP*</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="cep"
                          value={formData.endereco.cep}
                          onChange={handleEnderecoChange}
                          required
                          placeholder="CEP"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TELEFONE ÚNICO */}
              <h2 className="title is-5 has-primary-custom mt-5">Telefone</h2>

              <div className="box mb-4">
                <div className="level is-mobile">
                  <div className="level-left">
                    <h3 className="subtitle is-6">
                      <span className="icon-text">
                        <span className="icon">
                          <FaPhone />
                        </span>
                        <span>Telefone Principal</span>
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="columns">

                  <div className="column">

                    <Input
                      label='Telefone *'
                      format='telefone'
                      className="input"
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      placeholder="Número do telefone"
                    />


                  </div>
                </div>

              </div>

              {/* AÇÕES */}
              <div className="field is-grouped is-grouped-right mt-6">
                <div className="control">
                  <CustomButton
                    className='button'
                    text={''}
                    icon={<FaX />}
                    disabled={loading}
                    onClick={voltar}
                  />
                </div>
                <div className="control">
                  <CustomButton
                    className='button'
                    text={loading
                      ? (isEditMode ? 'Atualizando...' : 'Cadastrando...')
                      : (isEditMode ? 'Atualizar Usuário' : 'Cadastrar Usuário')
                    }
                    icon={loading ? <FaSpinner className="fa-spin" /> : <FaUserShield />}
                    disabled={loading}
                    type="submit"
                  />
                </div>

              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};