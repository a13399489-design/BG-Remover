function handleImageUpload() {
    const file = imageInput.files[0];
    if (!file) return;

    // ✅ Get your Remove.bg API key from browser storage
    const apiKey = localStorage.getItem('removeBgApiKey');

    if (!apiKey) {
        alert('Please set your Remove.bg API key first.\nOpen browser console and paste:\nlocalStorage.setItem("removeBgApiKey", "43VHSyGF4sC31mUXsBNFcv9r")');
        return;
    }

    // Check if file is an image
    if (!file.type.match('image.*')) {
        alert('Please upload an image file (JPG, PNG, WebP)');
        return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
    }

    // Hide upload area and show processing animation
    uploadArea.classList.add('hidden');
    processing.classList.remove('hidden');

    // Prepare data for Remove.bg API
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    // ✅ Call Remove.bg API
    fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Remove.bg API request failed');
        return response.blob();
    })
    .then(blob => {
        // Show original and processed image previews
        originalImg.src = URL.createObjectURL(file);
        processedImg.src = URL.createObjectURL(blob);

        processing.classList.add('hidden');
        imagePreview.classList.remove('hidden');
        actionButtons.classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Background removal failed. Please check your API key or try again.');
        resetTool();
    });
}
