export function formatDateToGMT8_YYYYMMDDTHHMM(date: Date): string {
    // Date.prototype.getTime() gives UTC milliseconds. Add 8 hours for GMT+8.
    const gmt8Timestamp = date.getTime() + (8 * 60 * 60 * 1000);
    const gmt8Date = new Date(gmt8Timestamp);

    // Format using UTC methods to prevent further local timezone adjustments by a an local .toISOString() or similar
    const year = gmt8Date.getUTCFullYear();
    const month = String(gmt8Date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(gmt8Date.getUTCDate()).padStart(2, '0');
    const hours = String(gmt8Date.getUTCHours()).padStart(2, '0');
    const minutes = String(gmt8Date.getUTCMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
} 