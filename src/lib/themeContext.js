import { createContext, useContext } from 'react'

export const ThemeContext = createContext({
  mode: 'dark',
  setMode: () => {},
  toggle: () => {},
})

export const useTheme = () => useContext(ThemeContext)
