const API_BASE_URL = 'http://localhost:5000/api';

export interface Alert {
    id: string;
    timestamp: string;
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    attackType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status?: 'new' | 'investigating' | 'resolved';
    confidence?: number;
}

export interface SystemStats {
    totalAlerts: number;
    activeThreats: number;
    blockedAttempts: number;
    systemHealth: number;
}

export interface AttackDistribution {
    type: string;
    count: number;
}

export interface TimeSeriesData {
    timestamp: string;
    value: number;
}

export interface NetworkTraffic {
    timestamp: string;
    bytes: number;
    packets: number;
}

// Fonctions pour les alertes
export async function getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des alertes');
    }
    return response.json();
}

// Fonctions pour les statistiques système
export async function getSystemStats(): Promise<SystemStats> {
    const response = await fetch(`${API_BASE_URL}/stats/system`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques système');
    }
    return response.json();
}

// Fonctions pour la distribution des attaques
export async function getAttackDistribution(): Promise<AttackDistribution[]> {
    const response = await fetch(`${API_BASE_URL}/stats/attacks`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la distribution des attaques');
    }
    return response.json();
}

// Fonctions pour les données de trafic réseau
export async function getNetworkTraffic(): Promise<NetworkTraffic[]> {
    const response = await fetch(`${API_BASE_URL}/stats/traffic`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données de trafic');
    }
    return response.json();
}

// Fonction pour envoyer une nouvelle alerte
export async function sendAlert(alertData: Omit<Alert, 'id'>): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'alerte');
    }
    return response.json();
}

// Fonction pour mettre à jour le statut d'une alerte
export async function updateAlertStatus(alertId: string, status: Alert['status']): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut de l\'alerte');
    }
    return response.json();
} 