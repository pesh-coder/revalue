import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-xl',
            'headline-lg',
            'headline-md',
            'headline-feature',
            'headline-sm',
            'body-lg',
            'body-md',
            'body-sm',
            'label-md',
            'label-sm',
            'caption',
          ],
        },
      ],
    },
  },
})
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
