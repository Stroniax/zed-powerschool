## Build

```pwsh
PS: \> npm install

PS: \> copy-item ./node_modules/tree-sitter-html/src/scanner.c ./src/scanner.c
PS: \> copy-item ./node_modules/tree-sitter-html/src/tag.h ./src/tag.h

PS: \> # Replace `tree_sitter_html` with `tree_sitter_pshtml` in `scanner.c`

PS: \> npm run build
PS: \> npm run test
```
