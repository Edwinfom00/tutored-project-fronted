import AlertsTable from "@/components/AlertsTable";


export default function AlertsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Alertes de sécurité</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
                </div>
            </div>
            <AlertsTable />
        </div>
    )
} 