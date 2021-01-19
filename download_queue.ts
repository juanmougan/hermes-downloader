import { Worker, QueueScheduler, Queue, Job, QueueEvents } from 'bullmq';

export class DownloadQueue {
  downloadQueue: Queue<any, any, string>
  scheduler: QueueScheduler
  config: any
  workers: number
  lastJob: boolean
  
  constructor(queueName: string) {
    const queueOptions = { defaultJobOptions: {
      removeOnComplete: true
    }}
    this.downloadQueue = new Queue(queueName, queueOptions);
    // The docs say:
    // Jobs that get rate limited will actually end as delayed jobs, so you need at least one QueueScheduler 
    // somewhere in your deployment so that jobs are put back to the wait status.
    this.scheduler = new QueueScheduler(this.downloadQueue.name);
    this.config = require('config')
  }

  public async addJobs(urls: Array<string>) {
    this.workers = urls.length
    const queueConfig = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    }
    urls.forEach(url => this.downloadQueue.add(url, { url }, queueConfig))
  }

  public async processJobs(jobImpl: (url: string) => Promise<string>) {    
    for (let i = 0; i < this.config.get('hermes.maxDownloadsPerTimeThreshold'); i++) {
      const worker = new Worker(this.downloadQueue.name, async job => jobImpl(job.data.url), {
        lockDuration: this.config.get('hermes.lockDuration')
      });
      // Check for errors
      worker.on("failed", (job: Job, failedReason: string) => {
        console.log(`${job.id} has failed with ${failedReason}`, job.data);
      });
      // Log success
      worker.on("completed", async (job: Job, returnValue: string) => {
        console.log(`Completed job (${job.id})`)
        // If there are no more jobs, exit OK
        // TODO this is quite hacky, improve
        const jobsToBeProcessed = await this.downloadQueue.count()
        if (jobsToBeProcessed === 0) {
          if (this.lastJob) {
            // I've finished processing, exit
            return
          } else {
            // Mark that the next sucessful job should be the last one
            this.lastJob = true
          }
        }
      });
    }
  }

  public async shutdown() {
    await this.scheduler.close();
  }
}
