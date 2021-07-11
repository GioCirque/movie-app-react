# Movie App 🎬

For this to work, qBittorrent has to have `Add customer HTTP headers` enabled, and the headers **MUST** include `Access-Control-Allow-Origin: *`

## Configuration for Plex

```sh
# The local network name of your plex server
REACT_APP_PLEX_ADDRESS=legion

# The local network port of your plex server
REACT_APP_PLEX_PORT=32400

# A valid plex token for authenticating
# To obtain, see: https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/
REACT_APP_PLEX_TOKEN=[usually-twenty-chars]

# These two shouldn't be changed unless you know what you're doing
REACT_APP_PLEX_SECTION=Movies
REACT_APP_PLEX_SECTION_TYPE=movie
```

## Configuration for qtBitTorrent

```sh
# The local network name of your qtBitTorrent server
REACT_APP_BTC_ADDRESS=legion

# The local network port of your qtBitTorrent server
REACT_APP_BTC_PORT=7070

# The category mapped to a save path for downloading movies
REACT_APP_BTC_CATEGORY=movies
```
