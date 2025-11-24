// components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/app/context/AuthContext/authProvider';
import { Layout } from '@/components/layout';
import { FaSpinner } from 'react-icons/fa';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
   
     router.push('http://localhost:300/instituto-musical/autenticacao/login');
    }
  }, [isAuthenticated, router]);

  // Se não estiver autenticado, não renderiza nada
  if (!isAuthenticated) {
    return (
      <Layout titulo="Carregando...">
        <div className="section">
          <div className="container">
            <div className="box has-text-centered">
              <span className="icon is-large">
                <FaSpinner className="fa-spin" />
              </span>
              <p>Carregando dados financeiros...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}