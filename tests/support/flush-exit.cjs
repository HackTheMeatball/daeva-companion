/* Preloaded into every suite by tests/run.mjs (node --require), with or without --with-fonts.
   On Linux a child's stdout and stderr are pipes, and Node writes to a pipe asynchronously: when the pipe is full (the
   parent is slow to read, or the kernel gave the pipe a small buffer under load), writes queue in the process, and
   process.exit() drops what is queued. A suite then exits 0 without its PASSED line, which reads as a failure with "no FAIL
   line" (equiv and a11y in CI run 39735746083, 2026-10-22; Kaizen item 29). Blocking writes make every line reach the parent
   before exit. */
for (const s of [process.stdout, process.stderr]) if (s._handle && s._handle.setBlocking) s._handle.setBlocking(true);
