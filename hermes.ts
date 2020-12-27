import { Parser } from './parser'

const fs = require('fs')
const { exec } = require("child_process");

async function downloadVideos(videos) {
  // Create a directory to store the videos
  const outputDirName = `output/${Date.now()}`
  // TODO make async
  if (!fs.existsSync(outputDirName)){
    fs.mkdirSync(outputDirName, { recursive: true });
  }
  videos.forEach(v => downloadVideo(v, outputDirName))
}

async function downloadVideo(video, dir) {
  const safariEmail = process.env.SAFARI_EMAIL
  const password = process.env.SAFARI_PASSWORD
  const urlParts = video.split('/')
  const videoName = `${urlParts[urlParts.length - 1]}.mp4`
  const output = `${dir}/${videoName}`
  console.log(`Downloading ${video} to ${output}`)
  const command = `youtube-dl -u ${safariEmail} -p ${password} --verbose --output ${dir}/${videoName} ${video}`
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

(async () => {
  const parser = new Parser()
  // TODO use this to parse cmd args: https://www.npmjs.com/package/yargs
  const links = await parser.collectLinksForCourse(process.argv[2])
  await downloadVideos(links)
})()
