import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiTag } from 'react-icons/fi';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { CategoriaServico, CategoriaServicoForm } from '@/app/models/Servicos-musicais/categoria-servico';
import { useCategoriaService } from '@/app/services/servicos-musicais/servico/categoria.service';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import CardList from '@/components/common/tableMobile';
import { Input } from '@/components/common/input';
import { FaBriefcase, FaBuilding, FaPalette, FaTools, FaVolumeUp } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { BiCategory, BiSolidCategory } from 'react-icons/bi';

export const GerenciamentoCategoriasPage: React.FC = () => {
  // ========== ROUTER E SERVICES ==========
  const router = useRouter();
  const serviceCat = useCategoriaService();

  const {
    notifications,
    showSuccess,
    showWarning,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaServico | null>(null);
  const [formData, setFormData] = useState<CategoriaServicoForm>({
    id: 0,
    nome: '',
    descricao: ''
  });

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState(true);
  const [filtroNome, setFiltroNome] = useState('');
  const [modalAberto, setModalAberto] = useState<boolean>(false);

  // ========== EFEITOS ==========
  useEffect(() => {
    carregarCategorias();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO ==========
  const carregarCategorias = async () => {
    try {
      const response = await serviceCat.getCategorias();
      setCategorias(response);
    } catch (error) {
      showError('Erro ao carregar categorias');
    } finally {
      setCarregando(false);
    }
  };

  // ========== FUNÇÕES DE MODAL ==========
  const abrirModal = (categoria: CategoriaServico | null = null) => {
    if (categoria?.id) {
      setCategoriaEditando(categoria);
      setFormData(categoria);
    } else {
      setFormData({ id: 0, nome: '', descricao: '' });
    }

    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCategoriaEditando(null);
    console.log(categoriaEditando);
  };

  // ========== FUNÇÕES DE CRUD ==========
  const salvarCategoria = async (dados: DadosModal) => {
    try {
      console.log(dados);
      let response;

      if (categoriaEditando?.id) {
        const dadosEdit = {
          ...dados,
          servicosCount: 0
        };
        response = await serviceCat.atualizarCategoria(categoriaEditando.id, dadosEdit);
      } else {
        response = await serviceCat.salvarCategoria(dados);
      }

      await carregarCategorias();
      fecharModal();
    } catch (err) {
      showError('Erro ao salvar Categoria');
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      setCategorias(prev => prev.map(cat =>
        cat.id === id ? { ...cat, ativo: !cat.ativo } : cat
      ));
    } catch (error) {
      showError('Erro ao alterar status');
    }
  };

    const handleDeleteCategoria = async (categoria: CategoriaServico) => {
      try {
        if (confirm("Tem certeza que deseja excluir esta despesa?")) {
          if (!categoria.comServico) {
            await serviceCat.deletarCategoria(categoria.id);
            setCategorias(prev => prev.filter(d => d.id !== categoria.id));
          } else {
             showWarning('Não é possivel excluir categoria com serviço associado');
          }
        }
      } catch (error) {
        showError('Falha ao deletar. Tente novamente.');
      }
    };

  // ========== CONFIGURAÇÕES ==========
  const camposCategoria: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'nome',
      label: 'Categoria',
      placeholder: "Ex: Alguel salas..",
      required: true
    },

    {
      tipo: 'text',
      nome: 'descricao',
      label: 'Descrição',
      placeholder: "Ex: Essa categoria se refere a...",
      required: true
    }
  ];

  // ========== FILTROS E DERIVAÇÕES ==========
  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(filtroNome.toLowerCase())

  );
console.log("filtrada", categoriasFiltradas)
console.log("carre", categorias)
  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando) {
    return (
      <div className="container mt-6">
        <div className="notification is-info is-light">Carregando categorias...</div>
      </div>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Gerenciamento de Categorias">
      <div className="container mt-6">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />

        <div className="box" style={{ boxShadow: 'none' }}>
          {/* HEADER */}
          <div className="level is-mobile">
            <div className="level-left">
              <h2 className="title is-4 is-hidden-mobile">Categorias de Serviço</h2>
            </div>
            <div className="level-right">
              <CustomButton
                text="Nova Categoria"
                icon={<FiPlus />}
                onClick={() => abrirModal()}
                className="is-primary"
              />
            </div>
          </div>

          {/* FILTRO */}
          <div className="columns">
            <div className="column is-12-mobile is-6-tablet is-4-desktop">
              <Input
                label=''
                type="text"
                aditionalClassesControl='has-icons-left'
                iconLeft={<FiSearch />}
                placeholder="Filtrar por nome"
                value={filtroNome}
                onChange={e => setFiltroNome(e.target.value)}
                required />
            </div>
          </div>

          {/* LISTA DE CATEGORIAS */}
          {categoriasFiltradas.length > 0 ? (
           
              <CardList
      
              hiddenBreakpoint='none'
                data={categoriasFiltradas}
                icon={<BiSolidCategory />}
                iconColor='has-primary-custom'
                titleField='nome'
                subtitleField='descricao'
                fields={[
                
                ]}
                tags={[
                  { label: 'Serviços', key: 'servicosCount', color: 'is-primary-custom' },
                  { label: 'Criada em:', key: 'dataCriacao', color: 'is-primary-custom' }
                ]}
                actions={[
                  {
                    label: '',
                    color: 'is-info is-light',
                    onClick: (item) => abrirModal(item),
                    icon: <FiEdit />
                  },
                  {
                    label: `Excluir`,
                    color: 'is-danger is-light',
                    onClick: (item) => handleDeleteCategoria(item),
                  }
                ]}
              />
            
          ) : (
            <div className="column is-12">
              <div className="notification is-light">
                Nenhum categoria encontrado
              </div>
            </div>
          )}
           </div>
        </div>


      {/* MODAL */}
      <ModalGenerico
        isOpen={modalAberto}
        onClose={() => fecharModal()}
        dados={categoriaEditando}
        onSave={salvarCategoria}
        titulo={categoriaEditando?.id ? 'Editar Categoria' : 'Nova Categoria'}
        campos={camposCategoria}
        textoBotaoSalvar="Salvar"
      />
    </Layout>
  );
};

export default GerenciamentoCategoriasPage;