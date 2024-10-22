import React, { Suspense } from 'react';
import {Route, Routes} from 'react-router-dom'
import PageTemplate from './components/main/PageTemplate';
import Home from './components/main/Home';

import './css/reset.css';
import './css/index.css';

const Calculator = React.lazy(() => import('./components/calculator/Calculator'));
const Counter = React.lazy(() => import('./components/counter/Counter'));
const CounterReducer = React.lazy(() => import('./components/counter/CounterReducer'));
const CounterReducer2 = React.lazy(() => import('./components/counter/CounterReducer2'));
const FetchDataComponent = React.lazy(() => import('./components/simplecrud/SimpleFetch'));
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
        <Route path='/counter' element={<PageTemplate PageItemComponent={Counter}/>} />
        <Route path='/counter2' element={<PageTemplate PageItemComponent={CounterReducer}/>} />
        <Route path='/counter3' element={<PageTemplate PageItemComponent={CounterReducer2}/>} />
        <Route path='/fetch' element={<PageTemplate PageItemComponent={FetchDataComponent}/>} />
        <Route path='/dvd' element={<PageTemplate PageItemComponent={DvdAPI}/>} />
        <Route path='/visualiser' element={<PageTemplate PageItemComponent={Visualiser}/>} />
        <Route path='/goblintower' element={<PageTemplate PageItemComponent={GoblinTower}/>} />
      </Routes>
    </Suspense>
  )
}

export default App;
