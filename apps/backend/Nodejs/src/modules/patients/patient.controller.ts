import { Request, Response, NextFunction } from "express";

import { prisma } from "../../configs/database/prisma.js";
import { getOrCreateTenant } from "../../utils/tenant.js";
import { generatePatientCode } from "../../utils/codes.js";

export async function getPatients(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);

    const patients = await prisma.patient.findMany({
      where: {
        tenantId: tenant.id,
      },
      orderBy: {
        patientCode: "asc",
      },
    });

    res.json(
      patients.map((patient) => ({
        id: patient.id,
        patient_id: patient.patientCode,
        patient_name: patient.patientName,
        patient_image: patient.patientImage,
        treatment_notes: patient.treatmentNotes,
      })),
    );
  } catch (err) {
    next(err);
  }
}

export async function addPatient(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);

    if (!req.body.patient_name) {
      return res.status(400).json({
        error: "patient_name is required",
      });
    }

    const patientCode =
      req.body.patient_id || (await generatePatientCode(tenant.id));

    const patient = await prisma.patient.create({
      data: {
        tenantId: tenant.id,
        patientCode,
        patientName: req.body.patient_name,
        patientImage: req.body.patient_image || null,
        treatmentNotes: req.body.treatment_notes || null,
      },
    });

    res.status(201).json({
      id: patient.id,
      patient_id: patient.patientCode,
      patient_name: patient.patientName,
      patient_image: patient.patientImage,
      treatment_notes: patient.treatmentNotes,
    });
  } catch (err) {
    next(err);
  }
}
