import { useState } from 'react';
import {Routes} from "./components/Routes";
import urls from "./urls";

interface IUser {

}

function App() {
    const [user, setUser] = useState(0);



    return (
        <div className="App">
            <Routes urls={urls.root}/>
        </div>
    );
}

export default App;
