export const logger = {
    info: (message: string) => console.log(`INFO: ${message}`),
    error: (message: string) => console.error(`ERROR: ${message}`),
    debug: (message: string) => console.debug(`DEBUG: ${message}`),
};