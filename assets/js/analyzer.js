/**
 * Analyzes a given text using an AI model and returns a structured HTML report.
 * @param {string} text The text to be analyzed.
 * @returns {Promise<string>} A promise that resolves to an HTML string with the analysis.
 */
export async function analyzeText(text) {
    try {
        const completion = await websim.chat.completions.create({
            messages: [{
                role: 'system',
                content: `You are a professional text analysis AI.
Your task is to provide a comprehensive analysis of the user's text.
Structure your response in clean HTML format.
- Use <h3> for section titles (e.g., Summary, Key Points, Sentiment Analysis).
- Use <p> for paragraphs.
- Use <ul> and <li> for bullet points.
- Be thorough, professional, and insightful.
- Do not include <html>, <head>, or <body> tags.`,
            }, {
                role: 'user',
                content: `Please analyze the following text:\n\n---\n\n${text}`,
            }, ],
        });

        return completion.content;
    } catch (error) {
        console.error('Error in text analysis:', error);
        throw new Error('Failed to analyze the text.');
    }
}

