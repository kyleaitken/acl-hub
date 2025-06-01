import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const lightTheme = createTheme({
    typography: {
        fontFamily: [
            'Poppins',
            'Lora',
            'Montserrat',
            'Nunito',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),    
    },
    palette: {
        primary: {
            main: '#666666',
        },
        secondary: {
            main: '#292632', 
        },
        background : {
            default: "white",
        },
        grey: grey,
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "white"
        }
    },
  });
  
const darkTheme = createTheme({
    palette: {
        primary: {
            main: '#90caf9', 
        },
        secondary: {
            main: '#f48fb1', 
        },
        background: {
            
        }
    },
});

export { lightTheme, darkTheme }