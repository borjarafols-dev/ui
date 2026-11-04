import type { ComponentMetadata } from '../metadata/schema'
import type { DrawerProps } from './drawer'

export default {
  component: 'Drawer',
  sourceHash: 'sha256:85ce1cc025faa39582dd63b581ea24e7311345ec744b48e42cd79aadd770dbd7',
  category: 'overlay',
  summary: 'A modal panel that slides in from the inline end to edit or inspect one record while the page stays in view.',
  whenToUse: [
    'Editing one record from a list without leaving the page.',
    'Inspecting the details or raw payload of a table row.',
    'A form long enough to scroll, with Save and Cancel kept visible in the footer.',
  ],
  whenNotToUse: [
    'A short blocking decision: use Modal, or ConfirmDialog for a yes/no before a destructive action.',
    'A navigation menu or a persistent sidebar: those belong in the app layout.',
    'A second panel opened from an open drawer: show one drawer at a time.',
  ],
  alternatives: [
    { component: 'Modal', when: 'The task is short and centred focus suits it better than a side panel.' },
    { component: 'ConfirmDialog', when: 'The step is only a yes/no confirmation.' },
    { component: 'Card', when: 'The content can live on the page without blocking it.' },
  ],
  keyProps: ['isOpen', 'onOpenChange', 'title', 'aria-label', 'footer', 'size', 'isDismissable', 'children'],
  antiPatterns: [
    'No title and no aria-label; the dialog then has no accessible name, so pass one of them.',
    'Putting Save and Cancel at the end of the body, where they scroll away; pass them in footer.',
    'Passing isOpen inside a DialogTrigger; omit it there and let the trigger open the drawer.',
    'Using Modal-style open/onClose props; Drawer takes isOpen and onOpenChange.',
    'Setting the theme on an inner element; drawers render on <body>, so data-theme belongs on <html>.',
  ],
  accessibility: [
    'Handles the dialog role, focus trap, focus restore to the trigger, scroll lock and Escape to close.',
    'Renders a close button with a localised name; override it with closeLabel.',
    'Uses title as the accessible name; without a title, pass aria-label.',
  ],
  example: `<DialogTrigger>
  <Button variant="outline">Edit</Button>
  <Drawer
    title="Edit project"
    footer={
      <>
        <Button slot="close" variant="secondary">Cancel</Button>
        <Button onPress={save}>Save</Button>
      </>
    }
  >
    <TextField label="Name" defaultValue={project.name} />
  </Drawer>
</DialogTrigger>`,
} satisfies ComponentMetadata<DrawerProps>
