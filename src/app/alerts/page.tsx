"use client";
import AlertsTable from "@/components/AlertsTable";
import { useEffect, useState } from "react";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/stats/alerts")
            .then(res => res.json())
            .then(data => setAlerts(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="space-y-6 p-7">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Alertes de sécurité</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
                </div>
            </div>
            <AlertsTable alerts={alerts} error={error} />
        </div>
    )
} 