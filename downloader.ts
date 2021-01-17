export class Downloader {
  public async downloadVideos(videos: string[]): Promise<void> {
      const outputDirName = Downloader.createOutputDirectory()
      const config = require('config')
      if (videos.length > config.get('hermes.videosThreshold')) {
        // Dry run
        const commandOutput = config.get('hermes.commandOutput')
        console.log(`Too many videos! Please download them manually, get the commands from ${commandOutput}`)
        const fs = require('fs');
        const fileConsole = new console.Console(fs.createWriteStream(`./${commandOutput}`));
        videos.forEach(v => this.prepareCommand(v, outputDirName).then(v => fileConsole.log(v)))
      } else {
        videos.forEach(v => this.downloadVideo(v, outputDirName))
      }
  }

  private static createOutputDirectory() {
    const fs = require('fs')
    const outputDirName = `output/${Date.now()}`
    if (!fs.existsSync(outputDirName)){
      fs.mkdirSync(outputDirName, { recursive: true });
    }
    return outputDirName
  }

  private async prepareCommand(video: string, dir: string) {
    const safariEmail = process.env.SAFARI_EMAIL
      const password = process.env.SAFARI_PASSWORD
      const urlParts = video.split('/')
      const videoName = `${urlParts[urlParts.length - 1]}.mp4`
      const output = `${dir}/${videoName}`
      return `youtube-dl -u ${safariEmail} -p ${password} --verbose --output ${output} ${video}`
  }
  
  private async downloadVideo(video, dir): Promise<void> {
      const command = this.prepareCommand(video, dir)
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
