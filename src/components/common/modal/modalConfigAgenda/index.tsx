// @/components/agenda/ConfigAgendaModal.tsx
import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaClock, FaCalendarDay, FaSpinner, FaCog } from 'react-icons/fa';
import { CustomButton } from '@/components';
import { ConfigAgenda, DIAS_SEMANA, DiaSemana } from '@/app/models/escola/aula/configAgenda';
import { useConfigAgendaService } from '@/app/services/escola/aula/agendaConfig.service';

interface ConfigAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  professorId?: number;
  onConfigUpdate?: (config: ConfigAgenda) => void;
}

export const ConfigAgendaModal: React.FC<ConfigAgendaModalProps> = ({
  isOpen,
  onClose,
  professorId,
  onConfigUpdate
}) => {
  const configService = useConfigAgendaService();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [config, setConfig] = useState<ConfigAgenda>(configService.getDefaultConfig());

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen, professorId]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const configData = await configService.getConfig();
      setConfig(configData);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      setConfig(configService.getDefaultConfig());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedConfig = await configService.updateConfig(config);
      setConfig(updatedConfig);
      onConfigUpdate?.(updatedConfig);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('Erro ao salvar configuração');
    } finally {
      setSaving(false);
    }
  };

  

  const handleHorarioChange = (field: 'horaInicio' | 'horaFim', value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIntervaloChange = (value: number) => {
    setConfig(prev => ({
      ...prev,
      duracaoAulaMinutos: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '600px' }}>
        <header className="modal-card-head">
          <p className="modal-card-title">
            <FaCog className="mr-2" />
            Configuração da Agenda
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body">
          {loading ? (
            <div className="has-text-centered">
              <FaSpinner className="fa-spin" />
              <p>Carregando configuração...</p>
            </div>
          ) : (
            <>
              

              {/* Horários */}
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label has-text-weight-semibold">
                      <FaClock className="mr-2" />
                      Horário Início
                    </label>
                    <div className="control">
                   
                      <input
                        type="time"
                        className="input"
                        value={config.horaInicio}
                        onChange={(e) => handleHorarioChange('horaInicio', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label has-text-weight-semibold">
                      <FaClock className="mr-2" />
                      Horário Fim
                    </label>
                    <div className="control">
                      <input
                        type="time"
                        className="input"
                        value={config.horaFim}
                        onChange={(e) => handleHorarioChange('horaFim', e.target.value)}
                        min={config.horaInicio}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Intervalo */}
              <div className="field">
                <label className="label has-text-weight-semibold">
                  Duração das Aulas (minutos)
                </label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={config.duracaoAulaMinutos}
                      onChange={(e) => handleIntervaloChange(Number(e.target.value))}
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={45}>45 minutos</option>
                      <option value={60}>60 minutos</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        <footer className="modal-card-foot is-justify-content-flex-end">
          <CustomButton
            type="button"
            text= 'Cancelar'
            icon={<FaTimes className="mr-2" />}
            className="is-light"
            onClick={onClose}
            disabled={saving}
          />
         
          <CustomButton
            type="button"
            icon={<FaSave className="mr-2" />}
            className="is-primary"
            onClick={handleSave}
            text={'Salvar'}
           // loading={saving}
            disabled={saving}
          />
          
        </footer>
      </div>
    </div>
  );
};