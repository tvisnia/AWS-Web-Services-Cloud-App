const createElementFromString = (template) => {
    const parent = document.createElement('div');
    parent.innerHTML = template.trim();
    return parent.firstChild;
}

export const addToUploadedPreview = (url) => {
    const itemTemplate = `
    <li>
        <img src="${url}" width="200"/>
    </li>`;
    const el = createElementFromString(itemTemplate);
    const uploadedList = document.querySelector('.uploadedPreview');
    uploadedList.appendChild(el);
}

export const clearUploadArea = (filesInput, progressBarEl) => {
    progressBarEl.style.width = `0%`;
    progressBarEl.textContent = `0%`;
    filesInput.value = '';
}