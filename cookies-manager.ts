export class CookiesManager {
  public static getCookies() {
    const fs = require('fs')
    const cookies = fs.readFileSync('cookies.json', 'utf8')
    return JSON.parse(cookies)
  }
}
