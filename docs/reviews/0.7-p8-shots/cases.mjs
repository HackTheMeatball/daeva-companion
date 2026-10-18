/* 0.7 P8 (#382): the sync line is hidden until the sync server is live (SYNC_LIVE false). Before = main with the P6 sync
   line in the save strip, after = the pre-P6 strip. The footer's save strip at 390. Format: tests/support/shots.mjs. */
export default [
  { name: 'f1-footer-390', height: 1100, shots: [{ sel: '#xfer' }] },
];
