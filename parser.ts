import { CookiesManager } from './cookies-manager'

export class Parser { 
  browser: any
  videosClass: string
  config: any

  constructor() {
    this.config = require('config')
    this.videosClass = this.config.get('safari.videosClass')
  }
  
  public async collectLinksForCourse(courseUrl: string): Promise<string[]> {
    const puppeteer = require('puppeteer')
    this.browser = await puppeteer.launch()
    const body = this.getBody(courseUrl)
    const videosLinks = this.collectLinks(await body)
    await this.browser.close()    
    return videosLinks
  }

  private async getBody(courseUrl): Promise<string> {
    const page = await this.browser.newPage()    
    await page.setCookie(...CookiesManager.getCookies())    
    await page.goto(courseUrl)    
    return await page.evaluate(() => {
      return document.querySelector('body').innerHTML
    })
  }

  private async collectLinks(body: string): Promise<string[]> {
    const JSSoup = require('jssoup').default
    const bodyTags = new JSSoup(body)
    this.verifyIsSignedIn(bodyTags)
    const videos = bodyTags.findAll('a', this.videosClass)
    const videosLocalLinks = videos.map(v => v.attrs.href)
    return videosLocalLinks.map(v => this.localLinkToRealLink(v))
  }

  private verifyIsSignedIn(tags: any) {
    const signInLink = tags.find('a', this.config.get('safari.signInLinkClass'))
    if (signInLink) {
      // Sign in failed, that's why we found the button
      console.error("Sign in failed, please check your cookies")
      process.exit(1);
    }
  }

  private localLinkToRealLink(localLink: string): string {
    const baseUrl = this.config.get('safari.baseUrl')
    return `${baseUrl}${localLink}`
  }
}
