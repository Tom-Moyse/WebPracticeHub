import React, { Suspense } from 'react';
import {Route, Routes} from 'react-router-dom'
import PageTemplate from './components/main/PageTemplate';
import Home from './components/main/Home';

import './css/reset.css';
import './css/index.css';

const Calculator = React.lazy(() => import('./components/calculator/Calculator'));
const CounterReducer2 = React.lazy(() => import('./components/counter/CounterReducer2'));
const DvdAPI = React.lazy(() => import('./components/dvdcrud/DvdAPI'));
const Visualiser = React.lazy(() => import('./components/visualiser/Visualiser'));
const GoblinTower = React.lazy(() => import('./components/goblintower/GoblinTower'));

function App() {
  return (
    <Suspense fallback={<div className='App'>Loading...</div>}>
      <Routes>
        <Route exact path='/' element={<PageTemplate PageItemComponent={Home}/>} />
        <Route path='/home' element={<PageTemplate PageItemComponent={Home}/>} />
        <Route path='/calculator' element={<PageTemplate PageItemComponent={Calculator}/>} />
        <Route path='/counter' element={<PageTemplate PageItemComponent={CounterReducer2}/>} />
        <Route path='/dvd' element={<PageTemplate PageItemComponent={DvdAPI}/>} />
        <Route path='/visualiser' element={<PageTemplate PageItemComponent={Visualiser}/>} />
        <Route path='/goblintower' element={<PageTemplate PageItemComponent={GoblinTower}/>} />
      </Routes>
    </Suspense>
  )
}

export default App;
