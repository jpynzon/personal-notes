---
title: C#
description: Learning C# and .NET from a Laravel/PHP background — the fundamentals, mapped to what you already know.
tags: [csharp, dotnet, basics]
keywords: [c#, .net, dotnet, console app, laravel to c#]
createdAt: 2026-07-19
updatedAt: 2026-07-19
---

Notes for picking up C# with a Laravel/PHP mental model already in place. The
language is different, but the shapes are familiar — classes, services, models,
namespaces. Most of the work is learning what each Laravel idea is *called* over
here.

::tip
Coming from Laravel, the fastest way in is translation, not memorisation. When
you hit something new, ask "what's the Laravel equivalent?" — a service is still
a service, `composer` is `dotnet`/NuGet, Collections are LINQ, Eloquent is EF
Core.
::

## Start here

- [C# basics](/dev/csharp/csharp-basics) — types, variables, and how to write a function (method).
- [Classes & models](/dev/csharp/classes-and-models) — create a class, give it properties, and use it.
- [Services & helpers](/dev/csharp/services-and-helpers) — put code in another file and call it from anywhere.
- [Project structure](/dev/csharp/project-structure) — how files, namespaces and the `dotnet` CLI fit together.

## The mental model

C# is **compiled** and **statically typed** — the opposite of PHP on both counts.
You declare types up front, the compiler checks them before the program runs, and
you build/run with the `dotnet` CLI instead of pointing a web server at a folder.
That feels heavier at first, then pays off: the editor knows exactly what
everything is, so autocomplete and refactoring are excellent.
