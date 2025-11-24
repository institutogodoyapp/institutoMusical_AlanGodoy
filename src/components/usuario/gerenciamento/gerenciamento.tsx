import { useState, useEffect } from 'react';
import { CustomButton } from '@/components/common/customButton';
import {
  FiArrowUp,
  FiArrowDown,
  FiTrash2,
  FiRefreshCw,
  FiUserPlus,
  FiEdit,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { Role, Usuario } from '@/app/models/usuario';
import { useUsuarioService } from '@/app/services';
import { Layout } from '@/components/layout';
import { useNotifications } from '@/components/common/notificacao/hookNotify/usoSimples';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';
import { useRouter } from 'next/router';
import AtualizarSenha, { AtualizarSenhaModal } from '../password';

export const GerenciamentoUsuarios: React.FC = () => {
  const router = useRouter();
  const service = useUsuarioService();

  const {
    notifications,
    showError,
    removeNotification
  } = useNotifications();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [ordemAscendente, setOrdemAscendente] = useState<boolean>(true);
  const [usuarioExpandido, setUsuarioExpandido] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [emailSelecionado, setEmailSelecionado] = useState('');

  const [filtros, setFiltros] = useState({
    nome: '',
    email: '',
    perfil: 'todos' as 'todos' | Role
  });

  useEffect(() => {
    carregarUsuarios();
    configurarResponsividade();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const resposta = await service.getUser();
  
      setUsuarios(Array.isArray(resposta) ? resposta : [resposta]);
    } catch (error) {
      showError("Erro ao carregar usuários");
    } finally {
      setCarregando(false);
    }
  };

  const configurarResponsividade = () => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  };

  const toggleExpandirUsuario = (usuarioId: string) => {
    setUsuarioExpandido(usuarioExpandido === usuarioId ? null : usuarioId);
  };

  const handleAtualizarSenha = (usuario: Usuario) => {
    setEmailSelecionado(usuario.email);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
  };

  // Função auxiliar para obter ID como string para comparação
  const getIdComoString = (usuario: Usuario): string => {
    return usuario.id?.toString() || '';
  };

  const usuariosFiltrados = usuarios
    .filter(usuario => {
      const nomeMatch = usuario.nome.toLowerCase().includes(filtros.nome.toLowerCase());
      const emailMatch = usuario.email.toLowerCase().includes(filtros.email.toLowerCase());
      const perfilMatch = filtros.perfil === 'todos' || usuario.role === filtros.perfil;

      return nomeMatch && emailMatch && perfilMatch;
    })
    .sort((a, b) => ordemAscendente
      ? a.nome.localeCompare(b.nome)
      : b.nome.localeCompare(a.nome)
    );

  if (carregando) {
    return (
      <section className="section is-responsive">
        <div className="container is-responsive">
          <div className="box has-shadow">
            <progress className="progress is-small is-primary" max="100">Carregando...</progress>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Layout titulo='Gerenciamento de Usuários'>
      <section className="section is-responsive has-shadowless">
        <div className="container is-responsive has-shadowless">
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          <div className="box has-shadowless is-dark" style={{ boxShadow: 'none' }}>
            {/* CABEÇALHO */}
            <div className="level">
              <div className="level-left">

                <span className="tag is-primary ml-3">
                  {usuariosFiltrados.length} usuário(s)
                </span>
              </div>
              <div className="level-right">
               
              </div>
            </div>

            {/* FILTROS */}
            <div className={`${isMobile ? 'columns is-mobile is-multiline' : 'field is-grouped is-grouped-multiline'} mb-5`}>
              <div className={`${isMobile ? 'column is-full' : 'control'} has-icons-left mb-3`}>
                <Input
                  label=''
                  className="input is-rounded is-responsive"
                  aditionalClassesControl='has-icons-left'
                  iconLeft={<FiSearch />}
                  type="text"
                  placeholder="Filtrar por nome..."
                  value={filtros.nome}
                  onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} />
              </div>

              <div className={`${isMobile ? 'column is-full' : 'control'} has-icons-left mb-3`}>
                <Input
                  label=''
                  aditionalClassesControl='has-icons-left'
                  iconLeft={<FiSearch />}
                  className="input is-rounded is-responsive"
                  type="text"
                  placeholder="Filtrar por e-mail..."
                  value={filtros.email}
                  onChange={(e) => setFiltros({ ...filtros, email: e.target.value })} />
              </div>

              <div className={`${isMobile ? 'column is-full' : 'control'} mb-3`}>
                <div className="field">
                  <div className="control is-expanded">
                    <div className="select is-rounded is-fullwidth">
                      <select
                        value={filtros.perfil}
                        onChange={(e) => setFiltros({ ...filtros, perfil: e.target.value as any })}
                      >
                        <option value="todos">Todos os perfis</option>
                        {Object.values(Role).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TABELA/LISTA DE USUÁRIOS */}
            <div className="table-container is-responsive">
              {usuariosFiltrados.length === 0 ? (
                <div className="notification is-light">
                  Nenhum usuário encontrado com os filtros aplicados.
                </div>
              ) : isMobile ? (
                <ListaMobile
                  usuarios={usuariosFiltrados}
                  usuarioExpandido={usuarioExpandido}
                  onToggleExpand={toggleExpandirUsuario}
                  onEdit={(usuario) => router.push(`/instituto-musical/autenticacao/cadastro-usuario/cadastroUsuarios?email=${usuario.email}`)}
                  onUpdatePassword={handleAtualizarSenha}
                  getIdComoString={getIdComoString}
                />
              ) : (
                <TabelaDesktop
                  usuarios={usuariosFiltrados}
                  usuarioExpandido={usuarioExpandido}
                  onToggleExpand={toggleExpandirUsuario}
                  ordemAscendente={ordemAscendente}
                  onToggleOrder={() => setOrdemAscendente(!ordemAscendente)}
                  onEdit={(usuario) => router.push(`/instituto-musical/autenticacao/cadastro-usuario/cadastroUsuarios?email=${usuario.email}`)}
                  onUpdatePassword={handleAtualizarSenha}
                  getIdComoString={getIdComoString}
                />
              )}
            </div>
          </div>
        </div>


        <AtualizarSenhaModal
          isOpen={showModal}
          onClose={() => fecharModal()}
          email={emailSelecionado}
        />
      </section>
    </Layout>
  );
};

// Componente para lista mobile
const ListaMobile: React.FC<{
  usuarios: Usuario[];
  usuarioExpandido: string | null;
  onToggleExpand: (usuarioId: string) => void;
  onEdit: (usuario: Usuario) => void;
  onUpdatePassword: (usuario: Usuario) => void;
  getIdComoString: (usuario: Usuario) => string;
}> = ({ usuarios, usuarioExpandido, onToggleExpand, onEdit, onUpdatePassword, getIdComoString }) => (
  <div className="content">
    {usuarios.map(usuario => {
      const usuarioIdString = getIdComoString(usuario);
      return (
        <div key={usuarioIdString} className="box mb-3" style={{ padding: '.10rem' }}>
          <div
            className="is-flex is-justify-content-space-between is-align-items-center is-clickable"
            onClick={() => onToggleExpand(usuarioIdString)}
          >
            <div className="is-flex-grow-1">
              <p className="has-text-weight-bold mb-1">{usuario.nome}</p>
              <p className="is-size-7 has-text-grey mb-1">{usuario.email}</p>
              <p className="is-size-7">Perfil: {usuario.role}</p>
            </div>
            <div className="is-flex is-align-items-center">
              <span className={`tag ${getRoleColor(usuario.role)} mr-2`}>
                {usuario.role}
              </span>
              {usuarioExpandido === usuarioIdString ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>

          {usuarioExpandido === usuarioIdString && (
            <div className="mt-3 pt-3 border-top">
              <div className="content is-small">
                <p><strong>E-mail:</strong> {usuario.email}</p>

                <p><strong>Telefones:</strong> {usuario.telefone}</p>
              </div>

              <div>
                {usuario.endereco && (
                  <div>
                    <strong>Endereço:</strong>

                    <p key={usuario.endereco.id} className="ml-2">
                      {usuario.endereco.rua}, {usuario.endereco.numero} - {usuario.endereco.bairro}<br />
                      {usuario.endereco.cidade}/{usuario.endereco.estado} - CEP: {usuario.endereco.cep}
                    </p>

                  </div>
                )}
              </div>


              <div className="buttons are-small is-flex is-justify-content-space-between mt-3">
                <CustomButton
                  icon={<FiEdit />}
                  text='Editar'
                  onClick={() => onEdit(usuario)}
                  className="button is-primary is-light is-flex-grow-1 mx-1"
                />
                <CustomButton
                  icon={<FiRefreshCw />}
                  text='Senha'
                  onClick={() => onUpdatePassword(usuario)}
                  className="button is-warning is-light is-flex-grow-1 mx-1"
                />
              </div>
            </div>
          )
          }
        </div >
      );
    })}
  </div >
);

// Componente para tabela desktop
const TabelaDesktop: React.FC<{
  usuarios: Usuario[];
  usuarioExpandido: string | null;
  onToggleExpand: (usuarioId: string) => void;
  ordemAscendente: boolean;
  onToggleOrder: () => void;
  onEdit: (usuario: Usuario) => void;
  onUpdatePassword: (usuario: Usuario) => void;
  getIdComoString: (usuario: Usuario) => string;
}> = ({ usuarios, usuarioExpandido, onToggleExpand, ordemAscendente, onToggleOrder, onEdit, onUpdatePassword, getIdComoString }) => (
  <div className="table-wrapper" style={{ overflowX: 'auto' }}>
    <table className="table is-fullwidth is-striped is-hoverable">
      <thead>
        <tr>
          <th style={{ width: '30px' }}></th>
          <th>
            <div className="is-flex is-align-items-center">
              <span>Nome</span>
              <CustomButton
                icon={ordemAscendente ? <FiArrowUp /> : <FiArrowDown />}
                text=""
                onClick={onToggleOrder}
                className="button is-small is-text ml-2"
              />
            </div>
          </th>
          <th>E-mail</th>
          <th>Telefone</th>
          <th>Perfil</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map(usuario => {
          const usuarioIdString = getIdComoString(usuario);
          return (
            <>
              <tr key={usuarioIdString} className={usuarioExpandido === usuarioIdString ? 'has-background-light' : ''}>
                <td>
                  <CustomButton
                    icon={usuarioExpandido === usuarioIdString ? <FiChevronUp /> : <FiChevronDown />}
                    text=""
                    onClick={() => onToggleExpand(usuarioIdString)}
                    className="button is-small is-text"
                  />
                </td>
                <td className="has-text-weight-semibold">{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                  {usuario.telefone ? (
                    <span>{usuario.telefone}</span>
                  ) : (
                    <span className="has-text-grey">Não informado</span>
                  )}
                </td>
                <td>
                  <span className={`tag ${getRoleColor(usuario.role)}`}>
                    {usuario.role}
                  </span>
                </td>
                <td>
                  <div className="buttons are-small">
                    <CustomButton
                      icon={<FiEdit />}
                      text={''}
                      onClick={() => onEdit(usuario)}
                      className="button is-primary is-light"
                      title="Editar"
                    />

                    <CustomButton
                      icon={<FiRefreshCw />}
                      text={''}
                      onClick={() => onUpdatePassword(usuario)}
                      className="button is-warning is-light"
                      title="Atualizar Senha"
                    />
                  </div>
                </td>
              </tr>
              {usuarioExpandido === usuarioIdString && (
                <tr key={`${usuarioIdString}-details`} className="has-background-light">
                  <td colSpan={6}>
                    <div className="content is-small p-4">
                      <div className="columns is-multiline">
                        <div className="column is-6">
                          <p><strong>E-mail:</strong> {usuario.email}</p>
                          <p><strong>Perfil:</strong> {usuario.role}</p>
                          <p><strong>Telefones:</strong> {usuario.telefone}</p>
                        </div>
                        <div className="column is-6">
                        </div>

                        <div className="column is-7">
                          <strong>Endereço:</strong>

                          <div key={usuario.endereco.id} className="ml-2">
                            <p>{usuario.endereco.rua ? usuario.endereco.rua : 'logadouro nao especificado'}, {usuario.endereco.numero}</p>
                            <p>{usuario.endereco.bairro} - {usuario.endereco.cidade}/{usuario.endereco.estado}</p>
                            <p>CEP: {usuario.endereco.cep}</p>
                            {usuario.endereco.complemento && <p>Complemento: {usuario.endereco.complemento}</p>}

                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          );
        })}
      </tbody>
    </table>
  </div>
);



// Função auxiliar para cores dos perfis
const getRoleColor = (role: Role): string => {
  switch (role) {
    case Role.ADMIN:
      return 'is-danger';
    case Role.PROFESSOR:
      return 'is-warning';
    case Role.ALUNO:
      return 'is-primary';
    case Role.CLIENTE:
      return 'is-info';
    default:
      return 'is-light';
  }
};

export default GerenciamentoUsuarios;