import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { FaChevronDown, FaChevronRight, FaHome, FaUserCog, FaSignOutAlt, FaMusic, FaWarehouse, FaTools, FaUsers } from 'react-icons/fa';
import {
  FiHome,
  FiUser,
  FiSettings,
  FiBarChart2,
  FiMail,
  FiCalendar,
  FiFileText,
  FiShoppingCart,
  FiUsers,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSidebar,
  FiMenu,
  FiXCircle,
  FiXOctagon
} from 'react-icons/fi';
import { authService } from '@/app/services/api/authSeervice'
import { LogoutButton } from "@/components/common/Auth/LogoutButton";
import AuthorSignature from "@/components/common/signature";
import AuthorBadge from "@/components/common/signature";
import SimpleAuthorFooter from "@/components/common/signature";

export const Menu: React.FC = () => {

    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [showMenuDesktop, setShowMenuDesktop] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
        escola: false,
        estoque: false,
        servicos: false,
        admin: false
    });

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSubMenu = (menu: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const irParaAdm = () => {
        router.push('/instituto-musical/autenticacao')
    }





    return (
        <>

            <button
                className="button is-#6a1b9a is-hidden-tablet"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                    position: "fixed",
                    top: "30px",
                    left: isMenuOpen ? "130px" : "10px",
                    zIndex: 100,
                    background: "none",
                    border: "none",
                    padding: "8px",
                }}
                aria-label="Menu"
            >
                <span className="icon">
                    {isMenuOpen ? (
                        <FiMenu/>
                        // <img src="/icons/colapsar.svg" alt="Fechar menu" style={{ width: '24px', height: '24px' }} />
                    ) : (
                        // <img src="/icons/expandir.svg" alt="Abrir menu" style={{ width: '24px', height: '24px' }} />
                           <FiMenu/>
                    )}
                </span>
            </button>


            {isDesktop && (
                <button
                    className="button is-white is-hidden-mobile"
                    onClick={() => setShowMenuDesktop(!showMenuDesktop)}
                    style={{
                        position: "fixed",
                        top: "10px",
                        left: `${!showMenuDesktop ? '140px' : '240px'}`,
                        zIndex: 100,
                        background: "none",
                        border: "none",
                        padding: "1px",
                    }}
                    aria-label="Menu Desktop"
                >
                    <span className="icon">
                        {showMenuDesktop ? (
                              <FiXOctagon />
                            // <img src="/icons/colapsar.svg" alt="Fechar menu" style={{ width: '24px', height: '24px' }} />
                        ) : (

                             <FiMenu/>
                            // <img src="/icons/expandir.svg" alt="Abrir menu" style={{ width: '24px', height: '24px' }} />
                        )}
                    </span>
                </button>
            )}


            {isMenuOpen && !isDesktop && (
                <div
                    className="is-overlay is-hidden-tablet"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        position: "fixed",
                        zIndex: 100,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <aside
                className="column is-3 is-narrow-mobile is-fullheight section"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    width: "230px",
                    zIndex: 100,
                    transition: "transform 0.3s ease-in-out",
                    backgroundColor: "#FCFDFC",
                    color: "#555",
                    transform: isDesktop
                        ? (showMenuDesktop ? 'translateX(0)' : 'translateX(-100%)')
                        : (isMenuOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
                    overflowY: "auto"
                }}
            >
                <div style={{ padding: "1rem", borderBottom: "1px solid #34495e" }}>
                    <p className="menu-label" style={{ color: "#555", fontSize: "1.2rem", fontWeight: "bold" }}>
                        Instituto Alan Godoy
                    </p>
                </div>

                <ul className="menu-list" style={{ padding: "0.5rem" }}>

                    <MenuItens href="/instituto-musical/home" label="Home" icon={<FaHome />} />


                    {/* Escola de Música */}
                    <li>
                        <div
                            className="menu-item"
                            onClick={() => toggleSubMenu('escola')}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.5em 0.75em",
                                borderRadius: "4px",
                                cursor: "pointer",
                                margin: "0.25em 0",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <span className="icon" style={{ marginRight: "0.5em" }}><FaMusic /></span>
                                Escola
                            </span>
                        </div>
                        {expandedItems.escola && 
                            <ul style={{ marginLeft: "1.5em", borderLeft: "1px solid #34495e", paddingLeft: "0.5em" }}>
                                <MenuItens href="/instituto-musical/escola/home" label="Home" />
                                <MenuItens href="/instituto-musical/escola/aluno/gerenciamento-aluno" label="Alunos" />
                                <MenuItens href="/instituto-musical/escola/professor" label="Professores" />
                            
                                <MenuItens href="/instituto-musical/escola/receita" label="Financeiro" />
                                <MenuItens href="/instituto-musical/escola/instrumento" label="Instrumentos" />
                            </ul>
                        }
                    </li>

                    {/* Controle de Estoque */}
                    <li>
                        <div
                            className="menu-item"
                            onClick={() => toggleSubMenu('estoque')}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.5em 0.75em",
                                borderRadius: "4px",
                                cursor: "pointer",
                                margin: "0.25em 0",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <span className="icon" style={{ marginRight: "0.5em" }}><FaWarehouse /></span>
                                Loja
                            </span>
                        </div>
                        {expandedItems.estoque && (
                            <ul style={{ marginLeft: "1.5em", borderLeft: "1px solid #34495e", paddingLeft: "0.5em" }}>
                                <MenuItens href="/instituto-musical/loja/home" label="Home" />
                                <MenuItens href="/instituto-musical/loja/produto/controle-estoque" label="Estoque " />
                                <MenuItens href="/instituto-musical/loja/venda/dashboard" label="Vendas " />
                                <MenuItens href="/instituto-musical/loja/receita" label="Financeiro" />
                            </ul>
                        )}
                    </li>

                    {/* Serviços Musicais */}
                    <li>
                        <div
                            className="menu-item"
                            onClick={() => toggleSubMenu('servicos')}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.5em 0.75em",
                                borderRadius: "4px",
                                cursor: "pointer",
                                margin: "0.25em 0",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <span className="icon" style={{ marginRight: "0.5em" }}><FaTools /></span>
                                Projetos
                            </span>
                        </div>
                        {expandedItems.servicos && (
                            <ul style={{ marginLeft: "1.5em", borderLeft: "1px solid #34495e", paddingLeft: "0.5em" }}>
                                <MenuItens href="/instituto-musical/servicos-musicais/home" label="Home" />
                                <MenuItens href="/instituto-musical/servicos-musicais/dashboard" label="Serviços" />
                                <MenuItens href="/instituto-musical/servicos-musicais/pedido/gerenciamento" label="Pedido" />
                                <MenuItens href="/instituto-musical/servicos-musicais/cliente/gerenciamento" label="Clientes" />
                                <MenuItens href="/instituto-musical/servicos-musicais/receita" label="Financeiro" />
                            </ul>
                        )}
                    </li>

                    {/* Administração */}
                    <li>
                        <div
                            className="menu-item is-active"
                            onClick={irParaAdm}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.3em 0.75em",
                                borderRadius: "4px",
                                cursor: "pointer",
                                margin: "0.55em 0",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <span className="icon" style={{ marginRight: "0.5em" }}><FaUsers /></span>
                                Administração
                            </span>
                        </div>
                        
                    </li>
                    <div
                        className="menu-item is-active"
                        onClick={() => toggleSubMenu('admin')}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.3em 0.75em",
                            borderRadius: "4px",
                            cursor: "pointer",
                            margin: "0.55em 0",
                        }}
                    ><LogoutButton /></div>

                </ul>
            </aside>

           
        </>
    );
};

interface MenuItensProps {
    href: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: any;
}

const MenuItens: React.FC<MenuItensProps> = ({ href, label, icon }) => {
    return (
        <li>
            <Link href={href} passHref>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5em 0.43em",
                    borderRadius: "4px",
                    color: "#555",
                    textDecoration: "none",
                    margin: "0.1em 0",
                }}>
                    {icon && <span className="icon" style={{ marginRight: "0.5em" }}>{icon}</span>}
                    {label}
                </div>
            </Link>
        </li>
    );
};
