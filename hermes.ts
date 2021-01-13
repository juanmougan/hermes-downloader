import { Downloader } from './downloader';
import { Parser } from './parser'

(async () => {
  const parser = new Parser()
  const downloader = new Downloader()
  // TODO use this to parse cmd args: https://www.npmjs.com/package/yargs
  const links = await parser.collectLinksForCourse(process.argv[2])
  if(links.length > 0) {
    console.info(`Will download ${links.length} videos`)
    await downloader.downloadVideos(links)
  } else {
    console.error("Couldn't retrieve any videos")
    process.exit(1);
  }
})()
