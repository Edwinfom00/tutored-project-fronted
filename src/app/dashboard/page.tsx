"use client";

import { ModelMetrics } from "@/components/dashboard/ModelMetrics"

import { useEffect, useState } from 'react'



interface ModelMetrics {
    accuracy: number
    precision: number
    recall: number
    f1_score: number
    last_update: string | null
}

interface TrainingHistoryItem {
    date: string
    accuracy: number
    precision: number
    recall: number
    f1_score: number
}

interface TestLog {
    timestamp: string
    test_type: string
    input: string
    prediction: string
    confidence: number
    true_class: string
    status: string
}

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
    const [history, setHistory] = useState<TrainingHistoryItem[]>([])
    const [logs, setLogs] = useState<TestLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tab, setTab] = useState<'metrics' | 'history'>('metrics')

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [metricsRes, historyRes, logsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/stats/model-metrics'),
                    fetch('http://localhost:5000/api/stats/training-history'),
                    fetch('http://localhost:5000/api/stats/test-logs'),
                ])
                if (!metricsRes.ok || !historyRes.ok || !logsRes.ok) throw new Error('Erreur lors de la récupération des données')
                setMetrics(await metricsRes.json())
                setHistory(await historyRes.json())
                setLogs(await logsRes.json())
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue')
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    if (loading) return <div className="text-center py-10">Chargement...</div>
    if (error) return <div className="text-red-500">{error}</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Tableau de bord du Modèle d&apos;IA</h1>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${tab === 'metrics' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                        onClick={() => setTab('metrics')}
                    >
                        Métriques Actuelles
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${tab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                        onClick={() => setTab('history')}
                    >
                        Historique d&apos;Entraînement
                    </button>
                </div>
                {tab === 'metrics' && metrics && (
                    <div>
                        <div className="mb-2">Dernière mise à jour : {metrics.last_update ? new Date(metrics.last_update).toLocaleString() : 'N/A'}</div>
                        <div className="space-y-2">
                            <div>Accuracy <span className="float-right font-semibold">{metrics.accuracy * 100}%</span></div>
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-600 rounded" style={{ width: `${metrics.accuracy * 100}%` }}></div>
                            </div>
                            <div>Precision <span className="float-right font-semibold">{metrics.precision * 100}%</span></div>
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-600 rounded" style={{ width: `${metrics.precision * 100}%` }}></div>
                            </div>
                            <div>Recall <span className="float-right font-semibold">{metrics.recall * 100}%</span></div>
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-600 rounded" style={{ width: `${metrics.recall * 100}%` }}></div>
                            </div>
                            <div>F1-score <span className="float-right font-semibold">{metrics.f1_score * 100}%</span></div>
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-600 rounded" style={{ width: `${metrics.f1_score * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                )}
                {tab === 'history' && (
                    <div>
                        <table className="min-w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="text-left">Date</th>
                                    <th className="text-left">Accuracy</th>
                                    <th className="text-left">Precision</th>
                                    <th className="text-left">Recall</th>
                                    <th className="text-left">F1-score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h, i) => (
                                    <tr key={i} className="border-b">
                                        <td>{new Date(h.date).toLocaleString()}</td>
                                        <td>{(h.accuracy * 100).toFixed(2)}%</td>
                                        <td>{(h.precision * 100).toFixed(2)}%</td>
                                        <td>{(h.recall * 100).toFixed(2)}%</td>
                                        <td>{(h.f1_score * 100).toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Logs des Tests</h2>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Timestamp</th>
                            <th className="text-left">Type de Test</th>
                            <th className="text-left">Entrée</th>
                            <th className="text-left">Prédiction</th>
                            <th className="text-left">Confiance</th>
                            <th className="text-left">Classe Réelle</th>
                            <th className="text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i} className="border-b">
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.test_type}</td>
                                <td>{log.input}</td>
                                <td>{log.prediction}</td>
                                <td>{(log.confidence * 100).toFixed(2)}%</td>
                                <td>{log.true_class}</td>
                                <td><span className={`px-2 py-1 rounded text-xs ${log.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{log.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 