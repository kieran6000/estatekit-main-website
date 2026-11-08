const KEY = "ek_lead";

/** Saved on booking so a later /rebook on the same device fills itself in. */
export function rememberLead(lead) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lead));
  } catch {
    // private mode or storage blocked: they just type it again
  }
}

/** @returns {{name?: string, email?: string, phone?: string} | null} */
export function recallLead() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
