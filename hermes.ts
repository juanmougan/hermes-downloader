import { Downloader } from './downloader';
import { Parser } from './parser'

(async () => {
  const parser = new Parser()
  const downloader = new Downloader()
  // TODO use this to parse cmd args: https://www.npmjs.com/package/yargs
  const links = await parser.collectLinksForCourse(process.argv[2])
  await downloader.downloadVideos(links)
})()
