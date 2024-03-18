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

// callback: rendering 함수
export function createHooks(callback) {
  const dependenciesMap = new Map();
  let globalStateIndex = 0;
  const globalState = [];

  const useState = (initState) => {
    const currentIndex = globalStateIndex;
    globalStateIndex++;

    console.log(globalState, globalStateIndex);

    if (globalState[currentIndex] === undefined) {
      globalState[currentIndex] = initState;
    }

    const dispatchAction = (updatedState) => {
      if (updatedState === globalState[currentIndex]) return;

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

  const resetContext = () => {
    // prevStateMap = new Map(stateMap);
    // stateMap = new Map();

    // dependenciesMap = new Map();
    // memoizedValueMap = new Map();
    // globalState = [];
    globalStateIndex = 0;
    console.log(globalState, globalStateIndex);
  };

  return { useState, useMemo, resetContext };
}
