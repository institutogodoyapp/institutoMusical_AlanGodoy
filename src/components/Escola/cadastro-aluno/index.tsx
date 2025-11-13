import { Layout, useNotifications } from '@/components';
import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components';
import { useAlunoService } from '@/app/services';
import { Professor } from '@/app/models/escola/professor';
import { Instrumento } from '@/app/models/escola/instrumentos';
import { Aluno } from '@/app/models/escola/aluno';
import { useRouter } from 'next/router';
import { FaUser, FaIdCard, FaSpinner, FaEnvelope, FaPhone, FaMusic, FaArrowLeft, FaCalendarAlt, FaClock, FaChalkboardTeacher, FaSave, FaWindowClose, FaUniversity } from 'react-icons/fa';
import { useInstrumentoService } from '@/app/services/escola';
import { httpClient } from '@/app/http';
import { formatCPF, unformatCPF } from '@/util'
import { FiUser, FiX } from 'react-icons/fi';
import { voltar } from '@/util/navegacao';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { Input } from '@/components/common/input';
import { FaUserGraduate } from 'react-icons/fa6';

export const CadastroAlunos: React.FC = () => {
    // ========== SERVICES E HOOKS ==========
    const service = useAlunoService();
    const {
        notifications,
        showSuccess,
        showError,
        removeNotification
    } = useNotifications();
    const serviceInstrumento = useInstrumentoService();
    const router = useRouter();
    const { id } = router.query;
    const alunoId = Number(id);

    // ========== ESTADOS DE DADOS ==========
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [isAlunoLoaded, setIsAlunoLoaded] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(false);
    const [professorSelecionado, setProfessorSelecionado] = useState<Professor>()



    // ========== ESTADOS DE FORMULÁRIO ==========
    const [formData, setFormData] = useState<Aluno>({
        id: 0,
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        instrumentoId: 0,
        diaSemanaAula: "MONDAY",
        horarioAula: '',
        professorId: 0,
        ativo: true
    });

    // ========== ESTADOS DE UI ==========
    const [loading, setLoading] = useState<boolean>(true);

    // ========== CONSTANTES ==========
    const diasSemana: { value: string, label: string }[] = [
        { value: 'MONDAY', label: 'Segunda-feira' },
        { value: 'TUESDAY', label: 'Terça-feira' },
        { value: 'WEDNESDAY', label: 'Quarta-feira' },
        { value: 'THURSDAY', label: 'Quinta-feira' },
        { value: 'FRIDAY', label: 'Sexta-feira' },
        { value: 'SATURDAY', label: 'Sábado' }
    ];

    // ========== EFEITOS ==========
    useEffect(() => {
        if (alunoId && !isAlunoLoaded) {
            service.carregarAluno(alunoId)
                .then(alunoEncontrado => {
                    setFormData({
                        ...formData,
                        id: alunoEncontrado.id,
                        nome: alunoEncontrado.nome,
                        cpf: alunoEncontrado.cpf,
                        email: alunoEncontrado.email,
                        telefone: alunoEncontrado.telefone,
                        instrumentoId: alunoEncontrado.instrumento ? alunoEncontrado.instrumento.id : 0,
                        diaSemanaAula: alunoEncontrado.diaSemanaAula,
                        horarioAula: alunoEncontrado.horarioAula,
                        professorId: alunoEncontrado.professor?.id || 0,

                    });
                    setIsAlunoLoaded(true);
                })
                .catch(err => {
                    showError('Não foi possível carregar os dados do aluno.');
                });
        }
    }, [id, service]);


    useEffect(() => {
    if (formData.professorId) {
       const instrumentos = fetchInstrumentos(Number(formData.professorId));
           console.log(instrumentos)
    }


}, [formData.professorId]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);

            try {
                await Promise.all([fetchProfessores()]);
            } catch (err) {
                showError('Erro ao carregar dados necessários');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);


    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    // ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========
    const fetchInstrumentos = async (id: number) => {
        try {
            const response = await serviceInstrumento.getInstrumentoByProfessorId(id);
            setInstrumentos(Array.isArray(response) ? response : [response]);
        } catch (err) {
            showError('Não foi possível carregar os instrumentos');
        }
    };

    const fetchProfessores = async () => {
        try {
            const response = await httpClient.get('admin/escola-musica/professores');
            setProfessores(response.data);
        } catch (err) {
            showError('Não foi possível carregar os professores');
        }
    };

    // ========== FUNÇÕES DE MANIPULAÇÃO DE FORMULÁRIO ==========
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleDiaSemanaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            diaSemanaAula: event.target.value as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let successMsg: string = 'Aluno cadastrado com sucesso!'

        try {
            setLoading(true);

            console.log(formData.cpf)

            if (alunoId) {
                const response = await service.atualizarAluno(alunoId, formData);
                setFormData(response);
            } else {
                console.log(formData)
                const response = await service.cadastrarAluno(formData);
                setFormData(response);
            }

            showSuccess(successMsg);
        } catch (err: any) {
            console.error('Erro no cadastro:', err);
            let errorMsg = 'Erro ao cadastrar aluno';
            showError(errorMsg);
        } finally {
            setLoading(false);

            setFormData({
                id: 0,
                nome: '',
                cpf: '',
                email: '',
                telefone: '',
                instrumentoId: 0,
                diaSemanaAula: "MONDAY",
                horarioAula: '',
                professorId: 0,
                ativo: true
            });
        }
    };

    // ========== RENDERIZAÇÃO DE CARREGAMENTO ==========
    if (loading) {
        return (
            <div className="section">
                <div className="container">
                    <div className="box has-text-centered">
                        <span className="icon is-large">
                            <FaSpinner className="fa-spin" />
                        </span>
                        <p>Carregando dados...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ========== RENDERIZAÇÃO PRINCIPAL ==========
    return (
        <Layout titulo={`${id ? 'Atualizar Aluno' : 'Cadastro de Aluno'} `}>
            <section className="section">
                <div className="container">
                    <div className="box" style={{ boxShadow: 'none' }}>
                        {/* Cabeçalho */}
                        <div className="block">
                            <h1 className="title is-4 mb-8">
                                <span className="icon-text">
                                    <span className="icon"><FaUserGraduate /></span>
                                </span>
                            </h1>
                            <p className="subtitle is-6">
                                {`${id ? 'Edite os dados do Aluno conforme necessário' : 'Preencha os dados do aluno para realizar o cadastro'}`}
                            </p>
                        </div>

                        <NotificationContainer
                            notifications={notifications}
                            onRemove={removeNotification}
                        />

                        {/* Formulário */}
                        <form onSubmit={handleSubmit}>
                            {/* Dados Pessoais */}
                            <h2 className="title is-5 has-primary-custom">Dados Pessoais</h2>

                            <Input
                                label='Nome Completo'
                                type='text'
                                icon={<FiUser />}
                                name='nome'
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder='Digite o nome Completo' />

                            <div className="columns">
                                <div className="column">
                                    <Input
                                        label='CPF'
                                        type='text'
                                        format='cpf'
                                        icon={<FaIdCard />}
                                        name='cpf'
                                        value={formatCPF(formData.cpf)}
                                        onChange={handleChange}
                                        required
                                        placeholder="000.000.000-00" />

                                </div>

                                <div className="column">
                                    <Input
                                        label='E-mail'
                                        type='email'
                                        icon={<FaEnvelope />}
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="aluno@email.com" />
                                </div>

                                <div className="column">
                                    <Input
                                        label='Contato'
                                        icon={<FaEnvelope />}
                                        type="tel"
                                        format='telefone'
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        required
                                        placeholder="(00) 00000-0000" />
                                </div>
                            </div>

                            {/* Dados Musicais */}
                            <h2 className="title is-5 has-primary-custom">Dados Musicais</h2>

                            <div className="columns">

                                <div className="column">
                                    <div className="field">
                                        <label className="label">
                                            <span className="icon-text has-text-descrition-cinza-custom has-text-bold-normal">
                                                <span className="icon"><FaChalkboardTeacher /></span>
                                                <span>Professor</span>
                                            </span>
                                        </label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="professorId"
                                                    value={formData.professorId}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Selecione um professor</option>
                                                    {professores.map(professor => (
                                                        <option key={professor.id} value={professor.id}>
                                                            {professor.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="column">
                                    <div className="field">
                                        <label className="label">
                                            <span className="icon-text has-text-descrition-cinza-custom has-text-bold-normal">
                                                <span className="icon"><FaMusic /></span>
                                                <span>Instrumento</span>
                                            </span>
                                        </label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="instrumentoId"
                                                    value={formData.instrumentoId}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Selecione um instrumento</option>
                                                    {instrumentos.map(instrumento => (
                                                        <option key={instrumento.id} value={instrumento.id}>
                                                            {instrumento.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            {/* Agendamento de Aulas */}
                            <h2 className="title is-5 has-primary-custom">Agendamento de Aulas</h2>

                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">
                                            <span className="icon-text has-text-descrition-cinza-custom has-text-bold-normal">
                                                <span className="icon"><FaCalendarAlt /></span>
                                                <span>Dia da Semana</span>
                                            </span>
                                        </label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="diaSemanaAula"
                                                    value={formData.diaSemanaAula || ""}
                                                    onChange={handleDiaSemanaChange}
                                                    required
                                                >
                                                    <option value="">Selecione um dia</option>
                                                    {diasSemana.map(dia => (
                                                        <option key={dia.value} value={dia.value}>
                                                            {dia.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="column">
                                    <Input
                                        label='Horário da Aula'
                                        icon={<FaClock />}
                                        type="time"
                                        name="horarioAula"
                                        value={formData.horarioAula || ""}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="field is-grouped is-grouped-right">
                                <div className="control mb-6">
                                    <CustomButton
                                        text={`${isMobile ? '' : 'Cancelar'}`}
                                        icon={<FiX className="mr-2" />}
                                        onClick={voltar}
                                        className="control"
                                    />
                                </div>
                                <div className="control">
                                    <CustomButton
                                        text={`${id ? 'Atualizar' : 'Cadastrar'} `}
                                        icon={<FaSave />}
                                        type="submit"
                                        className="control"
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