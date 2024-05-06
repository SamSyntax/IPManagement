"use server";

import { prisma } from "@/lib/db";
import { formDate } from "@/lib/utils";
import * as xlsx from "xlsx";

export async function GET(res: Response) {
	const date = formDate(new Date());

	try {
		const ips = await prisma.iPAddress.findMany({
			select: {
				address: true,
				isTaken: true,
				region: true,
				type: true,
				simsId: true,
			},
		});
		const users = await prisma.user.findMany({
			select: {
				address: true,
				simsId: true,
				ipAddress: {
					select: {
						region: true,
						type: true,
					},
				},
			},
		});

		const userWorksheetData = users.map((user) => ({
			address: user.address,
			simsId: user.simsId,
			region: user.ipAddress?.region,
			type: user.ipAddress?.type,
		}));

		const ipWorksheet = xlsx.utils.json_to_sheet(ips);
		const userWorksheet = xlsx.utils.json_to_sheet(userWorksheetData);
		const workbook = xlsx.utils.book_new();

		xlsx.utils.book_append_sheet(workbook, ipWorksheet, "IP_Addresses");
		xlsx.utils.book_append_sheet(workbook, userWorksheet, "Users");

		const buf = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

		res.ok;

		return new Response(buf, {
			status: 200,
			headers: {
				"Content-Disposition": `attachment; filename=ip_address_${date}.xlsx`,
				"Content-Type": "application/vnd.ms-excel",
			},
		});
	} catch (error: any) {
		return new Response(error, {
			status: 500,
		});
	}
}
