"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useNetworkData } from '@/hooks/useNetworkData'

export function SystemStats() {
    const { data, error, isLoading } = useNetworkData();

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (isLoading) {
        return <div className="text-center py-10">Chargement des données...</div>;
    }

    const stats = data?.stats || {
        total_connections: 0,
        total_packets: 0,
        total_alerts: 0,
        active_threats: 0,
        blocked_attempts: 0,
        system_health: 100
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Alertes Totales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_alerts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Menaces Actives
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.active_threats}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Tentatives Bloquées
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.blocked_attempts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Santé du Système
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.system_health}%</div>
                    <Progress value={stats.system_health} className="mt-2" />
                </CardContent>
            </Card>
        </div>
    )
} 