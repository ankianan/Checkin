

let workArea = null;

export const getWorkArea = () => {
    workArea = document.createElement('div');
    document.body.appendChild(workArea);
    return workArea;

}

export const unload = () => {
    workArea.parentNode.removeChild(workArea);
};

const loop = (testCallback, count = 0)=>(resolve, reject)=>{
    try{
        if(count<5){
            testCallback();
            resolve();
        }
    }catch (e) {
        if(count ==5){
            reject();
        }
        setTimeout(()=>loop(testCallback, count + 1)(resolve, reject), 250);
    }
}

export const eventually = (testCallback) => new Promise((resolve, reject)=>loop(testCallback)(resolve,reject))