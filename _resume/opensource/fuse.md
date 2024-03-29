---
title: Fuse
---

#### The Fuse Programming Language.

It is a __staticly typed__, __garbage collected__ language with a similar syntax to __Lua__, __Rust__, __TypeScript__ and __Haskell__.

Fuse code can transpile and target runtimes such as Lua 5.1 to 5.4, LuaJit, and Luau. The language itself is written in __Rust__ and its focus is on extendability and performance. It comes with a compiler, parser, linter, formatter, testing suit, LSP, and package manager.

Here's a quick peek:

```fuse
struct Point
  x: number,
  y: number,
end

let point = Point { x: 10, y: 20 }
print("point x: ${point.x}, point y: ${point.y}")
```

<a class="button" href="https://fuse-lang.github.io/" target="_blank" rel="noopener noreferrer">View Fuse</a>
