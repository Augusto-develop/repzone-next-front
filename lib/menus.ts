

export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string): Group[] {

  return [
    {
      groupLabel: "",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard",
          label: "dashboard",
          active: pathname.includes("/dashboard"),
          icon: "mdi:home",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      id: "clientes",
      menus: [
        {
          id: "changelog",
          href: "/clientes",
          label: "clientes",
          active: pathname.includes("/clientes"),
          icon: "heroicons:arrow-trending-up",
          submenus: [
            {
              href: "/clientes",
              label: "Consultar",
              active: pathname.includes("/clientes"),
              icon: "",
              children: [],
            },
            {
              href: "/clientes/create",
              label: "Cadastrar",
              active: pathname.includes("/clientes/create"),
              icon: "",
              children: [],
            }
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "maps",
      menus: [
        {
          id: "maps",
          href: "/maps/maps-leaflet",
          label: "maps",
          active: pathname.includes("/maps/maps-leaflet"),
          icon: "heroicons-outline:map",
          submenus: [
            {
              href: "/maps/maps-leaflet",
              label: "mapsLeaflet",
              active: pathname.includes("/maps/maps-leaflet"),
              icon: "",
              children: [],
            },
            {
              href: "/maps/maps-vector",
              label: "mapsVector",
              active: pathname.includes("/maps/maps-vector"),
              icon: "",
              children: [],
            },
          ],
        },
      ],
    }
  ];
}
export function getHorizontalMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "dashboard",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/",
          label: "dashboard",
          active: pathname.includes("/"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
  ];
}