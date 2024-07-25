"use client"
import { useState, useEffect } from "react";
import Spinner from "@/components/component/Spinner";
import GeneralTable from "@/components/component/general/GeneralTable";
import { getAllCashMovements } from "@/service/cashMovementsService";
import { createSector, deleteSector, getAllSectors, getAllUserSectors, updateSector } from "@/service/sectorService";
import { createProvider, deleteProvider, getProviders, updateProvider } from "@/service/providerService";
import TerminalTable from "@/components/component/general/TerminalTable";
import { createTerminal, deleteTerminal, getAllTerminalAssociations, getAllterminals, updateTerminal } from "@/service/terminalService";

export default function Page() {
	const [sectors, setSectors] = useState([]);
	const [providers, setProviders] = useState([]);
	const [cashMovements, setCashMovements] = useState([]);
	const [userSectors, setUserSectors] = useState([]);
	const [terminals, setTerminals] = useState([]);
	const [terminalsAssociations, setTerminalsAssociations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)

				const sectors = await getAllSectors();
				const userSector = await getAllUserSectors();
				const providers = await getProviders()
				const terminals = await getAllterminals();
				const cashMovementsData = await getAllCashMovements();
				const terminalsAssociations = await getAllTerminalAssociations();
				setSectors(sectors.filter(sector => sector.name !== "general" && sector.isActive) || []);
				setUserSectors(userSector);
				setProviders(providers.filter(provider => !provider.name.toLowerCase().startsWith("retiro") && provider.isActive) || []);
				setTerminals(terminals.filter(terminal => terminal.terminalNumber !== "cash" && terminal.isActive) || []);
				setCashMovements(cashMovementsData);
				setTerminalsAssociations(terminalsAssociations);

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

	const handleAddProvider = async (newProvider) => {
		const provider = await createProvider(newProvider);
		setProviders([...providers, provider].sort((a, b) => a.name.localeCompare(b.name)));
		return provider;
	};

	const handleAddTerminal = async (newTerminal) => {
		const terminal = await createTerminal(newTerminal);
		setTerminals([...terminals, terminal].sort((a, b) => a.description.localeCompare(b.description)));
		return terminal;
	};

	const handleEditSector = async (sectorId, newSector) => {
		const sector = await updateSector(sectorId, newSector);
		const sectorsUpdated = sectors.filter(sector => sector.id !== sectorId);
		setSectors([...sectorsUpdated, sector].sort((a, b) => a.name.localeCompare(b.name)));
		return sector;
	}

	const handleEditProvider = async (providerId, newProvider) => {
		const provider = await updateProvider(providerId, newProvider);
		const providersUpdated = providers.filter(provider => provider.id !== providerId);
		setProviders([...providersUpdated, provider].sort((a, b) => a.name.localeCompare(b.name)));
		return provider
	}

	const handleEditTerminal = async (terminalId, newTerminal) => {
		const terminal = await updateTerminal(terminalId, newTerminal);
		const terminalsUpdated = terminals.filter(terminal => terminal.id !== terminalId);
		setTerminals([...terminalsUpdated, terminal].sort((a, b) => a.description.localeCompare(b.description)));
		return terminal;
	}

	const handleRemoveSector = async (sectorId) => {
		await deleteSector(sectorId);
		setSectors(sectors.filter(sector => sector.id !== sectorId));
	};

	const handleRemoveprovider = async (providerId) => {
		await deleteProvider(providerId);
		setProviders(providers.filter(provider => provider.id !== providerId));
	};

	const handleRemoveTerminal = async (terminalId) => {
		await deleteTerminal(terminalId);
		setTerminals(terminals.filter(terminal => terminal.id !== terminalId));
	};

	const getUsedProviders = () => {
		const usedProviders = cashMovements.map(movement => movement.Provider.id);
		return [...new Set(usedProviders)];
	}

	const getUsedSectors = () => {
		const usedSectors = userSectors.map(userSector => userSector.sectorId);
		return [...new Set(usedSectors)];
	}

	const getUsedTerminals = () => {
		const usedTerminals = terminalsAssociations.map(association => association.terminalId);
		return [...new Set(usedTerminals)];
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
									{/* <p className="mb-2"><span className="font-semibold">Sectores</span></p> */}
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
									{/* <p className="mb-2"><span className="font-semibold">Proveedores</span></p> */}
									<GeneralTable
										data={providers}
										onAdd={handleAddProvider}
										onEdit={handleEditProvider}
										onRemove={handleRemoveprovider}
										placeholder="Nuevo Proveedor..."
										tableName="proveedor"
										usedData={getUsedProviders()}
									/>
								</div>
							</div>
							<div className="flex gap-4">
								<div className="w-1/2">
									<p className="mb-2"><span className="font-semibold">Cajas</span></p>
									<TerminalTable
										data={terminals}
										onAdd={handleAddTerminal}
										onEdit={handleEditTerminal}
										onRemove={handleRemoveTerminal}
										placeholder="Nueva terminal..."
										tableName="terminal"
										usedData={getUsedTerminals()}
									/>
								</div>
								<div className="w-1/2">
									{/* <p className="mb-2"><span className="font-semibold">Terminales</span></p> */}
									<TerminalTable
										data={terminals}
										onAdd={handleAddTerminal}
										onEdit={handleEditTerminal}
										onRemove={handleRemoveTerminal}
										placeholder="Nueva terminal..."
										tableName="terminal"
										usedData={getUsedTerminals()}
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