import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';


export function getPrismicClient(req?: unknown, previewData?: any){
    const client = prismic.createClient( process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        
    }, )

    enableAutoPreviews({
        client,
        previewData,
        req,
      })

    return client;
}