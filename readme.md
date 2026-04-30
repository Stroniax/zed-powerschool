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
  - [ ] Wildcard highlighting, validation, and path quick navigation
    - [ ] `~[wc:some_file]` hyperlinks to `/wilcards/some_file.txt`
      - [ ] (root eg `/wildcards` can be configured)
    - [ ] Validation that associated file exists
      - [ ] Configurable list of predefined wildcards for workspaces that reference a wildcard not contained in the workspace
    - [ ] Hover to show contents of associated file

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
