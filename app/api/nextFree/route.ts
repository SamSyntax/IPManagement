import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

// Walidacja danych wejściowych za pomocą Zod
const simsIdSchema = z.string().length(8);
const regionSchema = z.enum(["EMEA", "APAC", "AMERICAS", "AUSTRALIA"]);
const typeSchema = z.enum(["P4", "P6"]);

const userInputSchema = z.object({
  simsId: simsIdSchema,
  region: regionSchema,
  type: typeSchema,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sprawdź, czy dane wejściowe są poprawne
    const validation = userInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: `Input data is invalid`,
        },
        { status: 400 }
      );
    } 

    const user = await prisma.user.findFirst({
      where: {
        simsId: body.simsId,
      },
    });

    const freeIp = await prisma.iPAddress.findFirst({
      where: {
        isTaken: false,
        region: body.region,
        type: body.type,
      },
    });

    if (user && freeIp) {
      // Zwalniamy poprzedni adres IP przypisany do identyfikatora SIM
      if (user.ipAddressId) {
        await prisma.iPAddress.update({
          where: {
            id: user.ipAddressId,
          },
          data: {
            isTaken: false,
            simsId: null,
          },
        });
      }

      // Zaktualizujemy dane użytkownika, przypisując mu nowy adres IP
      await prisma.user.update({
        where: { simsId: body.simsId },
        data: {
          ipAddressId: freeIp.id,
          address: freeIp.address,
        },
        include: {
          ipAddress: true,
        },
      });

      // Przypisujemy nowy adres IP do identyfikatora SIM
      await prisma.iPAddress.update({
        where: {
          id: freeIp.id,
        },
        data: {
          isTaken: true,
          simsId: body.simsId,
        },
      });

      return NextResponse.json(
        {
          message: `A new IP Address: ${freeIp.address} region: ${freeIp.region} type: ${freeIp.type} has been assigned to ${user.simsId}.`,
        },
        { status: 200 }
      );
    } else {
      // Obsługa błędu w przypadku braku użytkownika lub wolnego adresu IP
      return NextResponse.json(
        { message: "No available IP Addresses" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Request validation error:", error);
    return NextResponse.json(
      { message: "Request validation error", error },
      { status: 500 }
    );
  }
}
