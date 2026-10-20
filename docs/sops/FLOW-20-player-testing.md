# FLOW-20: Player testing

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Play the app the way a player does before and after each release, and turn what is confusing or broken into one planning input per play.

## Trigger

`RC READY <minor> <sha>` from Walter ([FLOW-10](FLOW-10-minor-release.md)), a release going live, or a patch (delta check).

## Owner

**Jesse** (accountable for this flow end to end; each step names who does it).

## Inputs

- The live site or main built locally at the named sha
- The play script, including a late-start player and a fact walk (KZ-17)

## Steps

1. **Jesse**: Plays on phone and desktop widths: a full play per minor, a delta check per patch (PLN-21).
2. **Jesse**: Includes the owner's case: a late starter, a fact walk on the play path (KZ-17).
3. **Jesse**: Files one planning-input issue for the play (PLN-22); data doubts go to Gretchen.
4. **Jesse**: Answers `RC PLAY DONE <minor>` (candidate) or `PLAY DONE` (live) with the issue link, to Walter, Saul and Huell.

## Gates

- `RC PLAY DONE` is half of the release GO ([FLOW-10](FLOW-10-minor-release.md)).

## Records

- The player findings issue

## Failure and escalation

- A blocker found in the RC: named in RC PLAY DONE; the fix merges and the RC restarts.
- Never uses Isaac's device or a real player's save, and reads no site but our own.

## Rules it runs on

- [PLN-21](../team/jesse.md): cadence
- [PLN-13](https://github.com/HackTheMeatball/daeva-companion/issues/222): full play at 3+ visible items (trial)
- [PLN-22](../team/jesse.md): one issue per play
- [KZ-17](https://github.com/HackTheMeatball/daeva-companion/issues/222): the owner's case
- [DEC-20261019-player-testing-plays-each-minor](../DECISIONS.md): Player Testing

## Last confirmed by owner

Not yet.
