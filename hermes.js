const puppeteer = require('puppeteer')
const fs = require('fs')
const JSSoup = require('jssoup').default
const config = require('config')
const { exec } = require("child_process");

localLinkToRealLink = (localLink) => {
//   return localLink.replace("file://", baseUrl)
  const baseUrl = config.get('safari.baseUrl')
  return `${baseUrl}${localLink}`
}

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

async function gatherVideosLinks() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // TODO use this to parse cmd args: https://www.npmjs.com/package/yargs
  const url = process.argv[2]
  const videosClass = config.get('safari.videosClass')

  const cookies = fs.readFileSync('cookies.json', 'utf8')

  const deserializedCookies = JSON.parse(cookies)
  await page.setCookie(...deserializedCookies)

  // TODO read this from cmd
  await page.goto(url)

  const body = await page.evaluate(() => {
    return document.querySelector('body').innerHTML
  })
  const bodyTags = new JSSoup(body)
  const videos = bodyTags.findAll('a', videosClass)
  const videosLocalLinks = videos.map(v => v.attrs.href)
  const videosLinks = videosLocalLinks.map(v => localLinkToRealLink(v))
  
  await browser.close()

  return videosLinks
}

(async () => {
  links = await gatherVideosLinks()
  await downloadVideos(links)
})()
