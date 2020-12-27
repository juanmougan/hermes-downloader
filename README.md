# Hermes

Hermes is a video downloader, powered by [youtube-dl](https://github.com/ytdl-org/youtube-dl) to locally backup stuff from educational websites.

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
$ node hermes.js https://videos.com/123
```

5. You'll see a subdirectory of `output` (named according to the current timestamp) with the course contents

## Roadmap

1. Support downloading several files, currently crashes when you try to download >400 videos (maybe I need some job queue)

2. Refactoring

3. Testing
