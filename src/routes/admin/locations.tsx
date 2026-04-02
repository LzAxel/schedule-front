import { useState } from 'react';
import { LocationForm, LocationsList } from '@/components/admin/locations/locations-components';
import type { Location } from '@/lib/api';
import { Plus } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/locations')({
	component: LocationsPage,
});

function LocationsPage() {
	const [showForm, setShowForm] = useState(false);
	const [editingLocation, setEditingLocation] = useState<Location | undefined>();
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleEdit = (location: Location) => {
		setEditingLocation(location);
		setShowForm(true);
	};

	const handleFormSuccess = () => {
		setShowForm(false);
		setEditingLocation(undefined);
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingLocation(undefined);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Управление аудиториями</h2>
				{!showForm && (
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
					>
						<Plus className="w-4 h-4" />
						Добавить
					</button>
				)}
			</div>

			{showForm ? (
				<LocationForm location={editingLocation} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
			) : (
				<LocationsList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
			)}
		</div>
	);
}
