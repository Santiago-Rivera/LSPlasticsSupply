import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook de Protección de Código
 * Protege componentes y páginas contra modificaciones no autorizadas
 */
export function useCodeProtection(requireAuth = true) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!requireAuth) {
            setIsAuthorized(true);
            setIsLoading(false);
            return;
        }

        // Verificar si hay una sesión válida
        const checkAuth = async () => {
            try {
                const sessionCookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('ls-auth-session='));

                if (!sessionCookie) {
                    router.push('/auth/protection');
                    return;
                }

                const localAuth = localStorage.getItem('ls-auth-verified');
                if (localAuth === 'true') {
                    setIsAuthorized(true);
                } else {
                    router.push('/auth/protection');
                }
            } catch (error) {
                console.error('Error verificando autorización:', error);
                router.push('/auth/protection');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [requireAuth, router]);

    return { isAuthorized, isLoading };
}

/**
 * Componente de Protección de Desarrollo
 * Se activa automáticamente en modo desarrollo
 */
export function DevProtectionWrapper({ children }) {
    const [showProtection, setShowProtection] = useState(false);
    const { isAuthorized, isLoading } = useCodeProtection(showProtection);

    useEffect(() => {
        // Detectar si estamos en modo desarrollo o si hay intentos de modificación
        const isDev = process.env.NODE_ENV === 'development' ||
                     window.location.hostname === 'localhost';

        // Detectar herramientas de desarrollo abiertas
        const detectDevTools = () => {
            const threshold = 160;
            setShowProtection(
                window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold ||
                isDev
            );
        };

        detectDevTools();
        window.addEventListener('resize', detectDevTools);

        // Proteger contra ataques de consola
        if (typeof window !== 'undefined') {
            const originalLog = console.log;
            console.log = function(...args) {
                if (args.some(arg =>
                    typeof arg === 'string' &&
                    (arg.includes('modify') || arg.includes('hack') || arg.includes('bypass'))
                )) {
                    setShowProtection(true);
                }
                originalLog.apply(console, args);
            };
        }

        return () => {
            window.removeEventListener('resize', detectDevTools);
        };
    }, []);

    if (showProtection && isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                fontSize: '18px'
            }}>
                🔐 Verificando autorización...
            </div>
        );
    }

    if (showProtection && !isAuthorized) {
        return null; // El hook se encarga de redirigir
    }

    return children;
}

/**
 * HOC (Higher Order Component) para proteger páginas completas
 */
export function withCodeProtection(WrappedComponent, options = {}) {
    return function ProtectedComponent(props) {
        const { requireAuth = true, redirectTo = '/auth/protection' } = options;
        const { isAuthorized, isLoading } = useCodeProtection(requireAuth);

        if (requireAuth && isLoading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    color: 'white'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛡️</div>
                        <div>Verificando permisos de acceso...</div>
                    </div>
                </div>
            );
        }

        if (requireAuth && !isAuthorized) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
