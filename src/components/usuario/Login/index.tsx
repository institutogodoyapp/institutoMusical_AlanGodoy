import { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Head from 'next/head';
import Image from 'next/image';
import logoDesktop from '../../../assets/logoDesktop.png';
import logoMobile from '../../../assets/logoMobiles.png';
import { CustomButton } from '@/components/common/customButton'
import { UsuarioLogin } from '@/app/models/usuario'
import { useRouter } from 'next/router';
import localStorageService from '@/app/services/localStorageService/index'
import useAuth from '@/app/services/api/useAuth';
import { useNotifications } from '@/components/common/notificacao/hookNotify/usoSimples';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';


export const LoginPage: React.FC = () => {

  const router = useRouter();
  const [user, setUser] = useState<UsuarioLogin | null>(null);
  const {
    notifications,
    showError,
    removeNotification
  } = useNotifications();

  const { login } = useAuth();
  const schema = yup.object().shape({
    email: yup.string().email("Digite um e-mail válido").required("E-mail é obrigatório"),
    senha: yup.string().required("Senha obrigatória"),

  });


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioLogin>({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  const onSubmit = async (dados: UsuarioLogin) => {
    try {
      const result = await login(dados.email, dados.senha);

      if (result.success) {

        const usuarioData = {
          email: dados.email,
          senha: dados.senha

        };


        setUser(usuarioData);

        // Salva no localStorage (convertendo para string)
        localStorageService.adicionarItem('_usuario_logado', JSON.stringify(usuarioData));

        // Redireciona após login
        router.push('/instituto-musical/home');
      } else {
        // Tratar erro retornado pelo hook
        showError(result.error || "Credenciais inválidas!");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      showError("Erro ao processar login!");
    }
  };

  return (
    <>
      <Head>
        <title>Login - Instituto Alan Godoy</title>
        <meta name="description" content="Faça login para acessar sua conta" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css" />
      </Head>

      <section className="hero is-fullheight is-light has-rounded-large">

        <div className="hero-body">
          <div className="container ">
            <NotificationContainer
              notifications={notifications}
              onRemove={removeNotification}
            />
            <div className="columns is-centered ">
              <div className="column is-10-tablet is-6-desktop is-widescreen " style={{ height: '60%' }}>
                <div className={`box p-0 ${isMobile ? '' : 'is-flex'}`} style={{ borderRadius: "25px 25px 25px 25px", minHeight: isMobile ? 'auto' : '600px' }}>
                  {/* Left Side - Hidden on mobile */}
                  {!isMobile && (
                    <div className="column is-6 p-6 has-text-white " style={{ backgroundColor: "#A33100", borderRadius: "25px 0 0 25px" }}>
                      <div className="mb-6">
                        <h1 className="title has-text-white">Instituto Alan Godoy</h1>
                      </div>

                      <h2 className="title is-2 has-text-white mb-4" >Bem-vindo</h2>
                      <p className="subtitle has-text-white mb-5" style={{ marginTop: '20px' }}>
                        Por favor, faça login para acessar sua conta
                      </p>

                      <div className="is-divider my-5" data-content=""></div>

                      <div className="is-flex is-justify-content-center is-align-items-center" style={{ flex: 1 }}>
                        <Image
                          src={logoDesktop}
                          alt="Instituto Alan Godoy"
                          className="image"
                          style={{
                            maxHeight: '100vh',
                            width: 'auto',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Right Side - Full width on mobile */}
                  <div className={`column ${isMobile ? 'is-12' : 'is-6'} p-6`}>
                    {isMobile && (
                      <div className="has-text-centered mb-5">
                        <Image
                          src={logoMobile}
                          alt="Instituto Alan Godoy"
                          width={400}
                          height={200}
                          style={{
                            objectFit: 'contain'
                          }}
                        />
                        <h1 className="title is-4 mt-3">Instituto Alan Godoy</h1>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Email Field */}
                      <div className="field">
                        <label className="label">E-mail</label>
                        <div className="control has-icons-left">
                          <input
                            {...register("email")}
                            className={`input ${errors.email ? 'is-danger' : ''}`}
                            type="email"
                            placeholder="seu@email.com"
                          />
                          <span className="icon is-small is-left">
                            <FaEnvelope />
                          </span>
                        </div>
                        {errors.email && (
                          <p className="help is-danger">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="field">
                        <label className="label">Senha</label>
                        <div className="control has-icons-left has-icons-right">
                          <input
                            {...register("senha")}
                            className={`input ${errors.senha ? 'is-danger' : ''}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                          />
                          <span className="icon is-small is-left">
                            <FaLock />
                          </span>
                          <span
                            className="icon is-small is-right is-clickable"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        {errors.senha && (
                          <p className="help is-danger">{errors.senha.message}</p>
                        )}
              
                      </div>


                      <div className="field">
                     
                      </div>

                      {/* Submit Button */}
                      <div className="field">
                        <CustomButton
                          text="Entrar"
                          icon={null}
                          type="submit"
                          className="my-custom-class"
                          style={{ fontSize: '17px' , textAlign: 'center',padding: '10px 20px', width: '100%', height: '50%' }}
                        />
                      </div>

                      {/* Signup Link */}
                      <div className="has-text-centered mt-4">
                    
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;