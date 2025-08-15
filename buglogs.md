# Bug Logs

This file records errors encountered during development, their causes, resolutions, and prevention steps.

## 2025-08-08

### Issue: PowerShell pipe to `cat` caused error when checking Git config
- Context: Attempted `git config --get user.name | cat` in PowerShell
- Error: `The input object cannot be bound to any parameters for the command...`
- Cause: In PowerShell, `cat` is an alias for `Get-Content` and does not accept pipeline input like this usage.
- Resolution: Run `git config --get user.name` directly without piping.
- Prevention: Avoid Unix-style piping to `cat` in PowerShell for simple scalar outputs.

### Issue: `git init -b main` showed unexpected behavior in terminal
- Context: Ran `git init -b main` and saw minimal output, with stray `^C` echoes in the terminal.
- Cause: Terminal quirk or accidental interrupt input echoed. Repository state verified by running `git status` afterwards.
- Resolution: Proceeded to verify repo initialization via `git status` and continue with normal workflow.
- Prevention: If output is suspicious, always verify with `git status` or `git rev-parse --is-inside-work-tree` before retrying.