import { animateLayout } from "./DockAnimator.js";

const DRAG_THRESHOLD = 5;
const IGNORED_TARGETS = ".action, .system-icon, .portrait-effect, .portrait-pass, [data-action]";

export class DockDragReorder {
    constructor(dock) {
        this.dock = dock;
        this.container = dock.element.querySelector("#combatants");
        this.state = null;
        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerUp = this._onPointerUp.bind(this);
        this._onPointerCancel = this._onPointerCancel.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this.container.addEventListener("pointerdown", this._onPointerDown);
    }

    get axis() {
        return this.dock.isVertical ? "y" : "x";
    }

    get items() {
        return Array.from(this.container.children)
            .filter((el) => !el.classList.contains("flip-ghost"))
            .sort((a, b) => (parseInt(a.style.order) || 0) - (parseInt(b.style.order) || 0));
    }

    _onPointerDown(event) {
        if (event.button !== 0 || this.state) return;
        const el = event.target.closest(".combatant-portrait");
        if (!el || el.classList.contains("flip-ghost") || event.target.closest(IGNORED_TARGETS)) return;
        this.state = { el, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, dragging: false };
        this.container.addEventListener("pointermove", this._onPointerMove);
        this.container.addEventListener("pointerup", this._onPointerUp);
        this.container.addEventListener("pointercancel", this._onPointerCancel);
    }

    _onPointerMove(event) {
        const state = this.state;
        if (!state || event.pointerId !== state.pointerId) return;
        if (!state.dragging) {
            if (Math.hypot(event.clientX - state.startX, event.clientY - state.startY) < DRAG_THRESHOLD) return;
            this._startDrag(event);
        }
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        this._followPointer();
        this._updatePreview();
    }

    _startDrag(event) {
        const state = this.state;
        state.dragging = true;
        state.sequence = this.items;
        state.originalOrders = new Map(state.sequence.map((el) => [el, el.style.order]));
        state.el.getAnimations().forEach((a) => a.cancel());
        state.el.setPointerCapture(event.pointerId);
        state.el.classList.add("dragging");
        this.container.classList.add("reordering");
        game.tooltip.deactivate();
        this._measureOrigin();
        window.addEventListener("keydown", this._onKeyDown);
    }

    _measureOrigin() {
        const state = this.state;
        const transform = state.el.style.transform;
        state.el.style.transform = "";
        const rect = state.el.getBoundingClientRect();
        state.el.style.transform = transform;
        state.originX = rect.left + rect.width / 2;
        state.originY = rect.top + rect.height / 2;
        state.grabOffsetX ??= state.startX - state.originX;
        state.grabOffsetY ??= state.startY - state.originY;
    }

    _followPointer() {
        const state = this.state;
        const dx = state.lastX - state.grabOffsetX - state.originX;
        const dy = state.lastY - state.grabOffsetY - state.originY;
        state.el.style.transform = this.axis === "x" ? `translateX(${dx}px)` : `translateY(${dy}px)`;
    }

    _updatePreview() {
        const state = this.state;
        const axis = this.axis;
        const pointer = axis === "x" ? state.lastX : state.lastY;
        const others = state.sequence.filter((el) => el !== state.el);
        const shown = others.filter((el) => el.offsetParent !== null);
        let target = shown.find((el) => {
            const rect = el.getBoundingClientRect();
            return pointer < (axis === "x" ? rect.left + rect.width / 2 : rect.top + rect.height / 2);
        });
        const index = target ? others.indexOf(target) : others.length;
        const sequence = [...others.slice(0, index), state.el, ...others.slice(index)];
        if (sequence.every((el, i) => el === state.sequence[i])) return;
        state.sequence = sequence;
        animateLayout(
            this.container,
            () => {
                sequence.forEach((el, i) => el.style.setProperty("order", i * 100));
                this._measureOrigin();
                this._followPointer();
            },
            { duration: CONFIG.combatTrackerDock.REORDER_ANIMATION_DURATION, vertical: this.dock.isVertical, exclude: [state.el] },
        );
    }

    async _onPointerUp(event) {
        const state = this.state;
        if (!state || event.pointerId !== state.pointerId) return;
        if (!state.dragging) return this._cleanup();
        this._suppressNextClick();
        const order = this._initiativeOrder(state.sequence);
        const dragged = this.dock.combat.combatants.get(state.el.dataset.combatantId);
        this._endDrag();
        const changed = order.some((c, i) => c !== this.dock.sortedCombatants[i]);
        if (!changed || !dragged) return this._revert();
        const { updates, combatTurn } = getReorderUpdates(this.dock.combat, order, dragged);
        if (!updates.length) return this._revert();
        await this.dock.combat.updateEmbeddedDocuments("Combatant", updates, combatTurn === undefined ? {} : { combatTurn });
    }

    _onPointerCancel(event) {
        if (!this.state || event.pointerId !== this.state.pointerId) return;
        const dragging = this.state.dragging;
        this._endDrag();
        if (dragging) this._revert();
    }

    _onKeyDown(event) {
        if (event.key !== "Escape" || !this.state?.dragging) return;
        event.preventDefault();
        event.stopPropagation();
        this._suppressNextClick();
        this._endDrag();
        this._revert();
    }

    _initiativeOrder(sequence) {
        const combatants = this.dock.combat.combatants;
        const separator = sequence.find((el) => el.classList.contains("separator"));
        let elements = sequence.filter((el) => el.classList.contains("combatant-portrait"));
        if (this.dock.trueCarousel && separator && separator.style.display !== "none") {
            const at = sequence.indexOf(separator);
            const tail = sequence.slice(0, at).filter((el) => el.classList.contains("combatant-portrait"));
            const head = sequence.slice(at + 1).filter((el) => el.classList.contains("combatant-portrait"));
            elements = [...head, ...tail];
        }
        const order = elements.map((el) => combatants.get(el.dataset.combatantId)).filter(Boolean);
        const missing = this.dock.sortedCombatants.filter((c) => !order.includes(c));
        return [...order, ...missing];
    }

    _revert() {
        this.dock.animateOrder();
    }

    _suppressNextClick() {
        const block = (event) => {
            event.stopPropagation();
            event.preventDefault();
        };
        this.container.addEventListener("click", block, { capture: true, once: true });
        setTimeout(() => this.container.removeEventListener("click", block, { capture: true }), 0);
    }

    _endDrag() {
        const el = this.state?.el;
        if (el) {
            if (el.hasPointerCapture(this.state.pointerId)) el.releasePointerCapture(this.state.pointerId);
            const rect = el.getBoundingClientRect();
            el.style.transform = "";
            el.classList.remove("dragging");
            const settled = el.getBoundingClientRect();
            const dx = rect.left - settled.left;
            const dy = rect.top - settled.top;
            if (dx || dy) {
                el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
                    duration: CONFIG.combatTrackerDock.REORDER_ANIMATION_DURATION,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                });
            }
        }
        this.container.classList.remove("reordering");
        window.removeEventListener("keydown", this._onKeyDown);
        this._cleanup();
    }

    _cleanup() {
        this.container.removeEventListener("pointermove", this._onPointerMove);
        this.container.removeEventListener("pointerup", this._onPointerUp);
        this.container.removeEventListener("pointercancel", this._onPointerCancel);
        this.state = null;
    }

    destroy() {
        if (this.state?.dragging) this._endDrag();
        this._cleanup();
        this.container.removeEventListener("pointerdown", this._onPointerDown);
    }
}

function isRolled(combatant) {
    return Number.isNumeric(combatant.initiative);
}

function sortDirection(combat) {
    const rolled = combat.turns.filter(isRolled);
    for (let i = 1; i < rolled.length; i++) {
        const diff = rolled[i - 1].initiative - rolled[i].initiative;
        if (diff) return Math.sign(diff);
    }
    return 1;
}

function matchesOrder(combat, order, values) {
    const standIns = order.map((c) => (values.has(c) ? c.clone({ initiative: values.get(c) }, { keepId: true }) : c));
    const sorted = [...standIns].sort(combat._sortCombatants);
    return sorted.every((c, i) => c.id === order[i].id);
}

function spread(run, upper, lower, dir) {
    const step = upper !== undefined && lower !== undefined ? (upper - lower) / (run.length + 1) : dir;
    const start = upper ?? lower + dir * (run.length + 1);
    return new Map(run.map((c, i) => [c, start - step * (i + 1)]));
}

function candidateValues(order, dragged, dir) {
    const index = order.indexOf(dragged);
    const prev = order.slice(0, index).reverse().find(isRolled);
    const next = order.slice(index + 1).find(isRolled);
    if (!prev && !next) return null;
    if (prev && next && prev.initiative !== next.initiative) return new Map([[dragged, (prev.initiative + next.initiative) / 2]]);
    if (!prev) return new Map([[dragged, next.initiative + dir]]);
    if (!next) return new Map([[dragged, prev.initiative - dir]]);

    const tie = prev.initiative;
    let start = index;
    while (start > 0 && order[start - 1].initiative === tie) start--;
    let end = index;
    while (end < order.length - 1 && order[end + 1].initiative === tie) end++;
    const run = order.slice(start, end + 1);
    const upper = order.slice(0, start).reverse().find(isRolled)?.initiative;
    const lower = order.slice(end + 1).find(isRolled)?.initiative;
    if (upper === undefined && lower === undefined) return spread(run, tie + dir, undefined, dir);
    return spread(run, upper, lower, dir);
}

export function getReorderUpdates(combat, order, dragged) {
    const dir = sortDirection(combat);
    let values = candidateValues(order, dragged, dir);
    if (!values || !matchesOrder(combat, order, values)) {
        values = new Map(order.map((c, i) => [c, dir > 0 ? order.length - i : i + 1]));
    }
    const updates = [];
    for (const [combatant, initiative] of values) {
        if (combatant.initiative !== initiative) updates.push({ _id: combatant.id, initiative });
    }
    const current = combat.combatant;
    const combatTurn = combat.turn !== null && current ? order.indexOf(current) : undefined;
    return { updates, combatTurn: combatTurn === -1 ? undefined : combatTurn };
}
