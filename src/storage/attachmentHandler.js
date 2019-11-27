import * as blockstack from 'blockstack';

const getStorageDetail = (fileName)=>({
    fileName,
    options : {
        encrypt: false,
        decrypt: false
    }
});

// Ref: https://stackoverflow.com/questions/10683192/how-to-get-the-filename-from-input-type-file-html-element-using-javascript-or-jq/39968450
const getFileName = (event)=>{
    return event.target.value.split('/').pop().split('\\').pop();
}

function readFile(event) {
    return new Promise(resolve=>{
        var file    = event.target.files[0];
        var reader  = new FileReader();

        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    })

}

export const upload = async (event) => {
    const storage = getStorageDetail(getFileName(event));
    const content = await readFile(event);
    await blockstack.putFile(storage.fileName, content, storage.options);
    return storage.fileName;
};

export const getFile = async (fileName) => {
    const storage = getStorageDetail(fileName);
    return await blockstack.getFile(storage.fileName, storage.options);
}