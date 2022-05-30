import { createGlobalState } from 'react-hooks-global-state'
import { GlobalModelState } from './stateType'

// app state
const initialState: GlobalModelState = {
  newAccountMode: 'create'
}

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState)

export { useGlobalState, getGlobalState, setGlobalState }
