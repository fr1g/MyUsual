
    const [darkMode, setDarkMode] = useState(true);

    function switchTheme (){
        setTheme(!darkMode);
    }

    function setTheme (setAsDark: boolean){
        if(setAsDark){
            document.documentElement.setAttribute("class", "dark");
            localStorage.theme = "dark";
            setDarkMode(true);
        }else{
            document.documentElement.setAttribute("class", "");
            localStorage.theme = "light";
            setDarkMode(false);
        }

    }    

    useEffect(() => {
        if(localStorage.theme == undefined || localStorage.theme == null){
        // if no value then use browser settings
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }else{
        // if got value then apply the value
            setTheme(localStorage.theme == "dark");
        }
        // set up matches and update when preference changed
        window.matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e: MediaQueryListEvent) => {
            
                console.log(`detected environment theme changed: dark`)
                setTheme(e.matches);
        });

        // window.matchMedia("(prefers-color-scheme: light)")
        //     .addEventListener("change", (e: MediaQueryListEvent) => {
            
        //         console.log(`detected environment theme changed: light`)
        //         setTheme(!e.matches);
        // });
    }, []);
