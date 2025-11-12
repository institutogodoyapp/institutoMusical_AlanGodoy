import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers, FiCalendar, FiChevronRight, FiBarChart2, FiPackage, FiTarget } from 'react-icons/fi';
import { Card, CustomButton, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { MetricasVendas, Venda } from '@/app/models/loja/venda';
import { Produto } from '@/app/models/loja/produto';
import { useProdutoService } from '@/app/services/loja/produto/produto.service';
import { useVendaService } from '@/app/services/loja/venda/venda.service';
import { formatarMoeda } from '@/util';

export const DashboardVendas: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const router = useRouter();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();
  const serviceProd = useProdutoService();
  const serviceVendas = useVendaService();

  // ========== ESTADOS DE DADOS ==========
  const [vendasRecentes, setVendasRecentes] = useState<Venda[]>([]);
  const [metrica, setMetrica] = useState<MetricasVendas | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // ========== ESTADOS DE UI ==========
  const [carregando, setCarregando] = useState<boolean>(true);
  const [periodo, setPeriodo] = useState<string>('hoje');

  // ========== EFEITOS ==========
  useEffect(() => {
    carregarVendas();
  }, [periodo]);

  // ========== FUNÇÕES DE API ==========
  const carregarVendas = async () => {
    setCarregando(true);
    try {
      const responseVendas = await serviceVendas.getVendas();
      setVendasRecentes(obterUltimasVendas(responseVendas));
      const responseMetricas = await serviceVendas.getMetricsVendas();
      setMetrica(responseMetricas);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      showError('Erro ao carregar vendas');
    } finally {
      setCarregando(false);
    }
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const obterUltimasVendas = (vendas: Venda[] | Venda) => {
    const agora = new Date().getTime();
    const vendasArray = Array.isArray(vendas) ? vendas : [vendas];

    return vendasArray
      .map(venda => ({
        ...venda,
        timestamp: new Date(venda.data).getTime()
      }))
      .filter(venda => venda.timestamp <= agora)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
  };

  // ========== FUNÇÕES DE NAVEGAÇÃO ==========
  const acessarNovaVenda = () => router.push('/instituto-musical/loja/venda');
  const acessarGestaoVendas = () => router.push('/instituto-musical/loja/venda/gerenciamento');
  const acessarGestaoProdutos = () => router.push('/instituto-musical/loja/produto/controle-estoque');

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const moeda = formatarMoeda(metrica?.faturamentoTotalAnual);

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <Layout titulo="Dashboard de Vendas">
      <div className="container mt-6">
        {/* Cards de Métricas */}
        <div className="columns is-multiline is-mobile">
          <Card 
            titulo='Faturamento Total' 
            valor={String(moeda)} 
            cor='success' 
            icone={<FiDollarSign />} 
          />
          <Card 
            titulo='Vendas Realizadas' 
            valor={metrica?.vendasRealizadas ? metrica.vendasRealizadas : 0} 
            cor='success' 
            icone={<FiShoppingCart />} 
          />
        </div>

        <div className="columns">
          <div className="column is-8">
            {/* Ações Rápidas */}
            <div className="box" style={{ boxShadow: 'none' }}>
              <div className="mt-5">
                <h4 className="title is-6">Ações Rápidas</h4>
                <div className="buttons">
                  <CustomButton
                    text="Gestão de Produtos"
                    icon={<FiPackage />}
                    onClick={acessarGestaoProdutos}
                    className="is-light"
                    style={{ borderRadius: '6px' }}
                  />

                  <CustomButton
                    text="Gestão de Vendas"
                    icon={<FiShoppingCart />}
                    onClick={acessarGestaoVendas}
                    className="is-light"
                    style={{ borderRadius: '6px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendas Recentes */}
        <div className="box" style={{ boxShadow: 'none' }}>
          <h3 className="title is-5">Vendas Recentes</h3>
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Data</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {vendasRecentes.map((venda, index) => (
                  <tr key={venda.id || index}>
                    <td>{venda.clienteNome}</td>
                    <td>
                      {venda.itens && venda.itens.length > 0
                        ? venda.itens.map(item => item.produtoNome).join(', ')
                        : 'Sem produtos'
                      }
                    </td>
                    <td>{venda.data}</td>
                    <td>{formatarMoeda(venda.valorTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardVendas;