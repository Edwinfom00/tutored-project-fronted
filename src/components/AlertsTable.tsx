'use client'

import { useEffect, useState } from 'react'

interface Alert {
    id: string
    sourceIp: string
    destinationIp: string
    protocol: string
    timestamp: string
    attackType: string
    severity: 'low' | 'medium' | 'high'
}

export default function AlertsTable() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stats/alerts')
                if (!response.ok) throw new Error('Erreur lors de la récupération des alertes')
                const data = await response.json()
                setAlerts(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue')
                // Données de test en cas d'erreur
                setAlerts([
                    {
                        id: '1',
                        sourceIp: '192.168.1.100',
                        destinationIp: '10.0.0.5',
                        protocol: 'TCP',
                        timestamp: new Date().toISOString(),
                        attackType: 'SQL Injection',
                        severity: 'high'
                    },
                    {
                        id: '2',
                        sourceIp: '172.16.0.23',
                        destinationIp: '192.168.1.1',
                        protocol: 'UDP',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        attackType: 'Port Scan',
                        severity: 'medium'
                    }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchAlerts()
        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(fetchAlerts, 30000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return <div className="text-center py-10">Chargement des alertes...</div>
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div className="space-y-4">
            {alerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{alert.attackType}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(alert.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {alert.severity}
                        </span>
                    </div>
                    <div className="mt-2 text-sm">
                        <p>Source: {alert.sourceIp}</p>
                        <p>Destination: {alert.destinationIp}</p>
                        <p>Protocole: {alert.protocol}</p>
                    </div>
                </div>
            ))}
            {alerts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    Aucune alerte récente
                </div>
            )}
        </div>
    )
} 