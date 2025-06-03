import { useEffect, useRef, useState } from 'react';

interface NetworkData {
    connections: Array<{
        timestamp: string;
        source_ip: string;
        source_port: number;
        destination_ip: string | null;
        destination_port: number | null;
        status: string;
        type: string;
    }>;
    alerts: Array<{
        timestamp: string;
        source_ip: string;
        destination_ip: string | null;
        protocol: string;
        attack_type: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        confidence: number;
    }>;
    stats: {
        total_connections: number;
        total_packets: number;
        total_alerts: number;
        active_threats: number;
        blocked_attempts: number;
        system_health: number;
    };
}

export function useNetworkData() {
    const [data, setData] = useState<NetworkData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stats/traffic');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newData = await response.json();
                setData(newData);
                setError(null);
            } catch (err) {
                console.error('Erreur lors de la récupération des données:', err);
                setError(err instanceof Error ? err.message : 'Erreur de connexion');
            } finally {
                setIsLoading(false);
            }
        };

        // Première requête immédiate
        fetchData();

        // Configurer le polling toutes les 2 secondes
        pollingInterval.current = setInterval(fetchData, 2000);

        // Nettoyer l'intervalle lors du démontage
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, []);

    return {
        data,
        error,
        isLoading
    };
} 