

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
      id: "cliente",
      menus: [
        {
          id: "cliente",
          href: "/clientes",
          label: "Clientes",
          active: pathname.includes("/clientes"),
          icon: "heroicons:user",
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
      id: "cidades",
      menus: [
        {
          id: "cidades",
          href: "/cidades",
          label: "Cidades",
          active: pathname.includes("/cidades"),
          icon: "heroicons:map",
          submenus: [
            {
              href: "/cidades",
              label: "Consultar",
              active: pathname.includes("/cidades"),
              icon: "",
              children: [],
            },
            {
              href: "/cidades/create",
              label: "Cadastrar",
              active: pathname.includes("/cidades/create"),
              icon: "",
              children: [],
            }
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "representantes",
      menus: [
        {
          id: "representantes",
          href: "/representantes",
          label: "Representantes",
          active: pathname.includes("/representantes"),
          icon: "heroicons:user-group",
          submenus: [
            {
              href: "/representantes",
              label: "Consultar",
              active: pathname.includes("/representantes"),
              icon: "",
              children: [],
            },
            {
              href: "/representantes/create",
              label: "Cadastrar",
              active: pathname.includes("/representantes/create"),
              icon: "",
              children: [],
            }
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "zonas",
      menus: [
        {
          id: "zonas",
          href: "/zonas",
          label: "Zonas de Atuação",
          active: pathname.includes("/zonas"),
          icon: "heroicons:map-pin",
          submenus: [
            {
              href: "/zonas",
              label: "Consultar",
              active: pathname.includes("/zonas"),
              icon: "",
              children: [],
            },
            {
              href: "/zonas/create",
              label: "Cadastrar",
              active: pathname.includes("/zonas/create"),
              icon: "",
              children: [],
            }
          ],
        },
      ],
    },

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