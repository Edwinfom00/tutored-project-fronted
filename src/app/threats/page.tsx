import { THREATS } from '@/data/threats';

export default function ThreatsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Menaces détectées par le système</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {THREATS.map(threat => (
                    <div key={threat.id} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 border-t-4" style={{ borderTopColor: threat.id === 'dos' ? '#22c55e' : threat.id === 'scan' ? '#f59e42' : '#ef4444' }}>
                        <h2 className="text-xl font-bold mb-1">{threat.name}</h2>
                        <p className="mb-1 text-gray-700">{threat.description}</p>
                        <div className="mb-1">
                            <span className="font-semibold text-blue-700">Détection :</span> {threat.detection_method}
                        </div>
                        <div className="mb-1">
                            <span className="font-semibold text-green-700">Mitigation :</span> {threat.mitigation}
                        </div>
                        <div className="mb-1">
                            <span className="font-semibold text-gray-600">Exemple :</span> <span className="italic">{threat.example}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 