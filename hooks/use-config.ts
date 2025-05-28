import { layoutType, navBarType, sidebarType } from "@/lib/type"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"



export type Config = {
  collapsed: boolean
  theme: string
  skin: 'default' | 'bordered'
  layout: layoutType
  sidebar: sidebarType
  menuHidden: boolean,
  showSearchBar: boolean,
  showSwitcher: boolean
  topHeader: 'default' | 'links'
  contentWidth: 'wide' | 'boxed'
  navbar: navBarType
  footer: 'sticky' | 'default' | 'hidden'
  isRtl: boolean
  subMenu: boolean
  hasSubMenu: boolean
  sidebarTheme: string,
  headerTheme: string,
  sidebarBgImage?: string
  radius: number

}
export const defaultConfig: Config = {
  collapsed: true,
  theme: "zinc",
  skin: 'default',
  layout: "vertical",
  // sidebar: 'two-column',
  sidebar: 'draggable',
  menuHidden: false,
  showSearchBar: false,
  topHeader: 'default',
  contentWidth: 'wide',
  navbar: 'sticky',
  footer: 'hidden',
  isRtl: false,
  showSwitcher: true,
  subMenu: false,
  hasSubMenu: false,
  sidebarTheme: 'light',
  // headerTheme: 'light',
  headerTheme: 'transparent',
  sidebarBgImage: undefined,
  radius: 0.5,
}

const configAtom = atomWithStorage<Config>("config", defaultConfig)

export function useConfig() {

  return useAtom(configAtom)
}
