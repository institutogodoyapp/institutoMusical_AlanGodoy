import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSave, FiX, FiDollarSign, FiClock, FiFileText, FiTag } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { useCategoriaService } from '@/app/services/servicos-musicais/servico/categoria.service';
import { CategoriaServico } from '@/app/models/Servicos-musicais/categoria-servico';
import { useServicoService } from '@/app/services/servicos-musicais/servico/servico.service';
import { Servico, ServicoForm } from '@/app/models/Servicos-musicais/servico';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';
import { voltar } from '@/util/navegacao';




export const NovoServicePage: React.FC = () => {
  const router = useRouter();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();
  const serviceCat = useCategoriaService()
  const service = useServicoService()
  const [carregando, setCarregando] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [isServicoLoaded, setIsServicoLoaded] = useState<boolean>(false);

  const { id } = router.query;

  const servicoId = Number(id)
  const [formData, setFormData] = useState<ServicoForm>({
    id: 0,
    nome: '',
    descricao: '',
    precoHora: 0,
    horasEstimadas: 60,
    categoriaId: 0,
    observacao: '',
  });


  useEffect(() => {
    // Carregar categorias da API
    const carregarCategorias = async () => {
      try {
        // Simulação - substituir pela sua API
        const categorias = await serviceCat.getCategorias()
        setCategorias(categorias);
      } catch (error) {
        showError('Erro ao carregar categorias');
      }
    };
    carregarCategorias();
  }, []);

  useEffect(() => {
    if (servicoId && !isServicoLoaded) {
      service.getServicoById(servicoId)
        .then(servicoEncontrado => {
          setFormData({
            ...formData,
            id: servicoEncontrado.id,
            nome: servicoEncontrado.nome,
            descricao: servicoEncontrado.descricao,
            precoHora: servicoEncontrado.precoHora,
            horasEstimadas: servicoEncontrado.horasEstimadas,
            categoriaId: servicoEncontrado.categoriaId ? servicoEncontrado.categoria.id : 0,
            observacao: servicoEncontrado.observacao ? servicoEncontrado.observacao : '',


          });
          setIsServicoLoaded(true);

        })
        .catch(err => {
          console.error('Erro ao carregar aluno:', err);
          showError('Não foi possível carregar os dados do aluno.');
        });
    }
  }, [id, service]);


  const handleSubmit = async (e: React.FormEvent) => {
    let errorMsg = `${servicoId ? 'Erro ao Atualizar serviço' : 'Erro ao salvar serviço'} `;
    let sucessMsg = `${servicoId ? 'Serviço atualizado com sucesso!' : 'Serviço cadastrado com sucesso!'} `;
    e.preventDefault();


    try {
      setCarregando(true);

      console.log('Dados do serviço:', formData);



      if (formData.id) {

        await service.atualizarServico(formData.id, formData);


      } else {

        const response = await service.salvarServico(formData)
        setFormData(response);

      }

    } catch (err: any) {
      console.error('Erro no cadastro:', err);


      showError(errorMsg);

    } finally {
      showSuccess(sucessMsg)
      setCarregando(false);
      if (sucessMsg) {
        setFormData({
          id: 0,
          nome: '',
          descricao: '',
          precoHora: 0,
          horasEstimadas: 60,
          categoriaId: 0,
          observacao: '',
        });

      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    console.log(value)
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <Layout titulo={servicoId ? 'Atualizar Serviço' : 'Novo Serviço Musical'}>
      <div className="container mt-6">
        <div className="box" style={{ boxShadow: 'none' }}>
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />
          <form onSubmit={handleSubmit}>
            <div className="columns is-multiline">


              {/* Informações Básicas */}
              <div className="column is-12">
                <h3 className="title is-5">Informações Básicas</h3>
              </div>

              <div className="column is-12-mobile is-6-tablet">
                <Input

                  label='Quantidade *'
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Aulas de Piano Avançado"
                  required />
              </div>

              <div className="column is-12-mobile is-6-tablet">
                <div className="field">
                  <label className="label">Categoria *</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="categoriaId"
                        value={formData.categoriaId}
                        onChange={handleChange}
                        required
                      >
                        <option value={0}>Selecione uma categoria</option>
                        {categorias.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-12">
                <div className="field">
                  <label className="label">Descrição</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      placeholder="Descreva detalhadamente o serviço..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Preço e Duração */}
              <div className="column is-12">
                <h3 className="title is-5">Configurações</h3>
              </div>

              <div className="column is-12-mobile is-6-tablet">
                <Input
                  label='Preço (R$) *'
                  iconLeft={<FiDollarSign />}
                  aditionalClassesControl='has-icons-left'
                  type="number"
                  name="precoHora"
                  value={formData.precoHora}
                  onChange={handleChange}
                  required />
              </div>

              <div className="column is-12-mobile is-6-tablet">
                <Input
                  label='Tempo Estimado (minutos) *'
                  iconLeft={<FiClock />}
                  aditionalClassesControl='has-icons-left'
                  type="number"
                  name="horasEstimadas"
                  value={formData.horasEstimadas}
                  onChange={handleChange}
                  min="15"
                  step="15"
                  required />
              </div>



              {/* Ações */}
              <div className="column is-12">
                <div className="field is-grouped">
                  <div className="control">
                    <CustomButton
                      type="button"
                      text="Cancelar"
                      icon={<FiX />}
                      className="is-light"
                      onClick={voltar}
                    />
                  </div>
                  <div className="control">
                    <CustomButton
                      type="submit"
                      text="Salvar Serviço"
                      icon={<FiSave />}
                      className="is-primary"
                      disabled={carregando}
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

export default NovoServicePage;