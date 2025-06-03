"use client";
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useNetworkData } from '@/hooks/useWebSocket'

interface NetworkData {
    timestamp: number;
    bytes: number;
    packets: number;
}

export function NetworkTraffic() {
    const [data, setData] = useState<NetworkData[]>([])
    const { lastData, error, isConnected } = useNetworkData()

    useEffect(() => {
        if (lastData && lastData.type === 'stats') {
            const newData = {
                timestamp: new Date(lastData.data.timestamp || Date.now()).getTime(),
                bytes: lastData.data.total_bytes || 0,
                packets: lastData.data.total_packets || 0
            }
            setData(prevData => {
                const updatedData = [...prevData, newData]
                // Garder seulement les 100 derniers points pour éviter la surcharge
                return updatedData.slice(-100)
            })
        }
    }, [lastData])

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



    if (!isConnected) {
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
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                            />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                                formatter={(value, name) => {
                                    if (name === 'bytes') return [`${(Number(value) / 1024 / 1024).toFixed(2)} MB`, 'Octets']
                                    return [value, 'Paquets']
                                }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="bytes"
                                stroke="#8884d8"
                                name="Octets"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
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