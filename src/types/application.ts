import { ApplicationStatusNetwork } from './api';
import { ApplicationStatus } from './enums';

export interface ApplicationStatusData {
  /** The application's network status */
  network: ApplicationStatusNetwork;
  /** How much storage the application is currently using */
  storageUsage: string;
  /** How much cpu the application is currently using */
  cpuUsage: string;
  /** How much memory the application is currently using */
  ramUsage: string;
  /**
   * The status of the application
   *
   * - 'exited' (stopped)
   * - 'created' (being created)
   * - 'running'
   * - 'starting'
   * - 'restarting'
   * - 'deleting'
   */
  status: ApplicationStatus;
  /** Whether the application is running or not */
  running: boolean;
  /** How many requests have been made since the last start up */
  requests: number;
  /** For how long the app is running in millisseconds */
  uptimeTimestamp: number;
  /** For how long the app is running */
  uptime?: Date;
  /** The last time this information has been checked in millisseconds */
  lastCheckTimestamp?: number;
  /** The last time this information has been checked */
  lastCheck?: Date;
}