"use client";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

interface Rule {
    id: number;
    name: string;
    description: string;
    action: string;
}

export default function RulesPage() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [newRule, setNewRule] = useState<Partial<Rule>>({ name: '', description: '', action: '' });

    // Charger les règles au montage
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/rules')
            .then(res => res.json())
            .then(data => {
                setRules(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors du chargement des règles.");
                setLoading(false);
            });
    }, []);

    // Sauvegarder les règles
    const saveRules = async (updatedRules: Rule[]) => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await fetch('http://localhost:5000/api/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRules)
            });
            if (!res.ok) throw new Error();
            setRules(await res.json());
            setSuccess(true);
        } catch {
            setError("Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
            setTimeout(() => setSuccess(false), 2000);
        }
    };

    // Ajouter une règle
    const handleAddRule = () => {
        if (!newRule.name || !newRule.description || !newRule.action) return;
        const nextId = rules.length ? Math.max(...rules.map(r => r.id)) + 1 : 1;
        const updatedRules = [...rules, { ...newRule, id: nextId } as Rule];
        setRules(updatedRules);
        setNewRule({ name: '', description: '', action: '' });
        saveRules(updatedRules);
    };

    // Modifier une règle
    const handleEditRule = (id: number, field: keyof Rule, value: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    // Sauvegarder l'édition
    const handleSaveEdit = () => {
        saveRules(rules);
        setEditId(null);
    };

    // Supprimer une règle
    const handleDeleteRule = (id: number) => {
        const updatedRules = rules.filter(r => r.id !== id);
        setRules(updatedRules);
        saveRules(updatedRules);
    };

    if (loading) return <div className="text-center py-10">Chargement...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Règles de Détection</h1>
            <p className="mb-8 text-gray-700">Consultez, ajoutez ou modifiez dynamiquement les règles de détection d&apos;intrusion appliquées par le système.</p>
            {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
            {success && <div className="mb-4 text-green-600 font-semibold">Règles enregistrées !</div>}
            <div className="space-y-6 mb-10">
                {rules.map(rule => (
                    <div key={rule.id} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 relative">
                        {editId === rule.id ? (
                            <>
                                <Input
                                    className="text-xl font-bold mb-1 border-b border-blue-200 focus:outline-none focus:border-blue-600"
                                    value={rule.name}
                                    onChange={e => handleEditRule(rule.id, 'name', e.target.value)}
                                />
                                <Textarea
                                    className="mb-1 text-gray-700 border-b border-blue-100 focus:outline-none focus:border-blue-600"
                                    value={rule.description}
                                    onChange={e => handleEditRule(rule.id, 'description', e.target.value)}
                                />
                                <Input
                                    className="mb-1 text-gray-700 border-b border-blue-100 focus:outline-none focus:border-blue-600"
                                    value={rule.action}
                                    onChange={e => handleEditRule(rule.id, 'action', e.target.value)}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button className="px-4 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700" onClick={() => handleSaveEdit}>Enregistrer</button>
                                    <button className="px-4 py-1 rounded bg-gray-200 text-gray-700 font-semibold" onClick={() => setEditId(null)}>Annuler</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-1">{rule.name}</h2>
                                <p className="mb-1 text-gray-700">{rule.description}</p>
                                <div className="mb-1">
                                    <span className="font-semibold text-blue-700">Action :</span> {rule.action}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={() => setEditId(rule.id)}>Modifier</button>
                                    <button className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700" onClick={() => handleDeleteRule(rule.id)}>Supprimer</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 max-w-xl mx-auto">
                <h2 className="text-lg font-semibold mb-2">Ajouter une règle</h2>
                <input
                    className="border-b border-blue-200 focus:outline-none focus:border-blue-600 py-1"
                    placeholder="Nom de la règle"
                    value={newRule.name}
                    onChange={e => setNewRule(r => ({ ...r, name: e.target.value }))}
                />
                <textarea
                    className="border-b border-blue-100 focus:outline-none focus:border-blue-600 py-1"
                    placeholder="Description de la règle"
                    value={newRule.description}
                    onChange={e => setNewRule(r => ({ ...r, description: e.target.value }))}
                />
                <input
                    className="border-b border-blue-100 focus:outline-none focus:border-blue-600 py-1"
                    placeholder="Action à effectuer"
                    value={newRule.action}
                    onChange={e => setNewRule(r => ({ ...r, action: e.target.value }))}
                />
                <button
                    className="mt-2 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 self-end"
                    onClick={handleAddRule}
                >
                    Ajouter la règle
                </button>
            </div>
        </div>
    );
} 