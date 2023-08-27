import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import {Routes} from "./components/Routes";
import urls from "./urls";
import {navigateService} from "./services";
import Head from "./components/Head.tsx";



function App() {
    const [user, setUser] = useState<VGMuse.Frontend.User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        navigateService.set(navigate);
    }, []);

    return (
        <div className="App">
            <Head title="VGMuse" description="Music library & social space for chiptune artists & fans" />
            <Routes urls={urls.root}/>
        </div>
    );
}

export default App;
