import { Router } from 'itty-router';
import { HashUrlShortener } from './urlShortener';

interface Env {
	'repo': KVNamespace;
}

const router = Router();

router.post('/api/create', async (request: Request, env: Env) => {
    let data: { 
		fullUrl?: string, 
		alias?: string 
	};

    try {
        data = await request.json();
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

	if (!data.fullUrl) {//
        return new Response('Missing "fullUrl" in request body', { status: 400 });
    }

    if (!data.alias) {//
        const urlShortener = new HashUrlShortener();
		data.alias = urlShortener.generateAlias(data.fullUrl);
    }

    await env.repo.put(data.alias, data.fullUrl);

    return new Response(data.alias, { status: 201 });
});

router.get('/:alias', async (request, env: Env) => {
	const alias = request.params?.alias;
	if (!alias) {
		return new Response('Alias not provided', { status: 400 });
	}
	const url = await env.repo.get(`${alias}`);
	if (url) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: url
			}
		});
	} else {
		return new Response('URL not found', { status: 404 });
	}
});

router.all('*', () => new Response('Welcome to CF-Short. A simple URL shortener based on Cloudflare.', { status: 404 }));
 
export default {
	fetch: (request, env, ctx) => router.fetch(request, env, ctx),
} satisfies ExportedHandler<Env>;