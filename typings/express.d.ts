import { Buffer } from 'node:buffer';

declare module 'http' {
    interface IncomingMessage {
        rawBody: Buffer
    }
}

declare global {
    namespace Express {
        interface Request {
            rawBody: Buffer;
        }
    
        interface User {
            id: string | number
        }
    }
}