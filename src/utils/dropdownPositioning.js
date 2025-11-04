// Method for finding the <td> anchor and positioning dropdown near it (accepts either event or td)
export function setupDropdownPositioning(source, setPos, setAnchor) {
    let td;

    // Case 1: user clicked -> we got an event
    if (source?.currentTarget) {
        // The little button (3 dots) that was clicked
        const trigger = source.currentTarget;
        // Find the nearest <td> (table cell) that contains the button.
        td = trigger.closest("td");
        if (!td) return;
    }
    // Case 2: called from recalcDropdown -> we pass the saved td directly
    else if (source instanceof HTMLElement) {
        td = source;
    }

    if (!td) return; // safety: if no cell found, stop.

    // Save the td as anchor for future recalcs
    setAnchor(td);

    // Get the box info of the <td> (its size + where it sits on screen).
    const tdRect = td.getBoundingClientRect();

    // known width to avoid jumps
    const dropdownWidth = 215;
    // Place dropdown 1.5x below the td (like CSS top:150%).
    let top = tdRect.top + tdRect.height * 1.5;
    // Place dropdown a bit to the left of td’s right edge
    let left = tdRect.left + tdRect.width * 0.7 - dropdownWidth;

    // Clamp values so dropdown doesn’t fly outside screen
    left = Math.max(8, Math.min(left, window.innerWidth - dropdownWidth - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - 40));

    // Set the position
    setPos({ top, left });
}