# pkl-eval

A very simple library that wraps the `pkl eval` command to interpret a fixed string as a Pkl module.
A stopgap until we have Typescript bindings.

Supported flags:
- format
- allowed-modules
- allowed-resources
- timeout
- expression

## Example
```ts
import {evaluate} from "@pkl-community/pkl-eval"

evaluate(`
foo = 1
`, {format: "json"}).then(console.log)
```
