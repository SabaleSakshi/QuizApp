// Configuration file for API settings
const CONFIG = {
    API_KEY: 'w6z8v5wEWQg8z1D2IFBw7MOhjmIZl77HRbZb5FhK',
    BASE_URL: 'https://quizapi.io/api/v1/questions',
    QUIZ_SETTINGS: {
        category: 'sql',
        limit: 10,
        tags: 'MySQL'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
