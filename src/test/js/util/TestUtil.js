

let workArea = null;

export const getWorkArea = () => {
    workArea = document.createElement('div');
    document.body.appendChild(workArea);
    return workArea;

}

export const unload = () => {
    workArea.parentNode.removeChild(workArea);
}