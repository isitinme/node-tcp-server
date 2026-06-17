const DEFAULT_PORT = 8124;

export const getPort = (fallback) => {
    const parsed = parseInt(process.argv[2]);
    return !isNaN(parsed) && parsed.toString().length === 4
        ? parsed
        : DEFAULT_PORT;
};