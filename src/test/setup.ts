import '@testing-library/jest-dom/vitest'

// jsdom has no Web Animations API; React Aria's SelectionIndicator calls it on transitions.
if (typeof Element !== 'undefined') Element.prototype.getAnimations ??= () => []
