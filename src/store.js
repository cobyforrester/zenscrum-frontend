import { createStore } from 'redux';
import rootReducer from './reducers';

const initialState = {isLogged: true};


const store = createStore (
    rootReducer, 
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //for viewing dev tools redux
);

export default store;