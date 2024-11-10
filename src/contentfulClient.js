import * as contentful from 'contentful'

const host = import.meta.env.MODE === 'development' ? 'preview.contentful.com' : 'cdn.contentful.com';

export const client = contentful.createClient({
    space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
    accessToken: import.meta.env.VITE_CONTENTFUL_API_TOKEN,
    host: host
});
