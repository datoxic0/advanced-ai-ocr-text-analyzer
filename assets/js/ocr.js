/**
 * Extracts text from an image using an AI model.
 * @param {string} imageDataUrl The base64 encoded data URL of the image.
 * @returns {Promise<string>} A promise that resolves to the extracted text.
 */
export async function extractTextFromImage(imageDataUrl) {
    try {
        const completion = await websim.chat.completions.create({
            messages: [{
                role: 'user',
                content: [{
                    type: 'text',
                    text: `You are an expert OCR (Optical Character Recognition) engine.
Your task is to extract all text from the provided image, even if it is blurry, distorted, or handwritten.
Provide only the raw, extracted text and nothing else. Do not add any commentary or formatting like code blocks.`,
                }, {
                    type: 'image_url',
                    image_url: { url: imageDataUrl },
                }, ],
            }, ],
        });

        return completion.content;
    } catch (error) {
        console.error('Error in OCR extraction:', error);
        throw new Error('Failed to extract text from the image.');
    }
}

