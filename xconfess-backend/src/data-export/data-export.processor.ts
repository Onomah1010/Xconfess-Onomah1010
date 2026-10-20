import { Processor, OnWorker } from '@bullmq/nestjs';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { DataExportService } from './data-export.service';
import { EXPORT_QUEUE_NAME } from './data-export.constants';

export interface ExportJobData {
  requestId: string;
  userId: string;
}

@Processor(EXPORT_QUEUE_NAME)
export class ExportProcessor extends OnWorker<ExportJobData> {
  private readonly logger = new Logger(ExportProcessor.name);

  constructor(private readonly exportService: DataExportService) {
    super();
  }

  async process(job: Job<ExportJobData>): Promise<void> {
    const { requestId, userId } = job.data;
    this.logger.log(`Processing export request ${requestId} for user ${userId}`);

    try {
      await this.exportService.processExportRequest(requestId, userId);
      this.logger.log(`Export request ${requestId} completed`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Export request ${requestId} failed: ${message}`,
        error instanceof Error ? error.stack : undefined,
      );
      await this.exportService.markExportFailed(requestId, message);
      throw error;
    }
  }
}
