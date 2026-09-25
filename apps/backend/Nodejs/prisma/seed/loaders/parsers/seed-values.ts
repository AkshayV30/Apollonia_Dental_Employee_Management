// ============================================================================
// SEED VALUE PARSERS
// ============================================================================

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// ============================================================================
// STRING
// ============================================================================

export function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid ${field}: expected a non-empty string`);
  }

  return value.trim();
}

export function optionalString(value: unknown, field: string): string | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid ${field}: expected a string or null`);
  }

  return value.trim() || null;
}

// ============================================================================
// DATE
// ============================================================================

export function parseDate(value?: string | null): Date | null {
  if (value == null || value.trim() === "") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date_of_joining: "${value}"`);
  }

  return date;
}

// ============================================================================
// EXPERIENCE
// ============================================================================

export function parseExperience(value: unknown): number | string | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "number" && typeof value !== "string") {
    throw new Error(
      "Invalid years_of_experience: expected a number, string, or null",
    );
  }

  return value;
}

// ============================================================================
// NORMALIZED EXPERIENCE
// ============================================================================
//
// Used immediately before writing to PostgreSQL.
//
// Converts:
//   undefined/null/"" -> 0
//   "5"              -> 5
//   5                -> 5
//
// Rejects:
//   - negative numbers
//   - decimals
//   - NaN
//   - non-numeric strings
// ============================================================================

export function normalizeExperience(value?: number | string | null): number {
  if (value == null || value === "") {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `Invalid years_of_experience: "${value}". ` +
        `Expected a non-negative integer.`,
    );
  }

  return parsed;
}
