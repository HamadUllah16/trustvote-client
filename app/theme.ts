'use client'
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

const theme = createTheme({
    typography: {
        fontFamily: inter.style.fontFamily,
        subtitle1: { fontSize: '18px' },
        h3: {
            color: '#F85D40'
        }
    },
    palette: {
        primary: {
            main: '#F85D40',
            '100': '#f2f2f2',
            '200': '#676767',
            contrastText: '#0C0C0C',

        },
        secondary: {
            main: '#0C0C0C',
            '100': '#ebecf0',
            '200': '#2B2B2D'
        },
        background: {
            default: '#1C1C1C',
        },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiTextField: {
            styleOverrides: { root: { backgroundColor: '#2B2B2D', borderRadius: '8px' } }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #2B2B2D'
                }
            }
        },
        MuiPaper: {
            styleOverrides: { root: { backgroundColor: '#2B2B2D' } }
        }
    }
});

export default theme;