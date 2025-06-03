'use client'

import { useEffect, useState } from 'react'

interface ModelStats {
    performance: {
        total_connections: number
        total_alerts: number
        active_threats: number
        detection_rate: number
        system_health: number
    }
    attack_distribution: Record<string, number>
    recent_alerts: Array<{
        id: number
        sourceIp: string
        destinationIp: string
        protocol: string
        timestamp: string
        attackType: string
        severity: string
    }>
    model_status: 'active' | 'inactive'
}

export default function ModelStats() {
    const [stats, setStats] = useState<ModelStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stats/model-stats')
                if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques')
                const data = await response.json()
                setStats(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
        // Rafraîchir toutes les secondes
        const interval = setInterval(fetchStats, 1000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return <div className="text-center py-10">Chargement des statistiques...</div>
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    if (!stats) {
        return <div className="text-center py-10">Aucune donnée disponible</div>
    }

    return (
        <div className="space-y-6">
            {/* Statut du modèle */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Statut du Modèle d'IA</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${stats.model_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {stats.model_status === 'active' ? 'Actif' : 'Inactif'}
                </span>
            </div>

            {/* Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Taux de Détection</h3>
                    <p className="mt-2 text-3xl font-semibold text-blue-600">
                        {stats.performance.detection_rate}%
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Connexions Total</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {stats.performance.total_connections}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Menaces Actives</h3>
                    <p className="mt-2 text-3xl font-semibold text-red-600">
                        {stats.performance.active_threats}
                    </p>
                </div>
            </div>

            {/* Distribution des attaques */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Distribution des Types d'Attaques</h3>
                <div className="space-y-2">
                    {Object.entries(stats.attack_distribution).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{type}</span>
                            <span className="text-sm font-medium">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alertes récentes */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Alertes Récentes</h3>
                <div className="space-y-4">
                    {stats.recent_alerts.map((alert) => (
                        <div key={alert.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{alert.attackType}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-sm ${alert.severity === 'high'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {alert.severity}
                                </span>
                            </div>
                            <div className="mt-2 text-sm">
                                <p>Source: {alert.sourceIp}</p>
                                <p>Destination: {alert.destinationIp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 