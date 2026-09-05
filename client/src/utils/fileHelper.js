export const getFileUrl = (url) => {
    if (!url) return '';

    // Fix for Cloudinary PDF delivery: convert image/upload to raw/upload for PDFs so browser PDF viewer loads correctly
    if (typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes('/image/upload/') && url.toLowerCase().includes('.pdf')) {
        url = url.replace('/image/upload/', '/raw/upload/');
    }

    // If it's a localhost URL but we are deployed (not on localhost), rewrite it.
    if (typeof window !== 'undefined' && url.includes('localhost') && window.location.hostname !== 'localhost') {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';

        let targetBaseUrl = window.location.origin;
        if (apiUrl.startsWith('http') && !apiUrl.includes('localhost')) {
            targetBaseUrl = apiUrl.replace(/\/api\/?$/, '');
        }

        try {
            const urlObj = new URL(url);
            url = `${targetBaseUrl}${urlObj.pathname}${urlObj.search}`;
        } catch (e) {
            // Fallback replace
            url = url.replace(/http:\/\/localhost:\d+/, targetBaseUrl);
        }
    }

    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;

    // Fallback for relative URLs
    let apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
        apiUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
            ? '/api'
            : 'http://localhost:5000/api';
    }

    // If apiUrl is just '/api', the baseUrl is just '' (relative root) or window.location.origin
    let baseUrl = '';
    if (apiUrl.startsWith('http')) {
        baseUrl = apiUrl.replace(/\/api\/?$/, '');
    }

    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
