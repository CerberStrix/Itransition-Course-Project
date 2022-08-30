import { useContext } from "react";

import authContext from '../contexts/AuthContext.jsx';
import themeContext from '../contexts/ThemeContext.jsx';

const useAuth = () => useContext(authContext);
const useTheme = () => useContext(themeContext);

export { useAuth, useTheme };