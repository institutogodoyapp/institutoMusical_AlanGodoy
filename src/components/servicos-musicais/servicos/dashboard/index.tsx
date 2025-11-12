import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiUsers, FiMusic, FiDollarSign, FiTrendingUp, FiCalendar, FiClock, FiBarChart2, FiPlus, FiFilter, FiTool } from 'react-icons/fi';
import { CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { useServicoService } from '@/app/services/servicos-musicais/servico/servico.service';
import { MetricasServico, Servico } from '@/app/models/Servicos-musicais/servico';
import { FaTrash } from 'react-icons/fa';
import { usePedidoService } from '@/app/services/servicos-musicais/pedidos/pedido.service';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import CardList from '@/components/common/tableMobile';
import { Input } from '@/components/common/input';
import MetricaCard from '../../../common/metricaComponent';
import { BiSolidCategory } from 'react-icons/bi';

export const DashboardServicosMusicais: React.FC = () => {
  // ========== ROUTER E SERVICES ==========
  const router = useRouter();
  const servicosService = useServicoService();
  const servicosPedido = usePedidoService();

  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [metrica, setMetrica] = useState<MetricasServico | null>(null);

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState<boolean>(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroNome, setFiltroNome] = useState<string>('');

  // ========== EFEITOS ==========
  useEffect(() => {
    carregarDados();
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO ==========
  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [responseServicos, responseMetricas] = await Promise.all([
        servicosService.getServicos(),
        servicosPedido.getMetricas()
      ]);
      setServicos(responseServicos);
      console.log(responseServicos)
      setMetrica(responseMetricas);
    } catch (error) {
      showError('Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  };

  // ========== FUNÇÕES DE FORMATAÇÃO ==========
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarDuracao = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}min` : `${mins}min`;
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const navegarParaCadastroServico = () => {
    router.push('/instituto-musical/servicos-musicais/cadastrar-servico');
  };

  const navegarParaCadastroCategoria = () => {
    router.push('/instituto-musical/servicos-musicais/categoria-servico');
  };

  const navegarParaDetalhesServico = (id: number) => {
    router.push(`admin/servicos-musicais/servico/${id}`);
  };

  // ========== FILTROS E DERIVAÇÕES ==========
  const servicosFiltrados = servicos.filter(servico => {
    const categoriaMatch = filtroCategoria === 'todos' || String(servico.categoriaId) === filtroCategoria;
    const nomeMatch = servico.nome.toLowerCase().includes(filtroNome.toLowerCase());
    return categoriaMatch && nomeMatch;
  });

  const categoriasDisponiveis = [...new Set(servicos.map(s => s.categoria))];

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
  if (carregando) {
    return (
      <Layout titulo="Dashboard - Serviços Musicais">
        <div className="container mt-6">
          <div className="notification is-info is-light">Carregando dados do dashboard...</div>
        </div>
      </Layout>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Dashboard - Serviços Musicais">
      <div className="container mt-6">
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />

        {/* CARDS DE ESTATÍSTICAS */}



        <div className="columns is-multiline is-mobile mb-6">
          <MetricaCard
            titulo='Total de Serviços'
            valor={metrica?.totalServicos ? metrica.totalServicos : 0}
            cor={"info"} />

           <MetricaCard
            titulo='Faturamento Mensal'
            valor={metrica?.clientes ? metrica.clientes : ''}
            cor={"info"} />

          <MetricaCard
            titulo='Faturamento Mensal'
            valor={formatarMoeda(metrica?.faturamentoTotalAnual ? metrica.faturamentoTotalAnual : 0)}
            cor={"info"} />
        </div>

        {/* HEADER COM FILTROS E AÇÕES */}
        <div className="box" style={{ boxShadow: 'none' }}>
          <div className="level is-mobile">
            <div className="level-left">
              <h2 className="title is-4 is-hidden-mobile">Serviços Musicais</h2>
            </div>
            <div className="level-right">
              <CustomButton
                text={<span className="">Novo Serviço</span>}
                icon={<FiPlus />}
                onClick={navegarParaCadastroServico}
                className="is-small-mobile"
                style={{ borderRadius: '6px' }}
              />

              <CustomButton
                text={<span className="">Categoria</span>}
                icon={<BiSolidCategory />}
                onClick={navegarParaCadastroCategoria}
                className="is-small-mobile"
                style={{ borderRadius: '6px', marginLeft: '8px' }}
              />
            </div>
          </div>

          {/* FILTROS */}
          <div className="columns is-multiline is-mobile">
            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
                      <option value="todos">Todas categorias</option>
                      {categoriasDisponiveis.map((categoria, index) => (
                        <option key={index} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>


            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <div className="control">
                  <CustomButton
                    text="Limpar Filtros"
                    onClick={() => {
                      setFiltroCategoria('todos');
                      setFiltroNome('');
                    }}
                    className="is-fullwidth is-outlined"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LISTA DE SERVIÇOS */}
          <div className="table-container is-scrollable">
            {/* TABELA DESKTOP */}
            <table className="table is-fullwidth is-striped is-hoverable is-hidden-mobile">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Duração</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicosFiltrados.length > 0 ? servicosFiltrados.map(servico => (
                  <tr key={servico.id} className="is-clickable">
                    <td>
                      <div>
                        <p className="has-text-weight-semibold">{servico.nome}</p>
                        <p className="is-size-7 has-text-grey">{servico.descricao}</p>
                      </div>
                    </td>
                    <td>{servico.categoria.nome}</td>
                    <td className="has-text-weight-semibold">{formatarMoeda(servico.precoHora)}</td>
                    <td>
                      <span className="icon-text">
                        <span className="icon"><FiClock /></span>
                        <span>{formatarDuracao(servico.horasEstimadas)}</span>
                      </span>
                    </td>
                    <td>
                      <div className="buttons are-small">
                        <button
                          className="button is-danger is-light"
                          title="Ver detalhes"
                          onClick={() => navegarParaDetalhesServico(servico.id)}
                        >
                          <span className="icon"><FaTrash /></span>
                        </button>
                        <button
                          className="button is-info is-light"
                          title="Editar serviço"
                          onClick={() => router.push(`/servicos-musicais/cadastrar-servico?id=${servico.id}`)}
                        >
                          <span className="icon"><FiPlus /></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="has-text-centered">
                      <div className="notification is-light">
                        Nenhum serviço encontrado com os filtros atuais
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* CARDS MOBILE */}
            {servicosFiltrados.length > 0 ? (
              <CardList
                data={servicosFiltrados}
                icon={<FiTool /> }
                iconColor='is-primary-custom'
                titleField='nome'
                subtitleField='categoriaNome'
                fields={[
                  { label: 'Descricao', key: 'descricao' },
                ]}
                tags={[
                  { label: 'Preço/hr', key: 'precoHora', color: 'is-primary-custom', defaultValue: 0, prefix: 'R$ ' },
                  { label: 'Tempo Estimado:', key: 'horasEstimadas', color: 'is-info' }
                ]}
                actions={[]}
              />
            ) : (
              <div className="column is-12">
                <div className="notification is-light">
                  Nenhum serviço encontrado com os filtros atuais
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardServicosMusicais;