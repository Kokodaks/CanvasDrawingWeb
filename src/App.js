import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CanvasPage from './pages/CanvasPage';

//라우팅만 담당
function App(){
  return(
    <Router>
      <Routes>
        <Route path="/"></Route>
        <Route path="/reconstruction" element={<CanvasPage/>}></Route>
      </Routes>
    </Router>
  );
}
export default App;