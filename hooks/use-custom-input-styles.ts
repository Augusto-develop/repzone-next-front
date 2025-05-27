import { useMemo } from "react";
import { createTheme, Theme } from "@mui/material/styles";

export const useCustomSelectStyles = (theme: string) => {
  const customStyles = useMemo(() => ({
    control: (base: any, state: any) => ({
      ...base,
      height: '40px',
      minHeight: '40px',
      backgroundColor: state.isDisabled
        ? (theme === "dark" ? "#374151" : "#e5e7eb")  // cinza escuro ou claro para disabled
        : (theme === "dark" ? "#1f2937" : "#fff"),
      borderColor: state.isDisabled
        ? (theme === "dark" ? "#4b5563" : "#d1d5db")  // borda cinza para disabled
        : (theme === "dark" ? "#374151" : "#d1d5db"),
      color: state.isDisabled
        ? (theme === "dark" ? "#9ca3af" : "#6b7280")  // texto cinza para disabled
        : (theme === "dark" ? "#f9fafb" : "#111827"),
      boxShadow: state.isFocused && !state.isDisabled ? "0 0 0 1px #3b82f6" : base.boxShadow,
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      "&:hover": {
        borderColor: state.isDisabled ? undefined : "#3b82f6",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
      color: theme === "dark" ? "#f9fafb" : "#111827",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isDisabled
        ? "transparent"
        : state.isFocused
          ? theme === "dark" ? "#374151" : "#e5e7eb"
          : "transparent",
      color: state.isDisabled
        ? (theme === "dark" ? "#6b7280" : "#9ca3af")
        : theme === "dark" ? "#f9fafb" : "#111827",
      cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),
    singleValue: (base: any, state: any) => ({
      ...base,
      color: state.isDisabled
        ? (theme === "dark" ? "#9ca3af" : "#6b7280")
        : (theme === "dark" ? "#f9fafb" : "#111827"),
    }),
  }), [theme]);

  return customStyles;
};


export const useCustomMuiDatepickerTheme = (themeMode: "dark" | "light"): Theme => {
  return useMemo(() => {
    if (themeMode === "dark") {
      return createTheme({
        palette: {
          mode: "dark",
          background: {
            default: "rgba(31, 41, 55, 0.8)", // fundo escuro transparente
            paper: "rgba(31, 41, 55, 0.8)",
          },
          text: {
            primary: "#f9fafb",
          },
          primary: {
            main: "#3b82f6",
          },
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                height: 40,
                fontSize: 14,
                color: "#f9fafb",
                backgroundColor: "rgba(31, 41, 55, 0.8)", // transparente escuro
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#374151",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px #3b82f6",
                },
              },
            },
          },
        },
      });
    } else {
      return createTheme({
        palette: {
          mode: "light",
          background: {
            default: "#fff", // branco sólido
            paper: "#fff",
          },
          text: {
            primary: "#111827",
          },
          primary: {
            main: "#3b82f6",
          },
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                height: 40,
                fontSize: 14,
                color: "#111827",
                backgroundColor: "#fff", // branco sólido
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px #3b82f6",
                },
              },
            },
          },
        },
      });
    }
  }, [themeMode]);
};
