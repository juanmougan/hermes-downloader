import { Worker, QueueScheduler, Queue, Job, QueueEvents } from 'bullmq';

export class DownloadQueue {
  downloadQueue: Queue<any, any, string>
  scheduler: QueueScheduler
  config: any;
  workers: number;
  
  constructor(queueName: string) {
    this.downloadQueue = new Queue(queueName);
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

  private async logJobCount() {
    console.log("Completed: ", await this.downloadQueue.getCompletedCount())
    console.log("Delayed: ", await this.downloadQueue.getDelayedCount())
    console.log("Failed: ", await this.downloadQueue.getFailedCount())
  }

  public async processJobs(jobImpl: (url: string) => Promise<string>) {    
    const workers = []
    for (let i = 0; i < this.workers; i++) {
      //const worker = new Worker('my-queue', null, { lockDuration: 60000 });
      const worker = new Worker(this.downloadQueue.name, async job => jobImpl(job.data.url), {
        limiter: {
          max: this.config.get('hermes.maxDownloadsPerTimeThreshold'),
          duration: this.config.get('hermes.timeThreshold')
        },
        lockDuration: this.config.get('hermes.lockDuration')
      });
      // Check for errors
      worker.on("failed", (job: Job, failedReason: string) => {
        console.log(`${job.id} has failed with ${failedReason}`, job.data);
        this.logJobCount()
      });
      // Log success
      worker.on("completed", (job: Job, returnValue: string) => {
        console.log(`Completed job (${job.id})`)
        this.logJobCount()
      });
      workers.push(worker)
    }
    // Listen to events
    const queueEvents = new QueueEvents(this.downloadQueue.name);
    queueEvents.on('completed', jobId => {
      // console.log('Job completed with id: ', jobId);
      console.log('Job completed');
    });
    queueEvents.on('failed', (jobId, err) => {
      console.error('Error running the job with id: ', jobId, err);
    });
  }

  public async shutdown() {
    await this.scheduler.close();
  }
}
