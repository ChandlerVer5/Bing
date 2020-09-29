// Height of main input
export const INPUT_HEIGHT = 56

// Heigth of default result line
export const RESULT_HEIGHT = 48

// size of main window
export const WINDOW_WIDTH = process.platform === 'win32' ? 724 : 700

export const BORDER_WIDTH = process.platform === 'win32' ? 2 : process.platform === 'darwin' ? 0 : 1

// eslint-disable-next-line unicorn/no-nested-ternary
export const MAX_WINDOW_HEIGHT = RESULT_HEIGHT * 10 + INPUT_HEIGHT + 2 * 2 // 48 * 10 + 56 = 536, border width*2!

// Maximum results that would be rendered
export const MAX_RESULTS = 25

// Results view shows this count of resutls without scrollbar
export const MIN_VISIBLE_RESULTS = 10
