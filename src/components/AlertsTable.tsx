'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react';

interface Alert {
    id: number;
    attackType: string;
    timestamp: string;
    severity: string;
    sourceIp: string;
    destinationIp: string;
    protocol: string;
}

interface AlertsTableProps {
    alerts: Alert[];
    error?: string | null;
}

export default function AlertsTable({ alerts, error }: AlertsTableProps) {
    const sortedAlerts = alerts.slice().sort((a: Alert, b: Alert) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const [localAlerts, setLocalAlerts] = useState<Alert[]>(sortedAlerts);
    useEffect(() => {
        setLocalAlerts(sortedAlerts);
    }, [alerts]);

    async function handleDelete(alertId: number) {
        await fetch(`http://localhost:5000/api/stats/alerts/${alertId}`, { method: 'DELETE' });
        setLocalAlerts(prev => prev.filter(a => a.id !== alertId));
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div className="space-y-4">
            {localAlerts.map((alert, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{alert.attackType}</h3>
                            <span className={`px-2 py-1 rounded text-sm ${alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                {alert.severity}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                        </p>
                        <div className="mt-2 text-sm">
                            <p>Source: {alert.sourceIp}</p>
                            <p>Destination: {alert.destinationIp}</p>
                            <p>Protocole: {alert.protocol}</p>
                        </div>
                    </div>
                    <button onClick={() => handleDelete(alert.id)} aria-label="Supprimer l'alerte">
                        <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                    </button>
                </div>
            ))}
            {localAlerts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    Aucune alerte récente
                </div>
            )}
        </div>
    )
} 