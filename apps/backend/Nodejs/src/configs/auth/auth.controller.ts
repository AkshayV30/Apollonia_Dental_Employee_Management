import { Request, Response, NextFunction } from "express";

import { prisma } from "../database/prisma.js";
import { getOrCreateTenant } from "../../utils/tenant.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAccessToken } from "../../utils/token.js";
import { AuthUser, UserRole } from "../../types/auth.js";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toSafeUser(user: {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: user.id,
    tenant_id: user.tenantId,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

function validatePassword(password: string) {
  return typeof password === "string" && password.length >= 8;
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const tenant = await getOrCreateTenant(req);

    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(String(req.body.email || ""));
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email and password are required",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email,
        },
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists for this tenant",
      });
    }

    const tenantUserCount = await prisma.user.count({
      where: {
        tenantId: tenant.id,
      },
    });

    const role: UserRole = tenantUserCount === 0 ? "ADMIN" : "STAFF";

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name,
        email,
        passwordHash,
        role,
      },
    });

    const authUser: AuthUser = {
      id: user.id,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = signAccessToken(authUser);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: toSafeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const tenant = await getOrCreateTenant(req);

    const email = normalizeEmail(String(req.body.email || ""));
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email,
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        error: "User account is disabled",
      });
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const authUser: AuthUser = {
      id: user.id,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = signAccessToken(authUser);

    return res.json({
      message: "Login successful",
      token,
      user: toSafeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const authUser = (req as any).user as AuthUser | undefined;

    if (!authUser) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      user: toSafeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function dashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user as AuthUser | undefined;

    if (!authUser) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const [employees, departments, patients, assignments] = await Promise.all([
      prisma.employee.count({
        where: {
          tenantId: authUser.tenantId,
        },
      }),
      prisma.department.count({
        where: {
          tenantId: authUser.tenantId,
        },
      }),
      prisma.patient.count({
        where: {
          tenantId: authUser.tenantId,
        },
      }),
      prisma.employeeDepartment.count({
        where: {
          employee: {
            tenantId: authUser.tenantId,
          },
        },
      }),
    ]);

    return res.json({
      message: "Dashboard access granted",
      user: authUser,
      metrics: {
        employees,
        departments,
        patients,
        assignments,
      },
    });
  } catch (err) {
    next(err);
  }
}
