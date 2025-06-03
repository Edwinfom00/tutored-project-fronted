"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface MetricsProps {
    accuracy: number
    precision: number
    recall: number
    trainingHistory: {
        epoch: number
        loss: number
        accuracy: number
        val_loss: number
        val_accuracy: number
    }[]
}

export function ModelMetrics({ accuracy, precision, recall, trainingHistory }: MetricsProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Métriques du Modèle</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="metrics">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="metrics">Métriques Actuelles</TabsTrigger>
                        <TabsTrigger value="history">Historique d&apos;Entraînement</TabsTrigger>
                    </TabsList>

                    <TabsContent value="metrics" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Accuracy</div>
                                    <div className="text-sm text-muted-foreground">{accuracy}%</div>
                                </div>
                                <Progress value={accuracy} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Precision</div>
                                    <div className="text-sm text-muted-foreground">{precision}%</div>
                                </div>
                                <Progress value={precision} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Recall</div>
                                    <div className="text-sm text-muted-foreground">{recall}%</div>
                                </div>
                                <Progress value={recall} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history">
                        <div className="h-[400px] w-full">
                            <LineChart width={800} height={400} data={trainingHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="epoch" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="accuracy" stroke="#8884d8" name="Accuracy" />
                                <Line type="monotone" dataKey="val_accuracy" stroke="#82ca9d" name="Validation Accuracy" />
                                <Line type="monotone" dataKey="loss" stroke="#ff7300" name="Loss" />
                                <Line type="monotone" dataKey="val_loss" stroke="#ff0000" name="Validation Loss" />
                            </LineChart>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
} 