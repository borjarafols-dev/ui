# @brafols/ui: agent instructions

This repo is the shared UI base for every brafols frontend. Apps install it by git tag and give it their own look by overriding tokens. Whatever you change here ships to every app, so keep components generic.

Rules for apps that *consume* the library live in `docs/USAGE.md`, which ships in the package. This file covers working *on* the library.

## Stack

- React 19, TypeScript (strict), **React Aria Components** for behaviour and accessibility.
- **tailwind-variants** `tv()` recipes for styles, on Tailwind CSS v4 compiled at build time. The `tailwindcss-react-aria-components` plugin provides state variants (`hover:`, `pressed:`, `selected:`, `focus-visible:`, `invalid:`, `disabled:`).
- Vitest + Testing Library, Storybook 10.

## Layout

```
src/recipes/<id>.ts                  tv() recipes, no React; also exported as @brafols/ui/recipes
src/components/<id>.tsx              React Aria component using the recipe
src/components/<id>.stories.tsx      stories (required)
src/components/<id>.test.tsx         tests (required)
src/components/<id>.metadata.ts      model-owned metadata (required; never hand-edit)
src/metadata/schema.ts               metadata shape
src/styles.css                       token layers + @theme inline bridge
src/index.ts                         public API
.ai/metadata.prompt.md               the metadata generator's prompt
docs/USAGE.md                        consumer rules, shipped as dist/ai/USAGE.md
scripts/                             metadata, manifest, token check, release
```

## Contracts (CI enforces them)

| # | Contract | Enforced by |
|---|---|---|
| C1 | State is exposed via `data-*` attributes (`data-slot`, `data-variant`, `data-size` + React Aria's), never internal classes | review, tests |
| C2 | Styles resolve to tokens: no palette classes (`bg-blue-600`, `text-white`) and no hex colors | `npm run lint:tokens` |
| C3 | Every component has a recipe or token classes, stories, a test and metadata | `npm run metadata:check` |
| C4 | Metadata matches the source: `keyProps` and `alternatives` are type-checked | `npm run typecheck` |
| C5 | Metadata is fresh: its `sourceHash` matches the current inputs | `npm run metadata:check` |

## Adding or changing a component

1. **Recipe.** Add `src/recipes/<id>.ts` (`tv()` with slots for multi-part components) and export it from `src/recipes/index.ts`. Use token utilities only. If an app needs to restyle one component without touching semantic tokens, add a component token in `src/styles.css` (layer 3) and map it under `@theme inline`.
2. **Component.** Wrap the React Aria primitive in `src/components/<id>.tsx`.
   - Keep React Aria's API (`onPress`, `isDisabled`, value-based `onChange`).
   - Accept `className?: string` and pass it through the recipe, so it merges last.
   - Set `data-slot` (and `data-variant`/`data-size` when there are variants).
   - Write a JSDoc summary. Add `@usage` lines for decisions an agent must follow ("Not for navigation: …"). They are binding on the metadata.
3. **Export** it from `src/index.ts`.
4. **Stories** covering every variant and state, plus a realistic composition.
5. **Test** behaviour through roles and accessible names. Test variants through `data-*` attributes and token classes.
6. **Metadata.** Write `src/components/<id>.metadata.ts` per `.ai/metadata.prompt.md` (inputs: `npm run metadata:inputs -- <id>`), then `npm run metadata:stamp -- <id>`. On PRs, agentic adds this commit for you.
7. Run `npm run typecheck && npm test && npm run lint:tokens && npm run metadata:check && npm run build`.

## Metadata

- `*.metadata.ts` files are **model-owned**. Don't hand-edit them; change the component's `@usage` lines or the prompt instead.
- A component's hash covers its source, the recipes it imports, its stories, `.ai/metadata.prompt.md` and `src/metadata/schema.ts`. Editing the prompt or schema makes every component stale on purpose.
- `npm run metadata:stale -- --json` lists what needs regenerating and the input files for each one.
- A PR labelled `skip-metadata` may merge with stale metadata. The next PR that touches the component regenerates it.

## Releases

- Use conventional commits; they decide the version.
  - `feat:` → minor.
  - `fix:` / `perf:` → patch.
  - `!` or a `BREAKING CHANGE:` footer → major. Use it for any prop, variant, token or export rename or removal, because apps pin exact tags.
  - `chore:`, `docs:`, `test:`, `ci:` and `refactor:` don't release.
- Never commit `dist/`. The release script builds it into the tag commit.

## Don'ts

- Don't add a dependency for something React Aria already does.
- Don't add app-specific components, copy or branding. If only one app needs it, it belongs in that app.
- Don't rename or remove tokens, props, variants or exports without a breaking-change commit.
- Don't render overlays outside React Aria's portal handling, and don't assume a theme scoped to a subtree reaches them.
