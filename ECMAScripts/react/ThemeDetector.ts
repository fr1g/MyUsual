import { useEffect, useState } from "react";

// usage: put these anywhere upper than the switch button (or in switch button)
// const theme = useThemeDetector();
// const [darkMode, setDarkMode] = useState(true);
// and: 
// theme.bindedUpdater = () => setDarkMode(!darkMode);
// when using button:
// ...onClick={theme.trigger}

function documentElementSwitcher(mode: 'dark' | 'light') {
    document.documentElement.setAttribute("class", mode);
    document.documentElement.setAttribute("dark", mode);
    localStorage.setItem("theme", mode);
}

export class ThemeHelper {
    mode: 'dark' | 'light' = 'light';
    isDark: boolean = false;

    bindedUpdater = () => { }

    sync = (isDark: boolean) => {
        this.isDark = isDark;
        this.mode = isDark ? 'dark' : 'light';
    }

    trigger = () => {
        this.setTheme(!this.isDark, this.bindedUpdater);
    }

    /**
     * 
     * @param setAsDark indicate the dark mode: setting to dark: true; setting to light: false
     * @param setDarkMode the react useState function to sync status
     * 
     */
    setTheme = (setAsDark: boolean, setDarkMode: (arg0: boolean) => unknown) => {
        this.sync(setAsDark);
        documentElementSwitcher(this.mode);
        localStorage.theme = this.mode;

        setDarkMode(setAsDark);
    }

    constructor(initState: boolean) {
        this.sync(initState);
    }

}

export const useThemeDetector = (forceInit: boolean | undefined = undefined) => {

    console.log(`[TMD] >>> INIT theme detector by llr. ${localStorage.theme} using force init: ${forceInit} dark/light/unset. `);

    const getCurrentSysTheme = () => {
        const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        console.log("[TMD] >>> current system mode: " + sysTheme);
        // if got preferred already, use it
        // if pref
        return (localStorage.getItem("theme")! !== null && localStorage.theme !== undefined) ? localStorage.theme === "dark" : sysTheme; // ??? orig: sysTheme
    };

    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const sysTheme = getCurrentSysTheme();
        documentElementSwitcher(sysTheme ? 'dark' : 'light');
        return sysTheme;
    });

    function updated(v: boolean) {
        setIsDarkTheme(v);
        console.log("[TMD] >>> Change detected: " + v);
    }

    const mqResponser = (matches: boolean) => { // mediaQueryListn
        // updated(matches);
        documentElementSwitcher(matches ? "dark" : "light")
        updated(matches);

    };

    const matches = (e: MediaQueryListEvent) => {
        console.log("[TMD] >>> Detected system mode changed.");
        mqResponser(e.matches);
    }

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addEventListener("change", matches);

        return () => darkThemeMq.removeEventListener("change", matches);
    }, []); // eslint-disable-line

    let val = (localStorage.getItem("theme")! !== null && localStorage.theme !== undefined) // eslint-disable-line 
        ? localStorage.theme === "dark"
        : isDarkTheme;

    console.log(`[TMD] >>> Detected as: ${val}`);

    return new ThemeHelper(val);
};
