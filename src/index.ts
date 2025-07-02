import { Router } from 'itty-router';
import { HashUrlShortener } from './urlShortener';
import Counter from './counter';

interface Env {
	repo: KVNamespace;
	COUNTERS: DurableObjectNamespace<Counter>;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const router = Router();
router.options('*', () => new Response(null, { headers: corsHeaders }));


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

		const id = env.COUNTERS.idFromName('urlShortener');
		const stub = env.COUNTERS.get(id);
		let counterValue = null;
		counterValue = await stub.getCounterValue() as number;
		await stub.increment();		

		data.alias = urlShortener.generateAlias(counterValue);
    }

    await env.repo.put(data.alias, data.fullUrl);

    return new Response(data.alias, { status: 201, headers: corsHeaders });
});

router.get('/:alias', async (request, env: Env) => {
	const alias = request.params?.alias;
	if (!alias) {
		return new Response('Alias not provided', { status: 400 });
	}
	const url = await env.repo.get(`${alias}`);
	if (url) {
		console.log(`Redirecting to: ${url} based on alias: ${alias}`);
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

export { default as Counter } from './counter';