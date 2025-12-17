export const READ_RATE_LIMIT = {
    request: 100,
    window: 60000, // 60 seconds
} as const;

export const WRITE_RATE_LIMIT = {
    request: 20,
    window: 60000, // 60 seconds
} as const;
