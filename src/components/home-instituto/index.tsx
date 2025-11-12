import {
    FaUniversity,
    FaTools,
    FaUsers
} from 'react-icons/fa';

import { HomePage } from '@/components/common/homeBase';
import logo from '@/assets/logoMobiles.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import AuthorFooter from '../common/signature';

export const HomeInstitutoMusica = () => {

    const [isMobile, setIsMobile] = useState(false);

    // ========== EFEITOS ==========
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ margin: '100px' }}>
            <HomePage
                title={`${isMobile ? '' : 'Instituto Musical Alan Godoy'} `}
                subtitle="Primeiro, minha casa para a musica. Hoje, somos casa da música!"
                image={

                    <Image
                        src={logo}
                        alt="Instituto Alan Godoy"
                        width={700}
                        height={700}
                        style={{
                            objectFit: 'contain',
                            maxWidth: '700%',
                            color: '#c99985'

                        }}
                    />
                }

                main={""}
                operacoesPrincipais={[
                    { title: 'Escola', icon: <FaUniversity size={28} />, route: '/instituto-musical/escola/home', description: 'Gerencie sua Escola de Música' },
                    { title: 'Loja', icon: <FiShoppingCart size={28} />, route: '/instituto-musical/loja/home', description: 'Gerencie seus produtos e estoque' },
                    { title: 'Projetos', icon: <FaTools size={28} />, route: '/instituto-musical/servicos-musicais/home', description: 'Gerencie Projetos e Trabalhos prestados' },
                    { title: `${isMobile ? 'Adm' : 'Administração'}`, icon: <FaUsers size={28} />, route: '/instituto-musical/autenticacao', description: 'Administração' },

                ]}
                useLayout={false}
            >
                <div className="columns is-multiline">


                    <div className="column is-6-mobile is-4-tablet is-5-desktop">

                    </div>
                </div>
            </HomePage>
               
<AuthorFooter
  authorName="AJ Soluções" 
  className="has-border-top-light"
  showYear= {true}
/>
        </div>
    );
};

export default HomeInstitutoMusica;
