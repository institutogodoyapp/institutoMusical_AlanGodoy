import {
  FaUser, FaUserPlus, FaMusic, FaChalkboardTeacher, FaCalendarAlt,
  FaClock, FaChartBar, FaFileInvoiceDollar, FaHome, FaExclamationTriangle, FaBell
} from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAlunoService } from '@/app/services';

interface ProximasAulasProps {
  id: number;
  dataHora: string;
  alunoNome: string;
  professorNome: string;
  instrumentoNome: string;
  status: string;
  duracao: string;
}

interface CardsAvisosProps {
  title: string;
  icon: any;
  proximasAulas: ProximasAulasProps[];
  loading: boolean;
}

export const CardsAvisos: React.FC<CardsAvisosProps> = ({
  title,
  icon,
  proximasAulas
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [aulasAgendadas, setAulasAgendadas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const service = useAlunoService();

  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 1024);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const convertToISOFormat = (dataHora: string) => {
    const [day, month, yearAndTime] = dataHora.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hour, minute] = time.split(':');
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  };

  const formatDate = (dataHora: string) => {
    const formattedDataHora = convertToISOFormat(dataHora);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const aulaData = new Date(formattedDataHora);
    if (aulaData.toDateString() === today.toDateString()) {
      return `Hoje - ${dataHora}`;
    }
    if (aulaData.toDateString() === tomorrow.toDateString()) {
      return `Amanhã - ${dataHora}`;
    }
    return aulaData.toLocaleDateString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAulas = await service.getAulasSemana();

        // Obter a data/hora atual para comparar
        const agora = new Date().getTime();

        // Converter, filtrar e ordenar as aulas por data/hora
        const aulasOrdenadas = Array.isArray(responseAulas)
          ? responseAulas
            .map(aula => ({
              ...aula,
              // Criar um timestamp para ordenação
              timestamp: new Date(convertToISOFormat(aula.dataHora)).getTime()
            }))
            .filter(aula => aula.timestamp > agora) // Filtrar apenas aulas futuras
            .sort((a, b) => a.timestamp - b.timestamp) // Ordenar do mais próximo para o mais distante
            .slice(0, 3) // Limitar a 3 aulas
          : [responseAulas]
            .filter(aula => {
              const timestamp = new Date(convertToISOFormat(aula.dataHora)).getTime();
              return timestamp > agora;
            })
            .slice(0, 3);
        setAulasAgendadas(aulasOrdenadas);
      } catch (error) {
        console.error('Erro ao buscar os dados da API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //=========================== ROTAS ===============================//

  const irParaAgendaCompleta: string = '/instituto-musical/escola/aula/agenda'

  if (loading) {
    return <div>Carregando aulas...</div>;
  }

  return (
    <div className="column is-8-mobile is-4-tablet" style={{ minWidth: isMobile ? '70vw' : '30vw' }}>
      <div className="box" style={{ borderRadius: '10px', padding: isMobile ? '.8rem' : '1.5rem', boxShadow: isMobile ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.15)' }}>
        <div className="mb-5">
          <h2 className="title is-4 has-text-weight-bold mb-5">
            <span className="icon-text">
              <span className="icon has-primary-custom mt-4">{icon}</span>
              <span className="menu-label" style={{ color: "#555", fontSize: "1.2rem", fontWeight: "bold", marginLeft: '4px' }}>{title}</span>
            </span>
          </h2>
          <div className="content">
            {aulasAgendadas.length > 0 ? (
              aulasAgendadas.map((aula) => (
                <div key={aula.id} className="mb-4">
                  <div className="is-flex is-justify-content-space-between is-align-items-center">
                    <div>
                      <span className={`tag ${aula.status === 'AGENDADA' ? 'is-success' : 'is-warning'} is-light mr-3`}>
                        {aula.status}
                      </span>
                      <span className="has-text-weight-semibold">{aula.dataHora}</span>
                    </div>
                  </div>
                  <div className="mt-2 ml-1">
                    <p className="is-size-6 has-text-dark mb-1">
                      <span className="icon is-small"><FaUser size={12} /></span>
                      {aula.alunoNome} - {aula.instrumentoNome}
                    </p>
                    <p className="is-size-6 has-text-grey">
                      <span className="icon is-small"><FaChalkboardTeacher size={12} /></span>
                      {aula.professorNome}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma aula agendada.</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
