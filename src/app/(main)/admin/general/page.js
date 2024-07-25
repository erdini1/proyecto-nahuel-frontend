"use client"
import { useState, useEffect } from "react";
import Spinner from "@/components/component/Spinner";
import GeneralTable from "@/components/component/general/GeneralTable";
import { getAllCashMovements } from "@/service/cashMovementsService";
import { createSector, deleteSector, getAllSectors, getAllUserSectors, updateSector } from "@/service/sectorService";
import CashBoxTable from "@/components/component/general/CashBoxTable";
import { createCashBox, deleteCashBox, getCashBoxes, updateCashBox } from "@/service/cashBoxService";

export default function Page() {
	const [sectors, setSectors] = useState([]);
	const [providers, setProviders] = useState([]);
	const [cashMovements, setCashMovements] = useState([]);
	const [userSectors, setUserSectors] = useState([]);
	const [cashBoxes, setCashBoxes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)

				const sectors = await getAllSectors();
				const userSector = await getAllUserSectors();
				const cashMovementsData = await getAllCashMovements();
				const cashBox = await getCashBoxes();
				setSectors(sectors.filter(sector => sector.name !== "general" && sector.isActive) || []);
				setUserSectors(userSector);
				setCashMovements(cashMovementsData);
				setCashBoxes(cashBox.filter(cashBox => cashBox.isActive) || []);

			} catch (error) {
				console.log('Failed to fetch all tasks:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleAddSector = async (newSector) => {
		const sector = await createSector(newSector);
		setSectors([...sectors, sector].sort((a, b) => a.name.localeCompare(b.name)));
		return sector;
	};

	const handleAddCashBox = async (newCashBox) => {
		const cashBox = await createCashBox(newCashBox);
		setCashBoxes([...cashBoxes, cashBox].sort((a, b) => a.description.localeCompare(b.description)));
		return cashBox;
	}

	const handleEditSector = async (sectorId, newSector) => {
		const sector = await updateSector(sectorId, newSector);
		const sectorsUpdated = sectors.filter(sector => sector.id !== sectorId);
		setSectors([...sectorsUpdated, sector].sort((a, b) => a.name.localeCompare(b.name)));
		return sector;
	}

	const handleEditCashBox = async (cashBoxId, newCashBox) => {
		const cashBox = await updateCashBox(cashBoxId, newCashBox);
		const cashBoxesUpdated = cashBoxes.filter(cashBox => cashBox.id !== cashBoxId);
		setCashBoxes([...cashBoxesUpdated, cashBox].sort((a, b) => a.description.localeCompare(b.description)));
		return cashBox;
	}

	const handleRemoveSector = async (sectorId) => {
		await deleteSector(sectorId);
		setSectors(sectors.filter(sector => sector.id !== sectorId));
	};

	const handleRemoveCashBox = async (cashBoxId) => {
		await deleteCashBox(cashBoxId);
		setCashBoxes(cashBoxes.filter(cashBox => cashBox.id !== cashBoxId));
	}

	const getUsedProviders = () => {
		const usedProviders = cashMovements.map(movement => movement.Provider.id);
		return [...new Set(usedProviders)];
	}

	const getUsedSectors = () => {
		const usedSectors = userSectors.map(userSector => userSector.sectorId);
		return [...new Set(usedSectors)];
	}


	return (
		<div className="">
			<div className="flex flex-col">
				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
					<div className="flex-1">
						<h1 className="font-semibold text-lg">General</h1>
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<div className="flex gap-4 mb-4">
								<div className="w-1/2">
									{/* Sectores */}
									<GeneralTable
										data={sectors}
										onAdd={handleAddSector}
										onEdit={handleEditSector}
										onRemove={handleRemoveSector}
										placeholder="Nuevo Sector..."
										tableName="sector"
										usedData={getUsedSectors()}
									/>
								</div>
								<div className="w-1/2">
									{/* Cajas */}
									<CashBoxTable
										data={cashBoxes}
										onAdd={handleAddCashBox}
										onEdit={handleEditCashBox}
										onRemove={handleRemoveCashBox}
										usedData={getUsedProviders()}
									/>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}