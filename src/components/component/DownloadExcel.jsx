import React from 'react';
import { Button } from "../ui/button";
import { DownloadIcon } from "../icons";
import ExcelJS from 'exceljs';

const DownloadExcel = ({ cashRegisters, cashMovements, cancellations, fileName }) => {
	const downloadExcel = async () => {
		const workbook = new ExcelJS.Workbook();

		const createSheet = (title, columns, data, key) => {
			const sheet = workbook.addWorksheet(title, {
				views: [{ state: 'frozen', xSplit: 0, ySplit: key === "cashRegister" ? 2 : 1 }],
			});
			sheet.columns = columns;
			data.forEach((row) => {
				if (row !== null) {
					sheet.addRow(row)
				}
			});

			sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
			sheet.getRow(1).height = 30;
			sheet.getRow(1).font = { bold: true };
			sheet.getRow(1).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFD9D9D9' }
			};

			if (key === "cashRegister") {
				sheet.spliceRows(1, 0, ["", "", "", "", "", "", "EFECTIVO", "EFECTIVO", "EFECTIVO", "EFECTIVO", "EFECTIVO", "EFECTIVO", "TARJETAS", "TARJETAS", "TARJETAS", "TARJETAS", "TARJETAS", "MERCADO PAGO", "MERCADO PAGO", "MERCADO PAGO", "MERCADO PAGO", "MERCADO PAGO", "POINT MAXICONSUMO", "POINT MAXICONSUMO", "POINT MAXICONSUMO", "POINT MAXICONSUMO", "POINT MAXICONSUMO", "POINT MAXICONSUMO", "CUENTA CORRIENTE", "CUENTA CORRIENTE", "CUENTA CORRIENTE", "CUENTA CORRIENTE", "", ""]);

				sheet.mergeCells("G1:L1");
				sheet.mergeCells("M1:Q1");
				sheet.mergeCells("R1:V1");
				sheet.mergeCells("W1:AB1");
				sheet.mergeCells("AC1:AF1");

				const paymentMethodRange = ["G1", "M1", "S1", "Y1", "AE1"];
				paymentMethodRange.forEach(cell => {
					sheet.getCell(cell).fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '474b4e' }
					};
				});

				sheet.getRow(1).height = 30;
				sheet.getRow(1).font = {
					bold: true, color: {
						argb: "FFFFFFFF"
					}
				};

				sheet.getColumn("G").border = { left: { style: 'medium' } };
				sheet.getColumn("M").border = { left: { style: 'medium' } };
				sheet.getColumn("R").border = { left: { style: 'medium' } };
				sheet.getColumn("W").border = { left: { style: 'medium' } };
				sheet.getColumn("AC").border = { left: { style: 'medium' } };
				sheet.getColumn("AG").border = { left: { style: 'medium' } };
			} else {
				sheet.getColumn("E").border = { left: { style: 'medium' } };
			}

			sheet.columns.forEach(column => {
				column.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
				column.eachCell({ includeEmpty: true }, cell => {
					if ((key === "cashRegister" || column.key === "amount") && cell.type === ExcelJS.ValueType.Number) {
						cell.numFmt = '$#,##0.00';
					}
				});
			});
		};

		const cashRegisterColumns = [
			{ header: 'CAJERO', key: 'cashier', width: 20 },
			{ header: 'FECHA', key: 'date', width: 15 },
			{ header: 'NUMERO DE CAJA', key: 'cashBoxNumber', width: 15 },
			{ header: 'MONTO INICIAL', key: 'initialAmount', width: 20 },
			{ header: 'INGRESO DE CAMBIO', key: 'changeAmount', width: 20 },
			{ header: 'INGRESO DE PAGO A PROVEEDOR', key: 'supplierIncome', width: 20 },
			{ header: 'VENTAS', key: 'cashSales', width: 20 },
			{ header: 'INGRESO', key: 'cashIncome', width: 20 },
			{ header: 'RETIROS', key: 'cashWithdrawal', width: 20 },
			{ header: 'A RENDIR', key: 'cashToRenderSystem', width: 20 },
			{ header: 'FISICO, EN MANO', key: 'cashInHand', width: 20 },
			{ header: 'DIFERENCIA', key: 'cashDiff', width: 20 },
			{ header: 'VENTAS', key: 'cardSales', width: 20 },
			{ header: 'RETIROS', key: 'cardWithdrawal', width: 20 },
			{ header: 'A RENDIR', key: 'cardToRenderSystem', width: 20 },
			{ header: 'FISICO, EN MANO', key: 'cardInHand', width: 20 },
			{ header: 'DIFERENCIA', key: 'cardDiff', width: 20 },
			{ header: 'VENTAS', key: 'mercadoPagoSales', width: 20 },
			{ header: 'RETIROS', key: 'mercadoPagoWithdrawal', width: 20 },
			{ header: 'A RENDIR', key: 'mercadoPagoToRenderSystem', width: 20 },
			{ header: 'FISICO, EN MANO', key: 'mercadoPagoInHand', width: 20 },
			{ header: 'DIFERENCIA', key: 'mercadoPagoDiff', width: 20 },
			{ header: 'VENTAS', key: 'pointMaxiconsumoSales', width: 20 },
			{ header: 'RETIROS', key: 'pointMaxiconsumoWithdrawal', width: 20 },
			{ header: 'A RENDIR', key: 'pointMaxiconsumoToRenderSystem', width: 20 },
			{ header: 'FISICO, EN MANO', key: 'pointMaxiconsumoInHand', width: 20 },
			{ header: 'DIFERENCIA', key: 'pointMaxiconsumoDiff', width: 20 },
			{ header: 'NRO DE LOTE', key: 'batchNumber', width: 20 },
			{ header: 'VENTAS', key: 'creditSales', width: 20 },
			{ header: 'A RENDIR', key: 'creditToRenderSystem', width: 20 },
			{ header: 'FISICO, EN MANO', key: 'creditInHand', width: 20 },
			{ header: 'DIFERENCIA', key: 'creditDiff', width: 20 },
			{ header: 'TOTAL DE METODOS DE PAGO', key: 'totalPaymentMethods', width: 20 },
			{ header: 'TOTAL DIFERENCIAS', key: 'totalDiff', width: 20 },
		];

		const cashMovementColumns = [
			{ header: 'ID', key: 'id', width: 10 },
			{ header: 'CAJERO', key: 'cashier', width: 20 },
			{ header: 'Nº DE CAJA', key: 'cashBoxNumber', width: 15 },
			{ header: 'FECHA', key: 'date', width: 12 },
			{ header: 'DETALLE', key: 'detail', width: 30 },
			{ header: 'MONTO', key: 'amount', width: 15, numFmt: '$#,##0.00' },
			{ header: 'HORA', key: 'time', width: 10 },
		];

		const cancellationColumns = [
			{ header: 'ID', key: 'id', width: 10 },
			{ header: 'CAJERO', key: 'cashier', width: 20 },
			{ header: 'Nº DE CAJA', key: 'cashBoxNumber', width: 15 },
			{ header: 'FECHA', key: 'date', width: 12 },
			{ header: 'TIPO', key: 'type', width: 15 },
			{ header: 'MÉTODO', key: 'method', width: 15 },
			{ header: 'MONTO', key: 'amount', width: 15, numFmt: '$#,##0.00' },
			{ header: 'HORA', key: 'time', width: 10 },
		];

		createSheet('Registro de Caja', cashRegisterColumns, cashRegisters, "cashRegister");
		createSheet('Movimientos de Caja', cashMovementColumns, cashMovements, "cashMovement");
		createSheet('Cancelaciones', cancellationColumns, cancellations, "cancellation");

		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], { type: 'application/octet-stream' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${fileName}.xlsx`;
		link.click();
	};

	return (
		<Button onClick={downloadExcel}>
			<DownloadIcon />
			Exportar
		</Button>
	);
};

export default DownloadExcel;