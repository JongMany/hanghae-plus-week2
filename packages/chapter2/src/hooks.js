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

// callback: rendering 함수 (_render)
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
      console.log("dispatch", updatedState, globalState);
      if (updatedState === globalState[currentIndex]) return;

      globalState[currentIndex] = updatedState;
      console.log(callback, "callback");
      callback(); // 리렌더링
    };
    return [globalState[currentIndex], dispatchAction];
  };

  const useMemo = (fn, deps) => {
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
    globalStateIndex = 0;
    console.log(globalState, globalStateIndex);
  };

  return { useState, useMemo, resetContext };
}

/* export function createHooks(callback) {
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
      console.log("dispatch", updatedState);
      if (updatedState === globalState[currentIndex]) return;

      globalState[currentIndex] = updatedState;
      console.log(callback, "callback");
      callback(); // 리렌더링
    };

    return [globalState[currentIndex], dispatchAction];
  };

  const useMemo = (fn, deps) => {
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
    globalStateIndex = 0;
    console.log(globalState, globalStateIndex);
  };

  return { useState, useMemo, resetContext };
}
 */
