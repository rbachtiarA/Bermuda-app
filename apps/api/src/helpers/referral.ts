export function generateReferralCode(name: string): string {
    const namePart = name.replace(/\s+/g, "").substring(0, 3).toUpperCase();
    const randomPart = Math.floor(100 + Math.random() * 900).toString();
    return `${namePart}${randomPart}`;
  }
  