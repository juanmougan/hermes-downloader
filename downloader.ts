import { DownloadQueue } from './download_queue';

export class Downloader {
  public async downloadVideos(videos: string[]): Promise<void> {
    const outputDirName = Downloader.createOutputDirectory();
    const config = require('config');
    if (videos.length > config.get('hermes.videosThreshold')) {
      console.info(`Downloading ${videos.length} videos in batch`);
      const downloadQueue = new DownloadQueue('download-queue');
      downloadQueue.addJobs(videos);
      downloadQueue.processJobs(
        async (url) => await this.performDownload(url, outputDirName)
      );
      downloadQueue.shutdown();
    } else {
      videos.forEach((v) => this.downloadVideo(v, outputDirName));
    }
  }

  // TODO remove duplication, there are 2 methods doing the same
  // TODO move the command preparation somewhere else
  private async performDownload(
    url: string,
    outputDirName: string
  ): Promise<string> {
    const urlParts = url.split('/');
    const videoName = `${urlParts[urlParts.length - 1]}.mp4`;
    const output = `${outputDirName}/${videoName}`;
    const command = 'youtube-dl';
    const args = [
      '--cookies',
      'cookies.txt',
      '--output',
      output,
      url,
    ];

    return this.execProcess(command, args);
  }

  private async execProcess(
    command: string,
    args: Array<string>
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const { exec } = require('child_process');
      exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  private static createOutputDirectory() {
    const fs = require('fs');
    const outputDirName = `output/${Date.now()}`;
    if (!fs.existsSync(outputDirName)) {
      fs.mkdirSync(outputDirName, { recursive: true });
    }
    return outputDirName;
  }

  // TODO remove duplication, there are 2 methods doing the same
  // TODO move the command preparation somewhere else
  private async downloadVideo(video, dir) {
    const urlParts = video.split('/');
    const videoName = `${urlParts[urlParts.length - 1]}.mp4`;
    const output = `${dir}/${videoName}`;
    const command = `youtube-dl --cookies cookies.txt --output ${output} ${video}`;
    console.log('Download: ', command);
    const { exec } = require('child_process');
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
    });
  }
}
