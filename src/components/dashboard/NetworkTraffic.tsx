"use client";
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useNetworkData } from '@/hooks/useNetworkData';


interface NetworkData {
    timestamp: number;
    bytes: number;
    packets: number;
}

export function NetworkTraffic() {
    const [chartData, setChartData] = useState<NetworkData[]>([])
    const { data, error, isLoading } = useNetworkData()

    useEffect(() => {
        if (data && data.stats) {
            const newData = {
                timestamp: Date.now(),
                bytes: 0, // No total_bytes, set to 0 or remove if not needed
                packets: data.stats.total_packets || 0
            }
            setChartData(prevData => {
                const updatedData = [...prevData, newData]
                return updatedData.slice(-100)
            })
        }
    }, [data])

    if (error) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle className="text-red-500">Erreur de Connexion</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-red-600">{error}</div>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Connexion au Serveur</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10">Tentative de connexion au serveur en cours...</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Trafic Réseau en Temps Réel</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                                formatter={(value) => [value, 'Paquets']}
                            />
                            <Line
                                type="monotone"
                                dataKey="packets"
                                stroke="#82ca9d"
                                name="Paquets"
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
} 