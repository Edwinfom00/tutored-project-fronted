import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TestLog {
    id: string
    timestamp: string
    testType: string
    input: string
    prediction: string
    confidence: number
    actualClass?: string
    status: 'success' | 'error' | 'warning'
}

interface TestLogsProps {
    logs: TestLog[]
}

export function TestLogs({ logs }: TestLogsProps) {
    return (
        <Card className="col-span-6">
            <CardHeader>
                <CardTitle>Logs des Tests</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Type de Test</TableHead>
                                <TableHead>Entrée</TableHead>
                                <TableHead>Prédiction</TableHead>
                                <TableHead>Confiance</TableHead>
                                <TableHead>Classe Réelle</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>{log.testType}</TableCell>
                                    <TableCell className="font-mono text-sm">{log.input}</TableCell>
                                    <TableCell>{log.prediction}</TableCell>
                                    <TableCell>{(log.confidence * 100).toFixed(2)}%</TableCell>
                                    <TableCell>{log.actualClass || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                log.status === 'success' ? 'default' :
                                                    log.status === 'warning' ? 'warning' : 'destructive'
                                            }
                                        >
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
} 