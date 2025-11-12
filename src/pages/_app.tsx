
import type { AppProps } from "next/app";
import { AuthProvider } from '@/app/context/AuthContext/authProvider';
import 'bulma/css/bulma.css'
import '@/Styles/global.css'



export default function App({ Component, pageProps }: AppProps) {
  return (

    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    
  );
}
