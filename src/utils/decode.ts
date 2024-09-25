export const decodeAndParseJSON = (base64String: string) => {
    try {
        const decodedString = atob(base64String.split(',')[1]);
        return JSON.parse(decodedString);
    } catch (error) {
        console.error('Error decoding or parsing JSON:', error);
        return null;
    }
};