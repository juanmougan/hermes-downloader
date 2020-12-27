export class Downloader {
  public async downloadVideos(videos: string[]): Promise<void> {
      const outputDirName = Downloader.createOutputDirectory()
      videos.forEach(v => this.downloadVideo(v, outputDirName))
  }

  private static createOutputDirectory() {
    const fs = require('fs')
    const outputDirName = `output/${Date.now()}`
    if (!fs.existsSync(outputDirName)){
      fs.mkdirSync(outputDirName, { recursive: true });
    }
    return outputDirName
  }
  
  private async downloadVideo(video, dir): Promise<void> {
      const safariEmail = process.env.SAFARI_EMAIL
      const password = process.env.SAFARI_PASSWORD
      const urlParts = video.split('/')
      const videoName = `${urlParts[urlParts.length - 1]}.mp4`
      const output = `${dir}/${videoName}`
      console.log(`Downloading ${video} to ${output}`)
      const command = `youtube-dl -u ${safariEmail} -p ${password} --verbose --output ${dir}/${videoName} ${video}`
      const { exec } = require("child_process");
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
  }
}
