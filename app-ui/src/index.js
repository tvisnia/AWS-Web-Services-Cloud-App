import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid'
import css from './styles/main.css'
import miniCss from "mini.css/dist/mini-nord.css"

import {
    getCurrentUser,
    login,
    register,
    confirmAccount,
    refreshAwsCredentials,
    loadLocalStorageCredentials,
    getAccessToken
} from './account/AccountService';
import { listFiles } from './s3/AwsFilesService';
import { hello } from './commons/greet'
import {
    ConfirmAccountRequestPauload,
    LoginRequestPayload,
    RegisterRequestPayload
} from './account/commons/Const';
import { awsConfig } from './aws_exports';


AWS.config.region = awsConfig.region

const BTN_CLASS = 'button'

getCurrentUser()
    .then(profile => hello(`${profile.email}, nice website: ${profile.website}`))
    .catch(_ => hello('Guest'))
loadLocalStorageCredentials()
    .then(session => refreshAwsCredentials(session))
    .catch(err => console.error('Cannot reload credentials.'))

let photos = []

const uploadToS3 = (userId, file, onProgress) => {
    return new Promise((resolve, reject) => {
        const destKey = `uek-krakow/${userId}/images/${uuid()}/${file.name}`;
        const params = {
            Body: file,
            Bucket: awsConfig.bucketName,
            Key: destKey,
        }

        const s3 = new S3();

        s3.putObject(params, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(destKey);
        }).on('httpUploadProgress', (progress) => {
            const currentProgress = Math.round((progress.loaded / progress.total) * 100);
            onProgress(currentProgress);
            console.log(`current progres is: ${currentProgress}%`);
        })
    });
}

const getPresigendUrl = (key) => {
    const params = {
        Bucket: awsConfig.bucketName,
        Key: key
    }

    const s3 = new S3();

    return s3.getSignedUrl('getObject', params);
}

const addToOrder = (key) => {
    photos.push(key)
    console.log(`current photo list: ${photos}`)
    return key
}

const createElementFromString = (template) => {
    const parent = document.createElement('div');
    parent.innerHTML = template.trim();
    return parent.firstChild;
}

const addToUploadedPreview = (url) => {
    const itemTemplate = `
    <li>
        <img src="${url}" width="200"/>
    </li>`;
    const el = createElementFromString(itemTemplate);
    const uploadedList = document.querySelector('.uploadedPreview');
    uploadedList.appendChild(el);
}

const clearUploadArea = (filesInput, progressBarEl) => {
    progressBarEl.style.width = `0%`;
    progressBarEl.textContent = `0%`;
    filesInput.value = '';
}

const orderAnimation = (token, orderRequest) => {
    return fetch(`${awsConfig.apiBaseUrl}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify(orderRequest)
    })
}

const registerBtn = document.querySelector(`${BTN_CLASS}.register`);
registerBtn.addEventListener('click', () => {
    register(RegisterRequestPayload)
        .then(result => console.log(result))
        .catch((err) => console.log(err))
})

const confirmAccountBtn = document.querySelector(`${BTN_CLASS}.confirmAccount`)
confirmAccountBtn.addEventListener('click', () => {
    confirmAccount(ConfirmAccountRequestPauload)
})

const loginBtn = document.querySelector(`${BTN_CLASS}.login`)
loginBtn.addEventListener('click', () => {
    login(LoginRequestPayload)
        .then(result => refreshAwsCredentials(result))
        .then(result => console.log(`Succesfully logged in ! ${JSON.stringify(result)}`))
        .catch(err => console.error(err))
})

const listFilesBtn = document.querySelector(`${BTN_CLASS}.listFiles`)
listFilesBtn.addEventListener('click', () => {
    listFiles()
        .then(fileList => console.log(fileList))
        .catch(err => console.error(err))
})

const uploadFileBtn = document.querySelector('div.upload .upload__btn');
uploadFileBtn.addEventListener('click', () => {
    const filesInput = document.querySelector('div.upload .upload__input');
    if (!!!filesInput.files.length) {
        console.log('no files were choosen');
        return;
    }

    const progressBarEl = document.querySelector('.upload__progress');

    const toBeUploadedFiles = [...filesInput.files];
    const userId = AWS.config.credentials.identityId;
    toBeUploadedFiles.forEach((file, i) => {
        uploadToS3(userId, file, (currentProgess) => {
            progressBarEl.style.width = `${currentProgess}%`;
            progressBarEl.textContent = `uploading ... ${currentProgess} %`;
        })
            .then(res => addToOrder(res))
            .then(res => getPresigendUrl(res))
            .then(url => addToUploadedPreview(url))
            .finally(() => clearUploadArea(filesInput, progressBarEl))
            ;
    })
});

const orderAnimationButton = document.querySelector(`${BTN_CLASS}.orderAnimation`)
orderAnimationButton.addEventListener('click', () => {
    const orderRequest = {
        email: RegisterRequestPayload.email,
        photos: [...photos]
    }
    getAccessToken()
        .then(token => orderAnimation(token, orderRequest))
        .then(resp => console.log(resp.json()))
        .catch(err => console.log(err))
        ;
});

const cancelOrderBtn = document.querySelector('button.cancelOrder');
cancelOrderBtn.addEventListener('click', () => {
    photos = [];
});