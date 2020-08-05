// Height of main input
export const INPUT_HEIGHT = 54

// Heigth of default result line
export const RESULT_HEIGHT = 48

// size of main window
export const WINDOW_WIDTH = 650

// this.isWindow ? this.mainWindowBorderWidth = 2 : this.isLinux ? this.mainWindowBorderWidth = 1 : this.mainWindowBorderWidth = 0
export const getBorderWidth = () => (global.platform.isWinOS ? 2 : global.platform.isMacOS ? 0 : 1)
export const MAX_WINDOW_HEIGHT = 534

// Maximum results that would be rendered
export const MAX_RESULTS = 25

// Results view shows this count of resutls without scrollbar
export const MIN_VISIBLE_RESULTS = 10
