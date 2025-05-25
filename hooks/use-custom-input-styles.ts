import { useMemo } from "react";
import { createTheme, Theme } from "@mui/material/styles";

export const useCustomSelectStyles = (theme: string) => {
  const customStyles = useMemo(() => ({
    control: (base: any, state: any) => ({
      ...base,
      height: '40px',
      minHeight: '40px',
      backgroundColor: theme === "dark" ? "#1f2937" : "#fff", // bg-gray-800 / bg-white
      borderColor: theme === "dark" ? "#374151" : "#d1d5db", // border-gray-700 / border-gray-300
      color: theme === "dark" ? "#f9fafb" : "#111827", // text-white / text-black
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : base.boxShadow, // focus:ring-blue-500
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
      color: theme === "dark" ? "#f9fafb" : "#111827",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === "dark"
          ? "#374151"
          : "#e5e7eb"
        : "transparent",
      color: theme === "dark" ? "#f9fafb" : "#111827",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: theme === "dark" ? "#f9fafb" : "#111827",
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
