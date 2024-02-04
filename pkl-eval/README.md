# pkl-eval

A very simple library that wraps the `pcl eval` command to interpret a fixed string as a Pkl module.
A stopgap until we have Typescript bindings.

Supported flags:
- format
- allowed-modules
- allowed-resources
- timeout
- expression

## Example

The simple example from the https://pkl-lang.org/ homepage:

```ts
import {evaluate} from "@pkl-community/pkl-eval"

const bird = JSON.parse(await evaluate(`
  name = "Swallow"
  
  job {
    title = "Sr. Nest Maker"
    company = "Nests R Us"
    yearsOfExperience = 2
  }
`, {format: "json"}));

console.log(bird);
```

Outputs:

```js
{
  name: "Swallow",
  job: {
    title: "Sr. Nest Maker",
    company: "Nests R Us",
    yearsOfExperience: 2
  }
}
```

A more complex example (careful with nested escaping!):

```ts
import {evaluate} from "@pkl-community/pkl-eval"

const output = JSON.parse(await evaluate(`
  class Bird {
    name: String
    function greet(bird: Bird): String = "Hello, \\(bird.name)!" 
  }
  
  function greetPigeon(bird: Bird): String = bird.greet(pigeon) 
  
  pigeon: Bird = new {
    name = "Pigeon"
  }
  parrot: Bird = new {
    name = "Parrot"
  }
  
  greeting1 = pigeon.greet(parrot) 
  greeting2 = greetPigeon(parrot)
`, {format: "json"}));

console.log(output);
```

Outputs:

```js
{
  pigeon: { name: "Pigeon" },
  parrot: { name: "Parrot" },
  greeting1: "Hello, Parrot!",
  greeting2: "Hello, Pigeon!"
}
```
