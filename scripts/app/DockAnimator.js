const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function isShown(el) {
    return el.isConnected && !el.classList.contains("hidden") && getComputedStyle(el).display !== "none";
}

function visualIndex(elements) {
    const shown = elements.filter(isShown).sort((a, b) => (parseInt(a.style.order) || 0) - (parseInt(b.style.order) || 0));
    return new Map(shown.map((el, i) => [el, i]));
}

function cancelFlip(el) {
    el.getAnimations().forEach((a) => a.id === "combat-dock-flip" && a.cancel());
}

function collapseGhost(container, el, rect, vertical, duration) {
    const containerRect = container.getBoundingClientRect();
    const ghost = el.cloneNode(true);
    ghost.classList.add("flip-ghost");
    ghost.removeAttribute("data-combatant-id");
    Object.assign(ghost.style, {
        left: `${rect.left - containerRect.left - container.clientLeft + container.scrollLeft}px`,
        top: `${rect.top - containerRect.top - container.clientTop + container.scrollTop}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
        transform: "",
    });
    container.appendChild(ghost);
    const collapsed = vertical ? "scaleY(0)" : "scaleX(0)";
    const anim = ghost.animate([{ transform: "none", opacity: 1 }, { transform: collapsed, opacity: 0 }], { duration, easing: EASING, fill: "forwards" });
    return anim.finished.catch(() => {}).finally(() => ghost.remove());
}

function growIn(el, vertical, duration) {
    const collapsed = vertical ? "scaleY(0)" : "scaleX(0)";
    const anim = el.animate([{ transform: collapsed, opacity: 0 }, { transform: "none", opacity: 1 }], { duration, easing: EASING, id: "combat-dock-flip" });
    return anim.finished.catch(() => {});
}

export function animateLayout(container, mutate, { duration, vertical = false, exclude = [], exiting = [] } = {}) {
    const children = Array.from(container.children).filter((el) => !el.classList.contains("flip-ghost") && !exclude.includes(el));
    const before = new Map();
    const beforeIndex = visualIndex(children);
    for (const el of children) {
        if (!beforeIndex.has(el)) continue;
        before.set(el, el.getBoundingClientRect());
    }
    for (const el of exiting) {
        if (isShown(el)) before.set(el, el.getBoundingClientRect());
    }

    container.classList.add("flip-measure");
    children.forEach(cancelFlip);
    mutate();
    const after = Array.from(container.children).filter((el) => !el.classList.contains("flip-ghost") && !exclude.includes(el));
    const afterIndex = visualIndex(after);
    const afterRects = new Map(after.filter((el) => afterIndex.has(el)).map((el) => [el, el.getBoundingClientRect()]));
    container.classList.remove("flip-measure");

    const promises = [];
    const count = afterIndex.size;

    for (const el of exiting) {
        const rect = before.get(el);
        if (rect && !after.includes(el)) promises.push(collapseGhost(container, el, rect, vertical, duration));
    }

    for (const [el, newRect] of afterRects) {
        const oldRect = before.get(el);
        if (!oldRect) {
            promises.push(growIn(el, vertical, duration));
            continue;
        }
        const wrapped = count > 2 && Math.abs(afterIndex.get(el) - beforeIndex.get(el)) > count / 2;
        if (wrapped) {
            promises.push(collapseGhost(container, el, oldRect, vertical, duration));
            promises.push(growIn(el, vertical, duration));
            continue;
        }
        const dx = oldRect.left + oldRect.width / 2 - (newRect.left + newRect.width / 2);
        const dy = oldRect.top + oldRect.height / 2 - (newRect.top + newRect.height / 2);
        const sx = newRect.width ? oldRect.width / newRect.width : 1;
        const sy = newRect.height ? oldRect.height / newRect.height : 1;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) continue;
        const anim = el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transform: "none" }], { duration, easing: EASING, id: "combat-dock-flip" });
        promises.push(anim.finished.catch(() => {}));
    }

    return Promise.all(promises);
}
