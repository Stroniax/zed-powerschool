# PowerSchool Extension for Zed

## Feature List

### MVP

- [ ] Syntax highlighting for PowerSchool HTML files
    - [ ] DAT tag highlighting
        - `~[if]`
        - `~(gpv.*)`
        - `~([TABLE]COL)`
    - [ ] Input mapping
        - `<input type="text" name="[STUDENTS]LASTFIRST" />`

### TODO

- [ ] Blocks
    - [ ] `~[if]` and `~[case]` blocks
    - [ ] `TLIST_SQL`
        - [ ] SQL syntax highlighting
        - [ ] template vs column count validation
        - [ ] inline SQL execution
        - [ ] `gpv` recommending `;sqltext` suffix
        - [ ] Invalid symbol detection (`:`, `;`, `]`)
          - [ ] When in a string, suggest replacement with equivalent `' || chr(00) || '`
- [ ] DAT codes
    - [ ] `TLIST_CHILD`
