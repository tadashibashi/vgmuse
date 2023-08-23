import { useState } from 'react';
import {Routes} from "./components/Routes";
import urls from "./urls";


function App() {
    const [user, setUser] = useState<VGMuse.Frontend.User | null>(null);

    return (
        <div className="App">
            <Routes urls={urls.root}/>
        </div>
    );
}

export default App;
