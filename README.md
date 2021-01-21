# Hermes

Hermes is a video downloader, powered by [youtube-dl](https://github.com/ytdl-org/youtube-dl) to locally backup stuff from educational websites.

### Motivation

Hermes lets you cache locally videos from certain websites that have mobile apps with a questionable offline mode, to watch them afterwards, e.g. during a flight. Please make sure the site's terms and conditions allows you to do this! I've created this as a personal, and educational project (and I've learnt a lot along the way 🙌).

#### The name

Pays homage to the eponymous [Greek god](https://en.wikipedia.org/wiki/Hermes).

#### Useful resources

I've mostly followed [this](https://andrejsabrickis.medium.com/scrapping-the-content-of-single-page-application-spa-with-headless-chrome-and-puppeteer-d040025f752b) great tutorial, plus some Puppeteer and youtube-dl documentation.

## Usage

1. Make sure `youtube-dl` is installed, and in your path:

```
$ which youtube-dl
/usr/local/bin/youtube-dl
```

2. Create a `cookies.txt`, containing all the needed cookies (in [Netscape format](http://www.cookiecentral.com/faq/#3.3)). You might want to extract them using any tool, like [this one](https://chrome.google.com/webstore/detail/get-cookiestxt/bgaddhkoddajcdgocldbbfleckgcbcid)

3. Create a `cookies.json` file, containing all the needed files. To do so, you can use a [tool](http://www.editthiscookie.com/) to download them

4. Run Hermes, supplying the course URL, like this:

```
$ npm start https://videos.com/123
```

5. You'll see a subdirectory of `output` (named according to the current timestamp) with the course contents

### Batch mode

When downloading a [configurable](config/default.json#L8) batch of files, Hermes will run on batch mode, and will use [BullMQ](https://docs.bullmq.io/) to handle the asynchronous download of all the videos that were previously enqueued.

#### Redis

BullMQ needs Redis to work, so make sure to install it locally. On a Mac, it would be as simple as:

```
$ brew install redis
$ redis-server /usr/local/etc/redis.conf
```

## Roadmap

1. Add Docker, so that locally installing Redis is not needed anymore

2. See if any of `youtube-dl`'s options can be tuned, and exposed somehow in Hermes (like network or quality tweaks)

3. Get rid of the user/pass, use cookies only. But `youtube-dl` uses Netscape-style txt cookies, and `Puppeteer` uses a `JSON`

4. Add error checks (env vars, cmd params, `youtube-dl` not installed, etc.)

5. Better separation in components, receive dependencies in the constructor, and add unit tests
