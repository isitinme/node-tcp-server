import { AddressInfo } from 'node:net';

const DEFAULT_PORT = 8124;

export const getPort = (fallback?: number): number => {
    const arg = process.argv[2] ?? '';
    const parsed = parseInt(arg, 10);
    if (!Number.isNaN(parsed) && parsed.toString().length === 4) {
        return parsed;
    }
    if (typeof fallback === 'number') return fallback;
    return DEFAULT_PORT;
};

export type SocketLocalAddress = {
    address: string;
    port: number;
    family: string;
};

export const getSocketLocalAddressInfo = (addr: string | AddressInfo | null | undefined): SocketLocalAddress => {
    let address = '';
    let port = 0;
    let family = '';

    if (typeof addr === 'string') {
        address = addr;
    } else if (addr && typeof addr === 'object' && 'address' in addr) {
        const a = addr as AddressInfo;
        address = a.address;
        port = a.port;
        family = String(a.family);
    }

    return { address, port, family };
};