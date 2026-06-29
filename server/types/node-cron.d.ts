declare module 'node-cron' {
  interface ScheduleOptions {
    scheduled?: boolean;
    timezone?: string;
  }

  interface ScheduledTask {
    start(): void;
    stop(): void;
  }

  export function schedule(expression: string, task: () => void | Promise<void>, options?: ScheduleOptions): ScheduledTask;
}
