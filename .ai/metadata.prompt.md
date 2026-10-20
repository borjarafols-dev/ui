# Generate component metadata

You write `src/components/<id>.metadata.ts` for one component of `@borjarafols-dev/ui`, a React Aria + tailwind-variants design system that several apps share. Agents building app UI read this metadata to choose components. Write for them: concrete, short and correct.

## Inputs

`npm run metadata:inputs -- <id>` prints:

1. The schema (`src/metadata/schema.ts`). Follow it exactly.
2. The component source, including any `@usage` lines in its JSDoc.
3. The recipe(s) it uses.
4. Its stories.
5. The list of all library components, for `alternatives`.
6. The current metadata file, if one exists.

## Rules

- **`@usage` lines are binding.** If the source says `@usage Not for navigation`, the metadata must say so. Never contradict one.
- **Describe only what the source shows.** Don't invent props, variants or behaviour. `keyProps` must be real prop names; the file is type-checked against the props type.
- **Frame everything as a UI need.** "Confirming a destructive action", not "When you need a ConfirmDialog".
- **`whenNotToUse` names the alternative.** "Navigation: use a link styled with the `button()` recipe".
- **`alternatives` only lists library components**, from the provided list.
- **`antiPatterns` are mistakes an agent would plausibly make with this component.** For example, using `onClick` instead of `onPress`, overriding colors with `className`, or a missing accessible name. Give the fix in the same item.
- **`accessibility` separates what the component handles from what the caller must still provide.**
- **`example` is a short, realistic TSX snippet** using only this library's exports and the props shown in the source. Use a template literal.
- Keep each list to 2–5 items and each item to one sentence.
- If a current metadata file exists, keep wording that is still accurate. Change only what the inputs changed. This keeps diffs small and reviewable.

## Output

Write the complete file and nothing else:

```ts
import type { ComponentMetadata } from '../metadata/schema'
import type { <PropsType> } from './<id>'

export default {
  component: '<Name>',
  sourceHash: 'pending',
  // … every other field of ComponentMetadata
} satisfies ComponentMetadata<<PropsType>>
```

Leave `sourceHash: 'pending'`. Then run `npm run metadata:stamp -- <id>`, which writes the real hash, and `npm run typecheck`, which must pass.
