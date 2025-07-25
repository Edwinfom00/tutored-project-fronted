import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import { useMemo, useState, useEffect } from 'react';
import jsPDF from 'jspdf';

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

const STATUS_COLORS: Record<string, string> = {
    success: '#22c55e', // green-500
    error: '#ef4444',   // red-500
    warning: '#f59e42', // orange-400
};

const STATUS_LABELS: Record<string, string> = {
    all: 'Tous',
    success: 'Succès',
    error: 'Erreur',
    warning: 'Avertissement',
};

function exportCSV(logs: TestLog[]) {
    const header = ['Timestamp', 'Type de Test', 'Entrée', 'Prédiction', 'Confiance', 'Classe Réelle', 'Status'];
    const rows = logs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.testType,
        log.input,
        log.prediction,
        (log.confidence * 100).toFixed(2) + '%',
        log.actualClass || '',
        log.status
    ]);
    const csv = [header, ...rows].map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// Type pour le paramètre de didDrawCell (jspdf-autotable)
type AutoTableCellData = {
    column: { index: number };
    cell: { raw: string };
};

async function exportPDF(logs: TestLog[]) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Logs des Tests', 14, 18);
    const tableData = logs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.testType,
        log.prediction,
        (log.confidence * 100).toFixed(2) + '%',
        log.actualClass || '',
        log.status,
        log.input
    ]);
    doc.autoTable({
        head: [['Date', 'Type de Test', 'Prédiction', 'Confiance', 'Classe Réelle', 'Statut', 'Features']],
        body: tableData,
        startY: 24,
        styles: { fontSize: 8, cellWidth: 'wrap' },
        headStyles: { fillColor: [30, 58, 138] },
        columnStyles: {
            0: { cellWidth: 28 },
            1: { cellWidth: 22 },
            2: { cellWidth: 22 },
            3: { cellWidth: 18 },
            4: { cellWidth: 22 },
            5: { cellWidth: 18 },
            6: { cellWidth: 60 },
        },
        didDrawCell: (data: AutoTableCellData) => {
            if (data.column.index === 5) {
                const status = data.cell.raw;
                let color = '#22c55e';
                if (status === 'error') color = '#ef4444';
                if (status === 'warning') color = '#f59e42';
                doc.setTextColor(color);
            } else {
                doc.setTextColor('#111');
            }
        },
        margin: { left: 10, right: 10 },
        pageBreak: 'auto',
    });
    doc.save('test_logs.pdf');
}

// Label personnalisé pour le PieChart
function renderCustomLabel(props: PieLabelRenderProps & { name: string; value: number; fill: string }) {
    const { cx, cy, midAngle, outerRadius, percent, name, value, fill } = props;
    if (!value || !percent) return null;
    const RADIAN = Math.PI / 180;
    const cxNum = Number(cx);
    const cyNum = Number(cy);
    const radius = Number(outerRadius) + 24;
    const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
    const y = cyNum + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill={fill}
            textAnchor={x > cxNum ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={16}
            fontWeight={600}
        >
            {name}: {(percent * 100).toFixed(1)}%
        </text>
    );
}

export function TestLogs({ logs }: TestLogsProps) {
    const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error' | 'warning'>('all');
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
    // Filtrer les logs selon le statut
    const filteredLogs = useMemo(() => statusFilter === 'all' ? logs : logs.filter(l => l.status === statusFilter), [logs, statusFilter]);
    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE) || 1;
    const paginatedLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    // Préparer les données pour le PieChart
    const pieData = useMemo(() => {
        const counts = { success: 0, error: 0, warning: 0 };
        logs.forEach(l => { if (counts[l.status] !== undefined) counts[l.status]++; });
        return [
            { name: 'Succès', value: counts.success, color: STATUS_COLORS.success },
            { name: 'Erreur', value: counts.error, color: STATUS_COLORS.error },
            { name: 'Avertissement', value: counts.warning, color: STATUS_COLORS.warning },
        ];
    }, [logs]);

    // Reset page to 1 when filter changes
    useEffect(() => { setPage(1); }, [statusFilter, logs]);

    // Pagination compacte corrigée
    function getPaginationNumbers(current: number, total: number) {
        const delta = 2;
        const range: (number | string)[] = [];
        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);
        // Toujours la page 1
        range.push(1);
        // Ellipse si besoin
        if (left > 2) range.push('...');
        // Pages proches
        for (let i = left; i <= right; i++) {
            range.push(i);
        }
        // Ellipse si besoin
        if (right < total - 1) range.push('...');
        // Toujours la dernière page
        if (total > 1) range.push(total);
        return range;
    }
    const paginationNumbers = getPaginationNumbers(page, totalPages);

    return (
        <Card className="col-span-6 bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-6">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle className="text-xl font-bold text-blue-700 tracking-tight">Logs des Tests</CardTitle>
                    <div className="flex gap-2 items-center">
                        <label className="font-medium text-gray-600">Filtrer :</label>
                        <select
                            className="rounded border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as "all" | "success" | "error" | "warning")}
                            title="Filtrer les logs par statut"
                        >
                            <option value="all">Tous</option>
                            <option value="success">Succès</option>
                            <option value="error">Erreur</option>
                            <option value="warning">Avertissement</option>
                        </select>
                        <button
                            className="ml-4 px-3 py-1 rounded bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition"
                            onClick={() => exportCSV(filteredLogs)}
                        >
                            Export CSV
                        </button>
                        <button
                            className="ml-2 px-3 py-1 rounded bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                            onClick={async () => await exportPDF(filteredLogs)}
                        >
                            Export PDF
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Pie Chart de synthèse (stat circle) */}
                <div className="w-full h-[300px] flex flex-col items-center justify-center mb-8">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={renderCustomLabel}
                                labelLine={false}
                            >
                                {pieData.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.color} />
                                ))}
                            </Pie>
                            {/* Pourcentage au centre si une seule part > 0 */}
                            {pieData.filter(d => d.value > 0).length === 1 && (
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={32}
                                    fontWeight={700}
                                    fill={pieData.find(d => d.value > 0)?.color || '#222'}
                                >
                                    100%
                                </text>
                            )}
                            <Tooltip
                                formatter={(value: number, name: string) => [`${value}`, name]}
                                contentStyle={{ background: '#1e293b', color: '#fff', borderRadius: 10, fontSize: 14 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-8 mt-2">
                        {pieData.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                                <span className="font-medium text-gray-700">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Liste/Accordion des logs détaillés */}
                <div className="divide-y divide-gray-200">
                    {paginatedLogs.length === 0 && (
                        <div className="text-center text-gray-500 py-8">Aucun log à afficher pour ce filtre.</div>
                    )}
                    {paginatedLogs.map((log, i) => {
                        const globalIndex = (page - 1) * PAGE_SIZE + i;
                        return (
                            <div key={log.id} className="py-4">
                                <button
                                    className="w-full flex items-center justify-between text-left focus:outline-none"
                                    onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-block w-3 h-3 rounded-full`} style={{ background: STATUS_COLORS[log.status] }}></span>
                                        <span className="font-semibold text-gray-800">{new Date(log.timestamp).toLocaleString()}</span>
                                        <span className="text-sm text-gray-500">({STATUS_LABELS[log.status]})</span>
                                        <span className="ml-2 text-blue-700 font-semibold">{log.prediction}</span>
                                        <span className="ml-2 text-gray-600">{(log.confidence * 100).toFixed(2)}%</span>
                                        <span className="ml-2 text-gray-500">{log.testType}</span>
                                    </div>
                                    <span className="text-blue-600 font-bold text-lg">{openIndex === globalIndex ? '-' : '+'}</span>
                                </button>
                                {openIndex === globalIndex && (
                                    <div className="mt-3 bg-blue-50 rounded-lg p-4 shadow-inner">
                                        <div className="mb-1"><b>Date :</b> {new Date(log.timestamp).toLocaleString()}</div>
                                        <div className="mb-1"><b>Type de test :</b> {log.testType}</div>
                                        <div className="mb-1"><b>Prédiction :</b> {log.prediction}</div>
                                        <div className="mb-1"><b>Confiance :</b> {(log.confidence * 100).toFixed(2)}%</div>
                                        <div className="mb-1"><b>Classe réelle :</b> {log.actualClass || 'N/A'}</div>
                                        <div className="mb-1"><b>Status :</b> <span style={{ color: STATUS_COLORS[log.status] }}>{STATUS_LABELS[log.status]}</span></div>
                                        <div className="mb-1">
                                            <b>Features :</b>
                                            <pre className="max-h-40 overflow-auto text-xs bg-white border border-blue-100 rounded p-2 mt-1">{log.input}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                {/* Pagination compacte */}
                {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-6">
                        <span className="text-gray-600 text-sm mr-2">Page {page} sur {totalPages}</span>
                        <div className="flex gap-1 flex-wrap">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Précédent
                            </button>
                            {paginationNumbers.map((num, idx) =>
                                num === '...'
                                    ? <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                                    : <button
                                        key={`page-${num}`}
                                        className={`px-3 py-1 rounded font-semibold ${page === num ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                        onClick={() => setPage(Number(num))}
                                        disabled={num === '...'}
                                    >
                                        {num}
                                    </button>
                            )}
                            <button
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 