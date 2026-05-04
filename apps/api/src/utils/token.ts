import crypto from "crypto";
export const generateHashedToken  = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashToken };
};
