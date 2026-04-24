import { describe, it, expect } from "vitest";
import {
  isOwnerAdminEmail,
  extractTokenFromCookieValue,
  sanitizeBaseUrl,
  getEnvString,
  normalizeDelimitedTextValue,
  splitDelimitedText,
  getInsertedId,
  normalizeCaminhoRecord,
  OWNER_ADMIN_EMAIL,
} from "./helpers";

describe("isOwnerAdminEmail", () => {
  it("matches the hardcoded owner email exactly", () => {
    expect(isOwnerAdminEmail(OWNER_ADMIN_EMAIL)).toBe(true);
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(isOwnerAdminEmail(`  ${OWNER_ADMIN_EMAIL.toUpperCase()}  `)).toBe(true);
  });

  it("rejects a different email", () => {
    expect(isOwnerAdminEmail("someone@else.com")).toBe(false);
  });

  it("rejects null and undefined", () => {
    expect(isOwnerAdminEmail(null)).toBe(false);
    expect(isOwnerAdminEmail(undefined)).toBe(false);
  });

  it("respects ADMIN_EMAIL env override", () => {
    const env = { ADMIN_EMAIL: "override@test.com" };
    expect(isOwnerAdminEmail("override@test.com", env)).toBe(true);
    expect(isOwnerAdminEmail(OWNER_ADMIN_EMAIL, env)).toBe(false);
  });
});

describe("extractTokenFromCookieValue", () => {
  const fakeJwt = "header.payload.signature";

  it("returns a raw JWT passed directly", () => {
    expect(extractTokenFromCookieValue(fakeJwt)).toBe(fakeJwt);
  });

  it("extracts token from JSON array cookie (Supabase format)", () => {
    const cookie = JSON.stringify([fakeJwt, "refresh-token"]);
    expect(extractTokenFromCookieValue(cookie)).toBe(fakeJwt);
  });

  it("extracts access_token from JSON object cookie", () => {
    const cookie = JSON.stringify({ access_token: fakeJwt });
    expect(extractTokenFromCookieValue(cookie)).toBe(fakeJwt);
  });

  it("decodes base64- prefixed cookie and extracts token", () => {
    const encoded = `base64-${btoa(JSON.stringify([fakeJwt]))}`;
    expect(extractTokenFromCookieValue(encoded)).toBe(fakeJwt);
  });

  it("returns null for empty string", () => {
    expect(extractTokenFromCookieValue("")).toBeNull();
    expect(extractTokenFromCookieValue("   ")).toBeNull();
  });

  it("returns null for malformed value", () => {
    expect(extractTokenFromCookieValue("not-a-token")).toBeNull();
    expect(extractTokenFromCookieValue("{malformed")).toBeNull();
  });
});

describe("sanitizeBaseUrl", () => {
  it("strips path, query, and hash from a valid URL", () => {
    expect(sanitizeBaseUrl("https://example.com/path?q=1#hash")).toBe(
      "https://example.com"
    );
  });

  it("keeps the port when present", () => {
    expect(sanitizeBaseUrl("http://localhost:5173")).toBe("http://localhost:5173");
  });

  it("returns null for invalid URLs", () => {
    expect(sanitizeBaseUrl("not a url")).toBeNull();
  });

  it("returns null for null or empty", () => {
    expect(sanitizeBaseUrl(null)).toBeNull();
    expect(sanitizeBaseUrl("")).toBeNull();
  });
});

describe("getEnvString", () => {
  it("returns a trimmed string value when present", () => {
    expect(getEnvString({ FOO: "  bar  " }, "FOO")).toBe("bar");
  });

  it("returns null for missing keys", () => {
    expect(getEnvString({}, "MISSING")).toBeNull();
  });

  it("returns null for undefined env", () => {
    expect(getEnvString(undefined, "FOO")).toBeNull();
  });

  it("returns null for empty or whitespace-only values", () => {
    expect(getEnvString({ FOO: "" }, "FOO")).toBeNull();
    expect(getEnvString({ FOO: "   " }, "FOO")).toBeNull();
  });

  it("returns null for non-string values (numbers, booleans, null)", () => {
    expect(getEnvString({ FOO: 42 }, "FOO")).toBeNull();
    expect(getEnvString({ FOO: true }, "FOO")).toBeNull();
    expect(getEnvString({ FOO: null }, "FOO")).toBeNull();
  });
});

describe("normalizeDelimitedTextValue", () => {
  it("trims a string and returns it", () => {
    expect(normalizeDelimitedTextValue("  hello  ")).toBe("hello");
  });

  it("joins an array with commas, trimming each item", () => {
    expect(normalizeDelimitedTextValue(["a", " b ", "c"])).toBe("a, b, c");
  });

  it("filters empty items from arrays", () => {
    expect(normalizeDelimitedTextValue(["a", "", "  ", "b"])).toBe("a, b");
  });

  it("returns null for empty string, null, undefined, or non-string", () => {
    expect(normalizeDelimitedTextValue("")).toBeNull();
    expect(normalizeDelimitedTextValue("  ")).toBeNull();
    expect(normalizeDelimitedTextValue(null)).toBeNull();
    expect(normalizeDelimitedTextValue(undefined)).toBeNull();
    expect(normalizeDelimitedTextValue(42)).toBeNull();
  });
});

describe("splitDelimitedText", () => {
  it("splits comma-separated string into lowercased items", () => {
    expect(splitDelimitedText("Foo, BAR, baz")).toEqual(["foo", "bar", "baz"]);
  });

  it("accepts an array and splits the joined string", () => {
    expect(splitDelimitedText(["Foo", "Bar"])).toEqual(["foo", "bar"]);
  });

  it("returns empty array for null/empty", () => {
    expect(splitDelimitedText(null)).toEqual([]);
    expect(splitDelimitedText("")).toEqual([]);
    expect(splitDelimitedText(undefined)).toEqual([]);
  });
});

describe("getInsertedId", () => {
  it("extracts last_row_id from a D1 insert result", () => {
    expect(getInsertedId({ meta: { last_row_id: 42 } })).toBe(42);
  });

  it("returns null when meta is missing", () => {
    expect(getInsertedId({})).toBeNull();
    expect(getInsertedId({ meta: null })).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(getInsertedId(null)).toBeNull();
    expect(getInsertedId(undefined)).toBeNull();
    expect(getInsertedId("not an object")).toBeNull();
  });
});

describe("normalizeCaminhoRecord", () => {
  it("returns null for null input", () => {
    expect(normalizeCaminhoRecord(null)).toBeNull();
  });

  it("normalizes pain_pattern into both pain_pattern and pain_patterns", () => {
    const record = { id: 1, pain_pattern: "  dull ache  " };
    const result = normalizeCaminhoRecord(record);
    expect(result).toEqual({
      id: 1,
      pain_pattern: "dull ache",
      pain_patterns: "dull ache",
    });
  });

  it("accepts pain_patterns as an array and joins", () => {
    const record = { id: 1, pain_patterns: ["sharp", "burning"] };
    const result = normalizeCaminhoRecord(record);
    expect(result?.pain_pattern).toBe("sharp, burning");
    expect(result?.pain_patterns).toBe("sharp, burning");
  });

  it("prefers pain_pattern over pain_patterns when both are present", () => {
    const record = { pain_pattern: "first", pain_patterns: "second" };
    const result = normalizeCaminhoRecord(record);
    expect(result?.pain_pattern).toBe("first");
  });

  it("sets both to null when neither value is meaningful", () => {
    const record = { id: 1, pain_pattern: "  ", pain_patterns: null };
    const result = normalizeCaminhoRecord(record);
    expect(result?.pain_pattern).toBeNull();
    expect(result?.pain_patterns).toBeNull();
  });
});
