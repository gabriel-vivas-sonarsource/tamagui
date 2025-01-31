// *0 order matches to *1

export const pseudoDescriptors = {
  hoverStyle: {
    name: 'hover',
    priority: 1,
  },
  pressStyle: {
    name: 'active',
    priority: 2,
  },
  focusStyle: {
    name: 'focus',
    priority: 3,
  },
} as const

export type PseudoDescriptor = typeof pseudoDescriptors[keyof typeof pseudoDescriptors]
