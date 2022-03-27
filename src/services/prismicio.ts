import * as prismic from '@prismicio/client';

export function getPrismicClient(ref?: unknown){
    const client = prismic.createClient( process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        ref: ref,
    })

    return client;
}