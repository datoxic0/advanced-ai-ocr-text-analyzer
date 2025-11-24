import { extractTextFromImage } from './ocr.js';
import { analyzeText } from './analyzer.js';

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const imageDropZone = document.getElementById('image-drop-zone');
    const imagePreview = document.getElementById('image-preview');
    const dropZoneText = imageDropZone.querySelector('p');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loader = document.getElementById('loader');
    const resultsContainer = document.getElementById('results');
    const ocrOutput = document.getElementById('ocr-output');
    const analysisOutput = document.getElementById('analysis-output');

    let imageDataURL = null;
    const analysisCache = new Map(); // In-session cache for results

    // --- Event Listeners ---

    // Trigger file input click on drop zone click
    imageDropZone.addEventListener('click', () => imageInput.click());

    // Handle file selection
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // --- Drag and Drop ---
    imageDropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        imageDropZone.classList.add('dragover');
    });

    imageDropZone.addEventListener('dragleave', () => {
        imageDropZone.classList.remove('dragover');
    });

    imageDropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        imageDropZone.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // --- Analyze Button ---
    analyzeBtn.addEventListener('click', async () => {
        if (!imageDataURL) {
            alert('Please select an image first.');
            return;
        }

        // Check cache first for performance optimization
        if (analysisCache.has(imageDataURL)) {
            const cachedResult = analysisCache.get(imageDataURL);
            ocrOutput.textContent = cachedResult.extractedText;
            analysisOutput.innerHTML = cachedResult.analysisResult;
            console.log('Loaded analysis from session cache.');
            // Ensure results are visible
            loader.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            return;
        }

        setLoadingState(true);

        try {
            const extractedText = await extractTextFromImage(imageDataURL);
            ocrOutput.textContent = extractedText || 'No text could be extracted from the image.';
            
            let analysisResult;
            if (extractedText) {
                analysisResult = await analyzeText(extractedText);
                analysisOutput.innerHTML = analysisResult;
            } else {
                analysisResult = '<p>Analysis cannot be performed as no text was extracted.</p>';
                analysisOutput.innerHTML = analysisResult;
            }

            // Store the successful result in the cache
            analysisCache.set(imageDataURL, { extractedText, analysisResult });

        } catch (error) {
            console.error('An error occurred during analysis:', error);
            ocrOutput.textContent = 'An error occurred during text extraction.';
            analysisOutput.innerHTML = `<p>An error occurred during analysis: ${error.message}</p>`;
        } finally {
            setLoadingState(false);
        }
    });


    // --- Helper Functions ---

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imageDataURL = e.target.result;
            imagePreview.src = imageDataURL;
            imagePreview.classList.remove('hidden');
            dropZoneText.classList.add('hidden');
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            loader.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            analyzeBtn.disabled = true;
        } else {
            loader.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            analyzeBtn.disabled = false;
        }
    }
});