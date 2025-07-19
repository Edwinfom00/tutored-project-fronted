"use client";

import { ModelMetrics } from "@/components/dashboard/ModelMetrics"
import { TestLogs } from "@/components/dashboard/TestLogs"

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';


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

    // Adapter les logs pour TestLogs
    const logsForChart = logs.map((log, i) => ({
        id: i.toString(),
        timestamp: log.timestamp,
        testType: log.test_type,
        input: log.input,
        prediction: log.prediction,
        confidence: log.confidence,
        actualClass: log.true_class,
        status: log.status as 'success' | 'error' | 'warning',
    }))

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-10 text-gray-900">Tableau de bord du Modèle d&apos;IA</h1>
            <div className="bg-white rounded-2xl shadow p-8 mb-10">
                <div className="flex gap-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold transition ${tab === 'metrics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setTab('metrics')}
                    >
                        Métriques Actuelles
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold transition ${tab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setTab('history')}
                    >
                        Historique d&apos;Entraînement
                    </button>
                </div>
                {tab === 'metrics' && metrics && (
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <span className="text-gray-500 text-sm">Dernière mise à jour : {metrics.last_update ? new Date(metrics.last_update).toLocaleString() : 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
                            <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center shadow">
                                <span className="text-blue-700 font-bold text-lg">Accuracy</span>
                                <span className="text-3xl font-extrabold text-blue-700">{(metrics.accuracy * 100).toFixed(2)}%</span>
                            </div>
                            <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow">
                                <span className="text-green-700 font-bold text-lg">Precision</span>
                                <span className="text-3xl font-extrabold text-green-700">{(metrics.precision * 100).toFixed(2)}%</span>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center shadow">
                                <span className="text-yellow-700 font-bold text-lg">Recall</span>
                                <span className="text-3xl font-extrabold text-yellow-700">{(metrics.recall * 100).toFixed(2)}%</span>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-6 flex flex-col items-center shadow">
                                <span className="text-purple-700 font-bold text-lg">F1-score</span>
                                <span className="text-3xl font-extrabold text-purple-700">{(metrics.f1_score * 100).toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>
                )}
                {tab === 'history' && (
                    <div>
                        <div className="mb-6">
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={history} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString()} tick={{ fontSize: 13, fill: '#334155' }} />
                                    <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 13, fill: '#334155' }} />
                                    <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="accuracy" stroke="#2563eb" name="Accuracy" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="precision" stroke="#16a34a" name="Precision" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="recall" stroke="#f59e42" name="Recall" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="f1_score" stroke="#a21caf" name="F1-score" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <table className="min-w-full mt-4 bg-white rounded-xl overflow-hidden shadow">
                            <thead>
                                <tr>
                                    <th className="text-left px-4 py-2">Date</th>
                                    <th className="text-left px-4 py-2">Accuracy</th>
                                    <th className="text-left px-4 py-2">Precision</th>
                                    <th className="text-left px-4 py-2">Recall</th>
                                    <th className="text-left px-4 py-2">F1-score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h, i) => (
                                    <tr key={i} className="border-b last:border-none">
                                        <td className="px-4 py-2">{new Date(h.date).toLocaleString()}</td>
                                        <td className="px-4 py-2">{(h.accuracy * 100).toFixed(2)}%</td>
                                        <td className="px-4 py-2">{(h.precision * 100).toFixed(2)}%</td>
                                        <td className="px-4 py-2">{(h.recall * 100).toFixed(2)}%</td>
                                        <td className="px-4 py-2">{(h.f1_score * 100).toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-2xl shadow p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Logs des Tests</h2>
                <TestLogs logs={logsForChart} />
            </div>
        </div>
    )
} 