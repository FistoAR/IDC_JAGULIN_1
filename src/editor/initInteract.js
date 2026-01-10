import interact from "interactjs";

export function initInteract(setObjects) {
  // prevent duplicate bindings (important for Vite HMR)
  interact(".draggable").unset();

  interact(".draggable").draggable({
    listeners: {
      move(event) {
        const id = event.target.dataset.id;

        setObjects(prev =>
          prev.map(obj =>
            obj.id === id
              ? { ...obj, x: obj.x + event.dx, y: obj.y + event.dy }
              : obj
          )
        );
      }
    }
  });
}
