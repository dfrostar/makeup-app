import { ARLogger, LogEntry } from '../types/ar';

class ARLoggerImpl implements ARLogger {
    private logs: LogEntry[] = [];
    private static instance: ARLoggerImpl;

    private constructor() {}

    static getInstance(): ARLoggerImpl {
        if (!ARLoggerImpl.instance) {
            ARLoggerImpl.instance = new ARLoggerImpl();
        }
        return ARLoggerImpl.instance;
    }

    private log(level: LogEntry['level'], component: string, message: string, data?: unknown) {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            component,
            message,
            data
        };
        this.logs.push(entry);
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            const logMethod = console[level] || console.log;
            logMethod(`[${component}] ${message}`, data);
        }
    }

    debug(component: string, message: string, data?: unknown): void {
        this.log('debug', component, message, data);
    }

    info(component: string, message: string, data?: unknown): void {
        this.log('info', component, message, data);
    }

    warn(component: string, message: string, data?: unknown): void {
        this.log('warn', component, message, data);
    }

    error(component: string, message: string, data?: unknown): void {
        this.log('error', component, message, data);
    }

    getLogs(level?: LogEntry['level']): LogEntry[] {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return this.logs;
    }

    clearLogs(): void {
        this.logs = [];
    }
}

export const arLogger = ARLoggerImpl.getInstance();
