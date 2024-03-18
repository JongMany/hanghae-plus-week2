export function jsx(type, props, ...children) {
  return {
    type,
    props,
    children: children || [],
  };
}

export function createElement(node) {
  // jsx를 dom으로 변환
  if (!node) return;

  const parent = document.createElement(node.type);

  if (node.props !== null) {
    for (let key in node.props) {
      parent.setAttribute(key, node.props[key]);
    }
  }

  if (node.children.length > 0) {
    node.children.forEach((child) => {
      if (typeof child === "string") {
        // 자식이 textNode인 경우
        parent.textContent += child;
      } else {
        // 자식이 elementNode인 경우
        parent.appendChild(createElement(child));
      }
    });
  }
  return parent;
}

function updateAttributes(target, newProps, oldProps) {
  const newKeys = newProps ? Object.keys(newProps) : [];
  const oldKeys = oldProps ? Object.keys(oldProps) : [];

  // console.log(newKeys, oldKeys);

  newKeys.forEach((key) => {
    if (!oldKeys.includes(key) || newProps[key] !== oldProps[key]) {
      // 변경되어야 함
      target.setAttribute(key, newProps[key]);
    }
  });
  oldKeys.forEach((key) => {
    if (!newKeys.includes(key)) {
      target.removeAttribute(key);
    }
  });
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
}

export function render(parent, newNode, oldNode, index = 0) {
  // console.log(parent, "node", newNode, oldNode, index);
  // 1. 만약 newNode가 없고 oldNode만 있다면 parent에서 oldNode를 제거 (종료) => UnMount
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면 newNode를 생성하여 parent에 추가 (종료) => Mount
  if (newNode && !oldNode) {
    const partialDOM = createElement(newNode);
    parent.appendChild(partialDOM);
    return;
  }

  // const partialParent = parent.childNodes[index]; // 현재 서브트리의 루트
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면 oldNode를 newNode로 교체 (종료)
  if (typeof newNode === "string" && typeof oldNode === "string") {
    // partialParent.replaceChild();
    if (newNode !== oldNode) {
      parent.textContent = newNode;
    }
    return;
  }
  const partialParent = parent.childNodes[index]; // 현재 서브트리의 루트
  // 4. 만약 newNode와 oldNode의 타입이 다르다면 oldNode를 newNode로 교체 (종료)
  if (newNode.type !== oldNode.type) {
    const partialDOM = createElement(newNode);
    parent.replaceChild(partialDOM, parent.childNodes[index]);
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  // const partialParent = parent.childNodes[index]; // 현재 서브트리의 루트
  updateAttributes(partialParent, newNode.props, oldNode.props);
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  // console.log(oldNode);
  if (newNode?.children.length >= oldNode?.children.length) {
    // const partialParent = parent.childNodes[index];
    newNode.children.forEach((child, idx) => {
      render(partialParent, newNode.children[idx], oldNode.children[idx], idx);
    });
  }
}
