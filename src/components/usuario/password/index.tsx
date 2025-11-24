import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ModalGenerico, CampoModal, DadosModal, RenderCampoPersonalizado } from '@/components/common/modal/modal-generico';
import { useUsuarioService } from '@/app/services';
import { useNotifications } from '@/components/common/notificacao/hookNotify/usoSimples';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaLock } from 'react-icons/fa';
import { MudancaSenhaRequest } from '@/app/models/usuario';

interface AtualizarSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export const AtualizarSenhaModal: React.FC<AtualizarSenhaModalProps> = ({
  isOpen,
  onClose,
  email
}) => {
  const router = useRouter();
  const { atualizarSenha } = useUsuarioService();

  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  const [carregando, setCarregando] = useState(false);
  const [mostrarSenhas, setMostrarSenhas] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false
  });

  const [erros, setErros] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  // DEBUG: Verificar se o email está chegando
  useEffect(() => {
   
  }, [email]);

  // Limpar erros quando o modal abrir/fechar
  useEffect(() => {
    if (!isOpen) {
      setErros({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
      setMostrarSenhas({
        senhaAtual: false,
        novaSenha: false,
        confirmarSenha: false
      });
    }
  }, [isOpen]);

  const campos: CampoModal[] = [
    {
      tipo: 'password',
      nome: 'senhaAtual',
      label: 'Senha Atual',
      placeholder: 'Digite sua senha atual',
      required: true
    },
    {
      tipo: 'password',
      nome: 'novaSenha',
      label: 'Nova Senha',
      placeholder: 'Digite a nova senha',
      required: true
    },
    {
      tipo: 'password',
      nome: 'confirmarSenha',
      label: 'Confirmar Nova Senha',
      placeholder: 'Confirme a nova senha',
      required: true
    }
  ];

  const validarFormulario = (dados: DadosModal): boolean => {
    const novosErros = {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    };

    let valido = true;

    if (!dados.senhaAtual) {
      novosErros.senhaAtual = 'Senha atual é obrigatória';
      valido = false;
    } else if (dados.senhaAtual.length < 6) {
      novosErros.senhaAtual = 'A senha atual deve ter pelo menos 6 caracteres';
      valido = false;
    }

    if (!dados.novaSenha) {
      novosErros.novaSenha = 'Nova senha é obrigatória';
      valido = false;
    } else if (dados.novaSenha.length < 6) {
      novosErros.novaSenha = 'A nova senha deve ter pelo menos 6 caracteres';
      valido = false;
    } else if (dados.novaSenha === dados.senhaAtual) {
      novosErros.novaSenha = 'A nova senha não pode ser igual à senha atual';
      valido = false;
    }

    if (!dados.confirmarSenha) {
      novosErros.confirmarSenha = 'Confirmação de senha é obrigatória';
      valido = false;
    } else if (dados.novaSenha !== dados.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
      valido = false;
    }

    setErros(novosErros);
    return valido;
  };

  const handleSave = async (dados: DadosModal) => {
    
    if (!validarFormulario(dados)) {
      
      return;
    }

    if (!email) {
      console.error('Email não disponível');
      showError('Email do usuário não encontrado. Feche e abra o modal novamente.');
      return;
    }

    setCarregando(true);

    try {
      // Prepara os dados no formato esperado pelo backend
      const dadosMudancaSenha: MudancaSenhaRequest = {
        email: email, // Usa o email da prop
        senhaAtual: dados.senhaAtual,
        novaSenha: dados.novaSenha,
        confirmacaoNovaSenha: dados.confirmarSenha
      };

      // Chama o serviço real
      await atualizarSenha(dadosMudancaSenha);

      showSuccess('Senha atualizada com sucesso!');
      
      // Fechar modal após sucesso
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      
      // Tratamento específico para diferentes tipos de erro
      const mensagemErro = error.message || 'Erro ao atualizar senha';
      
      if (mensagemErro.includes('Senha atual incorreta')) {
        setErros(prev => ({
          ...prev,
          senhaAtual: 'Senha atual incorreta'
        }));
        showError('Senha atual incorreta');
      } else if (mensagemErro.includes('nova senha não pode ser igual')) {
        setErros(prev => ({
          ...prev,
          novaSenha: 'A nova senha não pode ser igual à senha atual'
        }));
        showError('A nova senha não pode ser igual à senha atual');
      } else if (mensagemErro.includes('não encontrado')) {
        showError('Usuário não encontrado');
      } else {
        showError(mensagemErro);
      }
    } finally {
      setCarregando(false);
    }
  };

  const toggleMostrarSenha = (campo: keyof typeof mostrarSenhas) => {
    setMostrarSenhas(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const handleClose = () => {
    setErros({
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    });
    setMostrarSenhas({
      senhaAtual: false,
      novaSenha: false,
      confirmarSenha: false
    });
    onClose();
  };

  const renderCampoPersonalizado: RenderCampoPersonalizado = (campo, valor, onChange) => {
    const erro = erros[campo.nome as keyof typeof erros];
    const mostrar = mostrarSenhas[campo.nome as keyof typeof mostrarSenhas];

    return (
      <div className="field">
        <label className="label">{campo.label}</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className={`input ${erro ? 'is-danger' : ''}`}
            type={mostrar ? "text" : "password"}
            value={valor || ''}
            placeholder={campo.placeholder}
            required={campo.required}
            onChange={(e) => onChange(e.target.value)}
            disabled={carregando}
          />
          <span className="icon is-small is-left">
            <FaLock />
          </span>
          <span
            className="icon is-small is-right is-clickable"
            onClick={() => toggleMostrarSenha(campo.nome as keyof typeof mostrarSenhas)}
            style={{ pointerEvents: carregando ? 'none' : 'auto', opacity: carregando ? 0.5 : 1 }}
          >
            {mostrar ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        {erro && (
          <p className="help is-danger">{erro}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      <ModalGenerico
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        titulo="Atualizar Senha"
        campos={campos}
        textoBotaoSalvar={carregando ? "Atualizando..." : "Atualizar Senha"}
        textoBotaoCancelar="Cancelar"
        tamanho="normal"
        renderCampoPersonalizado={renderCampoPersonalizado}
        // Não passamos dados iniciais pois não queremos preencher os campos de senha
        dados={null}
      >
        {/* Exibe o email apenas para informação */}
        {email ? (
          <div className="notification is-info is-light mb-4">
            <div className="is-flex is-align-items-center">
              <strong>Usuário:</strong>
              <span className="ml-2">{email}</span>
            </div>
            <small className="is-size-7 has-text-grey">
              Alterando senha para este usuário
            </small>
          </div>
        ) : (
          <div className="notification is-warning is-light mb-4">
            <strong>Aviso:</strong> Email do usuário não identificado
          </div>
        )}

        {/* Dicas de senha */}
        <div className="notification is-warning is-light is-small">
          <strong>Dicas para uma senha segura:</strong>
          <ul className="mt-1">
            <li>• Mínimo de 6 caracteres</li>
            <li>• Use letras, números e símbolos</li>
            <li>• Não use senhas óbvias</li>
          </ul>
        </div>
      </ModalGenerico>
    </>
  );
};

export default AtualizarSenhaModal;