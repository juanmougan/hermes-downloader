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

2. Set up your username and password as environment variables, like this:

```
$ export SAFARI_EMAIL=juan@mail.com
$ export SAFARI_PASSWORD=MyAwesomePass123
```

3. Create a `cookies.json` file, containing all the needed files. To do so, you can use a [tool](http://www.editthiscookie.com/) to download them

4. Run Hermes, supplying the course URL, like this:

```
$ npm start https://videos.com/123
```

5. You'll see a subdirectory of `output` (named according to the current timestamp) with the course contents

## Roadmap

1. Support downloading several files, currently crashes when you try to download >400 videos (maybe I need some [job queue](https://docs.bullmq.io/))

2. See if any of `youtube-dl`'s options can be tuned, and exposed somehow in Hermes (like network or quality tweaks)

3. Get rid of the user/pass, use cookies only. But `youtube-dl` uses Netscape-style txt cookies, and `Puppeteer` uses a `JSON`

4. Add error checks (env vars, cmd params, `youtube-dl` not installed, etc.)

5. Testing
