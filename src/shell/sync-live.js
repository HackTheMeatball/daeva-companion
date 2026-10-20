/* Whether the site mounts the sync line at all (0.7 P8). False until the sync server is deployed (0.7 P5, #348): the
   item that deploys it flips this to true, nothing else. While false the sync chunk (src/sync-ui.js: the line's markup,
   styles, texts and client; 0.8 P6) is never loaded and nothing is requested. Tests set window.__dcSyncTest before the
   page script runs (an injected flag, never a URL parameter). Its own module so the page bundle (src/site.js) holds only
   this flag, not the HTTP adapter. */
export const SYNC_LIVE = false;
