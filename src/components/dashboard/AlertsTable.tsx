"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNetworkData } from '@/hooks/useNetworkData'

export function AlertsTable() {
    const { data, error, isLoading } = useNetworkData();

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (isLoading) {
        return <div className="text-center py-10">Chargement des alertes...</div>;
    }

    const alerts = data?.alerts || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alertes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                        {alerts.length === 0 ? (
                            <div className="text-center text-muted-foreground">
                                Aucune alerte récente
                            </div>
                        ) : (
                            alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {alert.source_ip} → {alert.destination_ip || 'unknown'}
                                            </span>
                                            <Badge variant={
                                                alert.severity === 'critical' ? 'destructive' :
                                                    alert.severity === 'high' ? 'default' :
                                                        alert.severity === 'medium' ? 'secondary' :
                                                            'outline'
                                            }>
                                                {alert.severity}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {alert.attack_type} • {alert.protocol}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
} 