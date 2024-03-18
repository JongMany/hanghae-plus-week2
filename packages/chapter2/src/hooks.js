/* export function createHooks(callback) {

  const useState = (initState) => {
    const dispatchAction = (updatedState) => {};

    return [];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {};

  return { useState, useMemo, resetContext };
} */

let stateMap = new Map();
let prevStateMap = null;
let dependenciesMap = new Map();
let memoizedValueMap = new Map();
let globalStateIndex = 0;
let globalState = [];

// callback: rendering 함수
export function createHooks(callback) {
  const useState = (initState) => {
    const currentIndex = globalStateIndex;
    globalStateIndex++;

    if (globalState[currentIndex] === undefined) {
      globalState[currentIndex] = initState;
    }

    const dispatchAction = (updatedState) => {
      globalState[currentIndex] = updatedState;
      callback(); // 리렌더링
    };

    return [globalState[currentIndex], dispatchAction];
  };

  const useMemo = (fn, deps) => {
    // const depsId = Symbol();
    const depsString = deps.join(",");
    if (dependenciesMap.has(depsString)) {
      return dependenciesMap.get(depsString);
    } else {
      const data = fn();
      dependenciesMap.set(depsString, data);
      return data;
    }
  };

  const resetContext = (updatedState) => {
    // globalState = [];
    // prevStateMap = new Map(stateMap);
    // stateMap = new Map();

    // dependenciesMap = new Map();
    // memoizedValueMap = new Map();
    globalStateIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
