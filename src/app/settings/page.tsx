"use client";

import { useState, useEffect } from 'react';

const MODULES = [
    { id: 'dos', label: 'Détection DoS' },
    { id: 'bruteforce', label: 'Détection Brute Force' },
    { id: 'probe', label: 'Détection Scan réseau' },
    { id: 'sql_injection', label: 'Détection SQL Injection' },
    { id: 'xss', label: 'Détection XSS' },
    { id: 'port_scan', label: 'Détection Port Scan' },
    { id: 'r2l', label: 'Détection Remote to Local (R2L)' },
    { id: 'u2r', label: 'Détection User to Root (U2R)' },
];

export default function SettingsPage() {
    const [thresholds, setThresholds] = useState({ bruteForce: 10, dos: 1000 });
    const [activeModules, setActiveModules] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Charger la config réelle au montage
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/settings')
            .then(res => res.json())
            .then(data => {
                setThresholds(data.thresholds);
                setActiveModules(data.modules);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors du chargement de la configuration.");
                setLoading(false);
            });
    }, []);

    // Sauvegarder la config
    const saveSettings = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await fetch('http://localhost:5000/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ thresholds, modules: activeModules })
            });
            if (!res.ok) throw new Error();
            setSuccess(true);
        } catch {
            setError("Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
            setTimeout(() => setSuccess(false), 2000);
        }
    };

    if (loading) return <div className="text-center py-10">Chargement...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Paramètres du Système</h1>
            <p className="mb-8 text-gray-700">Personnalisez les paramètres de détection d&apos;intrusion. Les modifications sont enregistrées côté backend.</p>
            {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
            {success && <div className="mb-4 text-green-600 font-semibold">Configuration enregistrée !</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Seuils d'alerte */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
                    <h2 className="text-xl font-semibold mb-2">Seuils d&apos;alerte</h2>
                    <div>
                        <label className="block font-medium mb-1">Seuil Brute Force (tentatives)</label>
                        <input
                            type="range"
                            min={3}
                            max={50}
                            value={thresholds.bruteForce}
                            onChange={e => setThresholds(t => ({ ...t, bruteForce: Number(e.target.value) }))}
                            className="w-full accent-blue-600"
                        />
                        <div className="text-sm text-gray-600 mt-1">Déclenche une alerte brute force après <span className="font-bold text-blue-700">{thresholds.bruteForce}</span> tentatives échouées.</div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Seuil DoS (requêtes/minute)</label>
                        <input
                            type="range"
                            min={100}
                            max={5000}
                            step={100}
                            value={thresholds.dos}
                            onChange={e => setThresholds(t => ({ ...t, dos: Number(e.target.value) }))}
                            className="w-full accent-green-600"
                        />
                        <div className="text-sm text-gray-600 mt-1">Déclenche une alerte DoS au-delà de <span className="font-bold text-green-700">{thresholds.dos}</span> requêtes/minute.</div>
                    </div>
                </div>
                {/* Modules actifs */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
                    <h2 className="text-xl font-semibold mb-2">Modules actifs</h2>
                    <div className="space-y-3">
                        {MODULES.map(module => (
                            <label key={module.id} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!activeModules[module.id]}
                                    onChange={e => setActiveModules(m => ({ ...m, [module.id]: e.target.checked }))}
                                    className="accent-blue-600 w-5 h-5 rounded"
                                />
                                <span className="text-gray-800 font-medium">{module.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-8">
                <button
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
                    onClick={saveSettings}
                    disabled={saving}
                >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    );
} 