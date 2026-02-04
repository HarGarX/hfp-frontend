/**
 * Layout and Spacing Constants
 * Use these constants for consistent spacing throughout the application
 */

export const SPACING = {
  // Page Container
  page: 'px-4 sm:px-6 lg:px-8 py-8',
  pageNoPadding: 'px-4 sm:px-6 lg:px-8',
  
  // Section Spacing (vertical)
  section: 'space-y-8',      // Between major sections
  card: 'space-y-6',         // Between cards/groups
  form: 'space-y-4',         // Between form fields
  
  // Button Groups (horizontal)
  buttons: 'space-x-3',
  buttonsSmall: 'space-x-2',
  
  // Card Padding
  cardPadding: 'p-6',
  cardPaddingResponsive: 'p-4 sm:p-6',
  cardPaddingSmall: 'p-4',
  
  // Grid Gaps
  gridGap: 'gap-6',
  gridGapSmall: 'gap-4',
  gridGapLarge: 'gap-8',
  
  // List Spacing
  list: 'space-y-3',
  listTight: 'space-y-2',
} as const;

export const RESPONSIVE = {
  // Container widths
  container: 'container mx-auto',
  containerFluid: 'w-full',
  
  // Grid columns
  grid2: 'grid grid-cols-1 md:grid-cols-2',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  
  // Flexbox
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-row',
  flexBetween: 'flex items-center justify-between',
  flexCenter: 'flex items-center justify-center',
} as const;

export const SHADOWS = {
  card: 'shadow-sm hover:shadow-md transition-shadow',
  modal: 'shadow-xl',
  dropdown: 'shadow-lg',
} as const;

export const BORDERS = {
  default: 'border border-gray-200 dark:border-gray-700',
  top: 'border-t border-gray-200 dark:border-gray-700',
  bottom: 'border-b border-gray-200 dark:border-gray-700',
  rounded: 'rounded-lg',
  roundedFull: 'rounded-full',
} as const;
