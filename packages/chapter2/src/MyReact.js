import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let prevRoot = null;
  let rootFn = null;
  let root = null;

  // 리렌더링이 일어나야 함(callback)
  const _render = () => {
    resetHookContext();
    const newRoot = rootFn();

    updateElement(root, newRoot, prevRoot);
    prevRoot = newRoot;
  };
  function render($root, rootComponent) {
    resetHookContext();
    root = $root;
    prevRoot = rootComponent();
    rootFn = rootComponent.bind(this);
    updateElement($root, prevRoot);
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
