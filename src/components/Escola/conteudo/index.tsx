import { Layout, useNotifications } from '@/components';
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { CustomButton } from '@/components'
import {
  FaMusic,
  FaEdit,
  FaPlus,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaUpload,
  FaList,
  FaBook,
  FaTrash,
  FaArrowLeft,
  FaChartLine,
  FaTimes,
  FaFileInvoice
} from 'react-icons/fa';

import { formatBytes } from '@/util';

import { Instrumento, InstrumentoTipo } from '@/app/models/escola/instrumentos';
import { Topico, TopicoCadastro } from '@/app/models/escola/instrumentos/conteudoProgramatico/topico';
import { Disciplina, DisciplinaCadastro } from '@/app/models/escola/instrumentos/conteudoProgramatico/disciplina';
import { ConteudoProgramatico } from '@/app/models/escola/instrumentos/conteudoProgramatico';
import { useInstrumentoService } from '@/app/services/escola';
import { useGradeService } from '@/app/services/escola/grade/grade.service';
import { getInstrumentoIcon } from '@/util'
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import ModalGenerico, { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import { Input } from '@/components/common/input';
import { FiEye, FiFileText, FiMoreVertical, FiSave, FiTrash } from 'react-icons/fi';
import { useDocsService } from '@/app/services/escola/grade/docs.service';
import { Documento } from '@/app/models/escola/instrumentos/conteudoProgramatico/documento';
import { authService } from '@/app/services/api/authSeervice';
import LoadingSpinner from '@/components/common/loading';

export const GerenciamentoConteudo: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const gradeService = useGradeService()
  const docsService = useDocsService()

  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();
  const instrumentoService = useInstrumentoService()
  const router = useRouter();
  const { id } = router.query;
  const InstrumentoIdConvert = Number(id)


  // ========== ESTADOS DE DADOS ==========
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [instrumentoSelecionado, setInstrumentoSelecionado] = useState<Instrumento | null>(null);
  const [conteudoCompleto, setConteudoCompleto] = useState<ConteudoProgramatico | null>(null);
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [disciplinaParaTopico, setDisciplinaParaTopico] = useState<number | null>(null);
  const [topicoParaEdicao, setTopicoParaEdicao] = useState<number | null>(null);
  const [disciplinaEditando, setDisciplinaEditando] = useState<Disciplina | null>(null);
  const [topicoEditando, setTopicoEditando] = useState<Topico | null>(null);
  const [expandedTopicoId, setExpandedTopicoId] = useState<number | null>(null);

  // ========== ESTADOS DE FORMULÁRIOS ==========
  const [formData, setFormData] = useState<DisciplinaCadastro>({
    nome: '',
    descricao: '',
    topicos: [],
    ordem: 0,
    instrumentoId: 0
  });
  const [formDataTopico, setFormDataTopico] = useState<TopicoCadastro>({
    nome: '',
    descricao: '',
    ordem: 0,
    disciplinaId: 0
  });

  // ========== ESTADOS DE UI ==========
  const [loading, setLoading] = useState(true);
  const [loadingConteudo, setLoadingConteudo] = useState(false);
  const [expandedDisciplinas, setExpandedDisciplinas] = useState<number[]>([]);
  const [expandedTopicos, setExpandedTopicos] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'conteudo' | 'estatisticas'>('conteudo');
  const [showAddDocForm, setShowAddDocForm] = useState(false)
  const [showDisciplinaForm, setShowDisciplinaForm] = useState(false);
  const [showTopicoForm, setShowTopicoForm] = useState(false);
  const [showEditTopicoForm, setShowEditTopicoForm] = useState<boolean>(false);
  const [showEditDisciplinaForm, setShowEditDisciplinaForm] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState(false);
  // no topo do componente:
  const [topicoParaUp, setTopicoParaUp] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [documentoAtual, setDocumentoAtual] = useState<Documento | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null)



  // ========== EFEITOS ==========
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchConteudo();
  }, [id]);

  useEffect(() => {
    if (instrumentoSelecionado) {

      buscarConteudoInstrumento(instrumentoSelecionado.id);
    }
  }, [instrumentoSelecionado?.id]);

  // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
  const buscarConteudoInstrumento = async (id: number) => {
    try {
      setLoadingConteudo(true);
      const conteudo = await gradeService.buscarConteudoCompleto(id);

      setConteudoCompleto(conteudo);
    } catch (error) {
      setLoadingConteudo(false);
      showError("Erro ao buscar conteúdo completo");
    } finally {
      setLoadingConteudo(false);
    }
  };

  const verDocumento = async (doc: Documento) => {
    try {


      setLoading(true)

      const urlProd = process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP

      const response = await fetch(
        `${urlProd}/admin/escola-musica/conteudo-programatico/documentos/${doc.id}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {

            'Accept': 'application/pdf',
            // força binário
          }



        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Blob vazio');

      const url = URL.createObjectURL(blob);
      // ✅ ABRE NOVA ABA (sem modal!)
      window.open(url, '_blank', 'noopener,noreferrer');

      // Cleanup após delay (boa prática)
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setPdfUrl(url);
      setDocumentoAtual(doc);

    } catch (error) {
      setLoading(false);
      showError('Erro ao carregar PDF: ' + (error as Error).message);
      console.error(error);
    } finally {
      setLoading(false)
    }
  };

  const upload = async (dados: DadosModal) => {


    if (!topicoParaUp) return
    setLoading(true)
    try {
      const doc = await docsService.upload(dados.file, topicoParaUp)
      showSuccess('Sucesso!')
    } catch (error: any) {
      setLoading(false);
      showError('Falha no upload: ' + error.message)
    } finally {
      fecharModalAddDoc()
      setLoading(false)
      if (!instrumentoSelecionado) return
      await buscarConteudoInstrumento(instrumentoSelecionado.id);

    }
  }

  const excluirDocs = async (docId: number) => {
    if (confirm('Tem certeza que deseja excluir este Arquivo?')) {
      try {
        setLoading(true)
        await docsService.deletarArquivo(docId)
        showSuccess('Excluído com sucesso!')
      } catch (err) {
        setLoading(false);
        showError('Erro ao excluir');
      } finally {
        setLoading(false)
      }
    }


    await buscarConteudoInstrumento(Number(instrumentoSelecionado?.id))
  }



  const fetchConteudo = async () => {
    try {
      setLoading(true);
      const response = await instrumentoService.getAllInstrumentosConteudo();


      const instrumentoIdNum = InstrumentoIdConvert;

      const instrumentoEncontrado = response.find(i => i.id === instrumentoIdNum);
      const instrumentoParaSelecionar = instrumentoEncontrado || response[0];

      setInstrumentoSelecionado(instrumentoParaSelecionar);
      setInstrumentos(response);

    } catch (error) {
      setLoading(false);
      showError("Erro ao carregar instrumentos");
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const handleTabChange = (tab: 'conteudo' | 'estatisticas') => {
    setActiveTab(tab);
    setConteudoCompleto(conteudoCompleto)
  };

  const toggleDisciplina = (id: number) => {
    setExpandedDisciplinas(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleTopico = (id: number) => {
    setExpandedTopicos(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    ); // Define o tópico expandido como o único item na lista
  };



  const abrirModal = (disciplina: Disciplina | null = null) => {
    if (disciplina?.id) {
      setDisciplinaEditando(disciplina)
      setFormData(disciplina)
      setShowEditDisciplinaForm(true)
    } else {
      setFormData({
        nome: '',
        descricao: '',
        ordem: 0,
      })
      setShowDisciplinaForm(true)
    }

  }

  const fecharModal = () => {
    setShowDisciplinaForm(false);
    setDisciplinaEditando(null);
    setShowEditTopicoForm(false);
    setShowTopicoForm(false)
    setFormDataTopico({
      nome: '',
      descricao: '',
      disciplinaId: 0,
      ordem: 0,
    });
  };

  const abrirModalAddDoc = (id: number) => {
    setShowAddDocForm(true)
    setTopicoParaUp(id)

  }

  const fecharModalAddDoc = () => {
    setShowAddDocForm(false)


  };

  const handleAddTopico = (disciplinaId: number) => {
    if (disciplinaId) {
      setDisciplinaParaTopico(disciplinaId);
      setShowTopicoForm(true);
    } else {
      setFormDataTopico({
        nome: '',
        descricao: '',
        ordem: 0,
        disciplinaId: 0
      })
    }
  };

  // ========== FUNÇÕES DE CRUD ==========
  const atualizarDisciplina = async () => {
    if (!instrumentoSelecionado) return;
    if (!disciplinaEditando?.id) return;

    const dadosCompletosAtualização = {
      ...disciplinaEditando,
      instrumentoId: instrumentoSelecionado.id
    };
    setLoading(true);
    await gradeService.atualizarDisciplina(disciplinaEditando.id, dadosCompletosAtualização);
    showSuccess('Atualizado com sucesso!')
    setShowDisciplinaForm(false);
    setShowEditDisciplinaForm(false);
    setLoading(false);
    setFormData({
      nome: '',
      descricao: '',
      topicos: [],
      ordem: 0,
      instrumentoId: 0
    });

    await buscarConteudoInstrumento(instrumentoSelecionado.id);
  }

  const adicionarDisciplina = async (dados: DadosModal) => {
    if (!instrumentoSelecionado) return;

    const dadosCompletos = {
      ...dados as DisciplinaCadastro,
      instrumentoId: instrumentoSelecionado.id
    };

    try {
      setLoading(true);
      await gradeService.adicionarDiciplinas(dadosCompletos);
      setShowDisciplinaForm(false);
      setShowEditDisciplinaForm(false);
      setLoading(false);
      setFormData({
        nome: '',
        descricao: '',
        topicos: [],
        ordem: 0,
        instrumentoId: 0
      });

      await buscarConteudoInstrumento(instrumentoSelecionado.id);

    } catch (error) {
      setLoading(false);
      showError("Erro ao adicionar disciplina")
    };
  }

  const excluirDisciplina = async (disciplinaId: number) => {
    if (confirm('Tem certeza que deseja excluir este disciplina?')) {
      try {
        setLoading(true);
        await gradeService.deletarDisciplina(disciplinaId)
        setLoading(false);
        showSuccess('Excluída com sucesso!')
      } catch (err) {
        setLoading(false);
        showError('Erro ao excluir disciplina');
      }
    }

    fecharModal()
    await buscarConteudoInstrumento(Number(instrumentoSelecionado?.id))
  }

  const adicionarTopico = async (dados: DadosModal) => {

    const dadosCompletos = {
      ...dados as TopicoCadastro,
      disciplinaId: Number(disciplinaParaTopico)
    }


    try {
      setLoading(true);
      await gradeService.adicionarTopicos(dadosCompletos)
      setLoading(false);
      showSuccess("Topico Adicionado")
    } catch (error) {

      setLoading(false);
      showError("erro ao adicionar topicos!")
    }
    setShowTopicoForm(false);
    setFormDataTopico({
      nome: '',
      descricao: '',
      ordem: 0,
      disciplinaId: 0
    })
    await buscarConteudoInstrumento(Number(instrumentoSelecionado?.id))
  }

  const atualizarTopico = async () => {
    if (!instrumentoSelecionado) return;
    if (!topicoEditando?.id) return;

    const dadosCompletosAtualização = {
      ...topicoEditando,
    };

    await gradeService.atualizaTopicos(topicoEditando.id, dadosCompletosAtualização);
    showSuccess('Topico Atualizado com sucesso!')
    setShowEditTopicoForm(false);
    setFormDataTopico({
      nome: '',
      descricao: '',
      disciplinaId: 0,
      ordem: 0,
    });

    await buscarConteudoInstrumento(instrumentoSelecionado.id);
  }

  const excluirTopico = async (topicoId: number) => {

    if (confirm('Tem certeza que deseja excluir este topico?')) {
      try {
        setLoading(true);
        await gradeService.deletarTopico(topicoId)
        setLoading(false);
        showSuccess('Excluído com sucesso!')
      } catch (err) {
        setLoading(false);
        showError('Erro ao excluir topico!');
      }
    }

    fecharModal()
    await buscarConteudoInstrumento(Number(instrumentoSelecionado?.id))
  }

  // ========== CONFIGURAÇÕES ==========
  const camposAddDoc: CampoModal[] = [
    {
      tipo: 'file',
      nome: 'file',
      label: 'Arquivo (MAX 70MB)',
      required: true
    }
  ];

  const camposDisciplina: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'nome',
      label: 'Disciplina',
      placeholder: "Ex: Triade Menor..",
      required: true
    },
    {
      tipo: 'text',
      nome: 'descricao',
      label: 'Descrição',
      placeholder: "Ex: Disciplina referente..",
      required: true
    },
    {
      tipo: 'number',
      nome: 'ordem',
      label: 'Ordem',
      required: true
    },
  ];

  const camposTopico: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'nome',
      label: 'Topico',
      placeholder: "Ex: Triade Menor..",
      required: true
    },
    {
      tipo: 'number',
      nome: 'ordem',
      label: 'Ordem',
      required: true
    },
  ];

  // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========

  if (!instrumentoSelecionado && !loadingConteudo) {

    return (
      <Layout titulo="Gerenciamento de Conteúdo">
        <div className="section">
          <div className="container">
            <div className="box has-text-centered">
              <LoadingSpinner show={true} isMobile={isMobile} />
            </div>
          </div>
        </div>
      </Layout>
    );

  }

  // ========== CÁLCULOS E DERIVAÇÕES ==========
  const disciplinasParaExibir = conteudoCompleto?.disciplinas || [];
  if (!instrumentoSelecionado) return
  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (


    <Layout titulo={`Conteudo Programático`} >
      <LoadingSpinner show={loading} isMobile={isMobile} />
      <section className="section">
        <div className="container">

          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />

          {/* Cabeçalho com Informações do Instrumento */}
          <div className="box" style={{ boxShadow: 'none' }} >
            <div className={`columns is-vcentered ${isMobile ? 'is-mobile' : ''}`}>
              <div className="column is-narrow">
                <span className={`icon ${isMobile ? 'is-medium' : 'is-large'} has-text-primary`}>
                  <img
                    src={getInstrumentoIcon(instrumentoSelecionado.tipo)}
                    alt={instrumentoSelecionado.nome}
                    className="icon-img"
                    style={{
                      width: isMobile ? '90px' : '100px',
                      height: isMobile ? '90px' : '100px',
                      objectFit: 'contain',
                      maxWidth: '400%',
                      padding: '9px'
                    }}
                  />
                </span>
              </div>
              <div className="column">
                <h1 className={`title ${isMobile ? 'is-5' : 'is-4'}`}>{instrumentoSelecionado.nome}</h1>
                <div className="tags are-small">
                  <span className="tag is-primary-custom">
                    {instrumentoSelecionado.tipo}
                  </span>
                  <span className="tag is-primary-custom">
                    {instrumentoSelecionado.quantidadeDeAluno} alunos
                  </span>
                </div>
              </div>
              <div className="column is-narrow">
                <div className="buttons">
                  {isMobile ? <button
                                className="button is-primary-custom has-secundary-custom" style={{boxShadow: 'none'}}
                                onClick={(e) => {
                                  e.stopPropagation();
                                 abrirModal()
                                }}
                              >
                                <span className="icon">
                                  <FaPlus size={14} />
                                </span>
                              </button> :
                  <CustomButton
                    text={`${!isMobile ? 'Adicionar Disciplina' : ''}`}
                    icon={<FaPlus size={isMobile ? 12 : 16} />}
                    onClick={() => abrirModal()}
                    className={`is-fullwidth  ${isMobile ? 'is-small' : ''}`}
                    style={{ borderRadius: '6px' }}
                  />}
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de Carregamento do Conteúdo */}
          {loadingConteudo && (

            <LoadingSpinner show={loadingConteudo} isMobile={isMobile} />

          )}

          {/* Tabs de Navegação */}
          <div className={`tabs ${isMobile ? 'is-small' : 'is-medium'} is-boxed mt-3`}>
            <ul>
              <li className={activeTab === 'conteudo' ? 'is-active' : ''}>
                <a onClick={() => handleTabChange('conteudo')}>
                  <span className="icon">
                    <FaBook size={isMobile ? 14 : 16} />
                  </span>
                  {!isMobile && <span>Conteúdo Programático</span>}
                </a>
              </li>
              <li className={activeTab === 'estatisticas' ? 'is-active' : ''}>
                <a onClick={() => handleTabChange('estatisticas')}>
                  <span className="icon">
                    <FaChartLine size={isMobile ? 14 : 16} />
                  </span>
                  {!isMobile && <span>Estatísticas</span>}
                </a>
              </li>
            </ul>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === 'conteudo' ? (
            <div className="box" style={{ boxShadow: 'none', padding: '0px' }}>
              {!loadingConteudo && disciplinasParaExibir.length === 0 ? (
                <div className="has-text-centered py-6">
                  <p className="mb-4">Nenhuma disciplina cadastrada para este instrumento.</p>
                  <CustomButton
                    text={!isMobile ? 'Criar Primeira Disciplina' : ''}
                    icon={<FaPlus size={isMobile ? 12 : 16} />}
                    onClick={() => setShowDisciplinaForm(true)}
                    className={isMobile ? 'is-small' : ''}
                    style={{ borderRadius: '6px' }}
                  />
                </div>
              ) : (
                disciplinasParaExibir.map(disciplina => (
                  <div key={disciplina.id} className="card mb-3" style={{ boxShadow: 'none' }}>
                    <header
                      className="card-header is-clickable"
                      onClick={() => toggleDisciplina(disciplina.id)}
                    >
                      <p className={`card-header-title ${isMobile ? 'is-size-10' : ''}`}>
                        {disciplina.nome}
                        <span className={`tag ml-4 mr-4 is-light ${isMobile ? 'is-small' : ''}`}>
                          {disciplina.topicos.length} tópicos
                        </span>
                        <span className="buttons">
                          <button
                            className="button is-small is-primary-custom"
                            onClick={() => abrirModal(disciplina)}
                          >
                            <span className="icon">
                              <FaEdit />
                            </span>
                          </button>
                        </span>
                      </p>
                    </header>

                    {expandedDisciplinas.includes(disciplina.id) && (
                      <div className="card-content" style={{ padding: '0' }}>
                        <div className="content">
                          <p className={` ${isMobile ? 'is-size-7' : 'is-size-6'} has-text-grey has-text-weight-light
                                                border-left-3
                                                border-primary
                                                pl-3
                                                py-2`}>{disciplina.descricao} </p>

                          <div className="level is-mobile">
                            <div className="level-left">
                              <h3 className={`title ${isMobile ? 'is-5' : 'is-6'}`}>Tópicos</h3>
                            </div>
                            <div className="level-right">
                              {isMobile ? <button
                                className="button is-primary-custom has-secundary-custom" style={{boxShadow: 'none'}}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddTopico(disciplina.id);
                                }}
                              >
                                <span className="icon">
                                  <FaPlus size={14} />
                                </span>
                              </button> :
                                <CustomButton
                                  text={`${!isMobile ? 'Adicionar Tópico' : ''}`}
                                  icon={<FaPlus size={isMobile ? 12 : 14} />}
                                  onClick={() => handleAddTopico(disciplina.id)}
                                  className={`${isMobile ? 'is-small is-light' : 'is-small is-info'}`}
                                  style={{ borderRadius: '6px' }}
                                />}
                            </div>
                          </div>

                          <div className="table-container is-multiline is-fullwidth is-striped is-hoverable">
                            <table className={`table is-fullwidth is-narrow is-hoverable is-striped`}>
                              <thead>
                                <tr>
                                  {!isMobile && <th className={isMobile ? 'is-size-7' : ''}>Ordem</th>}
                                  <th className={isMobile ? 'is-size-6' : ''}>Nome</th>

                                   <th>Ações</th>


                                </tr>
                              </thead>
                              <tbody>
                                {disciplina.topicos
                                  .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
                                  .map((topico) => {
                                    const isOpen = expandedTopicos.includes(topico.id);

                                    return (
                                      <Fragment key={topico.id}>
                                        {/* HEADER DO TÓPICO (clicável) */}
                                        <tr
                                          onClick={() => toggleTopico(topico.id)}
                                          className={`is-clickable topico-row ${isOpen ? "is-open" : ""}`}
                                          role="button"
                                          tabIndex={0}
                                          aria-expanded={isOpen}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                              e.preventDefault();
                                              toggleTopico(topico.id);
                                            }
                                          }}
                                        >
                                          {!isMobile && <td className={isMobile ? 'is-size-7' : ''}>{topico.ordem}</td>}

                                          <td className={isMobile ? 'is-size-6' : ''}>
                                            <div className="is-flex is-align-items-center is-justify-content-space-between">
                                              <span>{topico.nome}</span>


                                            </div>
                                          </td>

                                         
                                            <td>
                                              <div className="buttons are-small">
                                                <button
                                                  className="button is-primary-custom has-secundary-custom"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTopicoEditando(topico);
                                                    setShowEditTopicoForm(true);
                                                  }}
                                                >
                                                  <span className="icon">
                                                    <FaEdit size={isMobile ? 10 : 14} />
                                                  </span>
                                                </button>

                                                {/* IMPORTANTE: colocar stopPropagation aqui,
                      senão clica no botão e também dispara o onClick do <tr>
                      (aí ele abre e fecha na mesma hora) */}
                                                <button
                                                  className="button is-primary-custom has-secundary-custom"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirModalAddDoc(topico.id);
                                                  }}
                                                >
                                                  <span className="icon">
                                                    <FaUpload size={isMobile ? 10 : 14} />
                                                  </span>
                                                </button>
                                              </div>
                                            </td>
                                       
                                        </tr>

                                        {/* ÁREA COLAPSÁVEL (sempre renderizada para animar abrir/fechar) */}
                                        <tr className="topico-docs-row">
                                          <td
                                            colSpan={isMobile ? 2 : 3}
                                            style={{ padding: 0, borderTop: "none" }}
                                          >
                                            <div className={`topico-collapse ${isOpen ? "is-open" : ""}`}>
                                              <div className="topico-collapse-inner">
                                                {topico.docs.map((doc) => (
                                                  <div
                                                    key={doc.id}
                                                    className="doc-item"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      verDocumento(doc);
                                                    }}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                      if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        verDocumento(doc);
                                                      }
                                                    }}
                                                  >
                                                    <div className="doc-name-container mb-2">
                                                      <span className="icon doc-mini-icon mr-2">
                                                        <FaFileInvoice size={16} />
                                                      </span>

                                                      <span className="doc-name is-clipped is-size-6" title={doc.nome}>
                                                        {doc.nome}
                                                      </span>
                                                      {!isMobile &&
                                                        <><span className="tag is-light is-rounded mr-7">
                                                          {formatBytes(doc.tamanho)}
                                                        </span>
                                                          <span className="tag is-light  is-rounded">PDF</span>
                                                          <div className="buttons are-small ml-2" style={{ marginRight: '100px' }}>
                                                            <button
                                                              className={`button  is-primary-custom  ${isOpen ? "is-open" : ""}  has-secundary-custom`}
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                excluirDocs(doc.id);
                                                              }}
                                                            >
                                                              <span className="icon doc-mini-icon ">
                                                                <FiTrash size={14} />
                                                              </span>
                                                            </button>
                                                          </div></>
                                                      }

                                                    </div>


                                                  </div>
                                                ))}
                                              </div>
                                            </div>



                                          </td>


                                        </tr>
                                      </Fragment>
                                    );
                                  })}
                              </tbody>
                            </table>

                          </div>

                        </div>



                      </div>


                    )}

                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="box" style={{ boxShadow: 'none' }}>
              <h2 className={`title ${isMobile ? 'is-5' : 'is-4'}`}>Estatísticas do Instrumento</h2>
              <div className={`columns `}>
                <div className="column">
                  <div className="card">
                    <div className="card-content">
                      <div className="media">
                        <div className="media-left">
                          <span className={`icon ${isMobile ? 'is-medium' : 'is-large'} has-primary-custom`}>
                            <FaList size={isMobile ? 20 : 30} />
                          </span>
                        </div>
                        <div className="media-content">
                          <p className={`title ${isMobile ? 'is-5' : 'is-4'} `}>Disciplinas</p>
                          <p className={`subtitle ${isMobile ? 'is-7' : 'is-6'}`}>
                            {disciplinasParaExibir.length} cadastradas
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="column" >
                  <div className="card" >
                    <div className="card-content">
                      <div className="media">
                        <div className="media-left">
                          <span className={`icon ${isMobile ? 'is-medium' : 'is-large'} has-primary-custom`}>
                            <FaBook size={isMobile ? 20 : 30} />
                          </span>
                        </div>
                        <div className="media-content">
                          <p className={`title ${isMobile ? 'is-5' : 'is-4'}`}>Tópicos</p>
                          <p className={`subtitle ${isMobile ? 'is-7' : 'is-6'}`}>
                            {disciplinasParaExibir.reduce(
                              (total, disciplina) => total + disciplina.topicos.length, 0
                            )} no total
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== MODAIS ========== */}

      {/* Modal de Adição de Disciplina */}

      <ModalGenerico
        isOpen={showAddDocForm}
        onClose={() => fecharModalAddDoc()}
        dados={selectedFile}
        onSave={upload}
        titulo={'Adicionar Arquivo'}
        campos={camposAddDoc}
        textoBotaoSalvar="Enviar"
      />

      {/* Modal de Adição de Tópico */}

      <ModalGenerico
        isOpen={showTopicoForm}
        onClose={() => fecharModal()}
        dados={formDataTopico}
        onSave={adicionarTopico}
        titulo={'Novo Topico'}
        campos={camposTopico}
        textoBotaoSalvar="Salvar"
      />


      {/* Modal de Adição de Disciplina */}

      <ModalGenerico
        isOpen={showDisciplinaForm}
        onClose={() => fecharModal()}
        dados={disciplinaEditando}
        onSave={adicionarDisciplina}
        titulo={disciplinaEditando?.id ? 'Editar Disciplina' : 'Nova Disciplina'}
        campos={camposDisciplina}
        textoBotaoSalvar="Salvar"
      />

      {showModal && pdfUrl && (
        <div className="modal is-active" >
          <div className="modal-background" onClick={() => setShowModal(false)} />
          <div className="modal-content" style={{ maxWidth: '800vw', height: '800vh' }}>
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title={documentoAtual?.nome}
            />
          </div>
          <button className="modal-close is-large" onClick={() => setShowModal(false)} />
        </div>
      )}

      {/* Modal de Edição de Disciplina */}
      {showEditDisciplinaForm && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowEditDisciplinaForm(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Editar Disciplina</p>
              <button className="delete" aria-label="close" onClick={() => setShowEditDisciplinaForm(false)}></button>
            </header>
            <section className="modal-card-body">
              <Input
                label='Nome'
                type='text'
                placeholder="Ex: Acorde de Dó Maior"
                value={disciplinaEditando?.nome}
                onChange={(e) => {
                  setDisciplinaEditando(prev => ({
                    ...prev!,
                    nome: e.target.value
                  }))
                  setFormData(prev => ({
                    ...prev!,
                    nome: e.target.value
                  }))
                }
                }
              />

              <Input
                label='Ordem'
                type='number'
                placeholder="1"
                min="1"
                value={disciplinaEditando?.ordem}
                onChange={(e) => {
                  setDisciplinaEditando(prev => ({
                    ...prev!,
                    ordem: parseInt(e.target.value) || 0
                  }))
                  const value = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev!,
                    ordem: value,
                  }));
                }
                }
              />

              <div className="field">
                <label className="label">Descrição</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder="Detalhes sobre este tópico"
                    value={disciplinaEditando?.descricao}
                    onChange={(e) => {
                      setDisciplinaEditando(prev => ({
                        ...prev!,
                        descricao: e.target.value
                      }))
                      setFormData(prev => ({
                        ...prev!,
                        descricao: e.target.value
                      }))
                    }
                    }
                  ></textarea>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-primary-custom" onClick={() => atualizarDisciplina()}>
                {`${isMobile ? 'Salvar' : 'Salvar Alterações'}`}
              </button>
              <button className="button" onClick={() => setShowEditDisciplinaForm(false)}>Cancelar</button>
              <button className="button is-danger  is-outlined" onClick={() => excluirDisciplina(disciplinaEditando?.id ? disciplinaEditando.id : 0)}>
                {`${isMobile ? 'Excluir' : 'Excluir Disciplina'}`}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Modal de Edição de Tópico */}
      {showEditTopicoForm && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowEditTopicoForm(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Editar Tópico</p>
              <button className="delete" aria-label="close" onClick={() => setShowEditTopicoForm(false)}></button>
            </header>
            <section className="modal-card-body">
              <Input
                label='Nome'
                type="text"
                placeholder="Ex: Acorde de Dó Maior"
                value={topicoEditando?.nome || formDataTopico.nome}
                onChange={(e) => {
                  setTopicoEditando(prev => ({
                    ...prev!,
                    nome: e.target.value
                  }))
                  setFormDataTopico(prev => ({
                    ...prev!,
                    nome: e.target.value
                  }))
                }}
              />

              <Input
                label='Ordem'
                type="number"
                placeholder="1"
                min="1"
                value={topicoEditando?.ordem || formDataTopico.ordem}
                onChange={(e) => {
                  setTopicoEditando(prev => ({
                    ...prev!,
                    ordem: parseInt(e.target.value) || 0
                  }))
                  setFormDataTopico(prev => ({
                    ...prev!,
                    ordem: parseInt(e.target.value)
                  }))
                }}
              />


            </section>
            <footer className="modal-card-foot">
              <CustomButton
                text='Salvar Alterações'
                icon={<FiSave />}
                className="button"
                onClick={() => atualizarTopico()}
                style={{ borderRadius: '6px' }}
              />

              <button className="button is-danger is-outlined" onClick={() => excluirTopico(topicoEditando?.id ? topicoEditando.id : 0)}>
                Excluir Tópico
              </button>

              <button className="button" onClick={() => setShowEditTopicoForm(false)}>Cancelar</button>

            </footer>
          </div>
        </div>
      )}


    </Layout>
  );
};