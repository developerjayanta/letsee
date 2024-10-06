import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom"
import Lobby from './screen/lobby';
import Room from './screen/room';

function App() {
  return (
    <div className="App">
      
<Routes>
 <Route path='/' element = {<Lobby/>}/>
 <Route path='/Room/:roomid' element = {<Room/>} />
</Routes>

    </div>
  );
}

export default App;



