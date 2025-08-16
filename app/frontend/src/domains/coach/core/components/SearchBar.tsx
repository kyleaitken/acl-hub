import { Input, InputAdornment } from "@mui/material";
import { grey } from "@mui/material/colors";
import SearchIcon from '@mui/icons-material/Search';
import clsx from "clsx";

interface SearchBarProps {
    searchString: string;
    searchHandler: (searchTerm: string) => void;
    placeholder: string;
    className?: string;
};

const SearchBar = ({searchString, searchHandler, placeholder, className}: SearchBarProps) => {
    return (
        <div className={clsx("flex w-full items-center justify-center", className)}>
            <Input
                fullWidth
                disableUnderline
                placeholder={placeholder}
                value={searchString}
                onChange={(e) => searchHandler(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                    <SearchIcon
                        sx={{color: grey[400], fontSize: 20}}
                    />
                    </InputAdornment>
                }
                sx={{
                    padding: '10px',
                    border: '1px solid black',
                    backgroundColor: 'white',
                    height: '45px',
                    flexGrow: 1,
                    borderRadius: 1,
                    fontSize: 14
                }}
            />
        </div>
    );
};

export default SearchBar;