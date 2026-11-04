import '@testing-library/jest-dom/vitest'

// jsdom has no Web Animations API; React Aria's SelectionIndicator calls it on transitions.
if (typeof Element !== 'undefined') Element.prototype.getAnimations ??= () => []

// jsdom has no IntersectionObserver; React Aria's MenuLoadMoreItem observes its sentinel with one.
globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
} as unknown as typeof IntersectionObserver
