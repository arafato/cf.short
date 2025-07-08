import { Router } from 'itty-router';
import { HashUrlShortener } from './urlShortener';
import Counter from './counter';

interface Env {
	ENVIRONMENT: string;
	repo: KVNamespace;
	COUNTERS: DurableObjectNamespace<Counter>;
	DB: D1Database;
	userId: string;
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

		const id = env.COUNTERS.idFromName('urlShortener');
		const stub = env.COUNTERS.get(id);
		let counterValue = null;
		counterValue = await stub.getCounterValue() as number;
		await stub.increment();

		data.alias = urlShortener.generateAlias(counterValue);
	}

	await env.repo.put(data.alias, data.fullUrl);

	const session = env.DB.withSession() // synchronous
	// query executes on either primary database or a read replica
	const result = await session
		.prepare(`INSERT INTO "user-url-mapping" (userId, originalUrl, shortenedUrl)
VALUES ('${env.userId}', '${data.fullUrl}', '${data.alias}');`)
		.run()

	return new Response(data.alias, { status: 201 });
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

export default {
	fetch: async (request, env, ctx) => {
		let userEmail = request.headers.get('CF-Access-Authenticated-User-Email');

		// Mock user for local development
		if (!userEmail && env.ENVIRONMENT === 'development') {
			userEmail = 'test@example.com';
			console.log('🔧 Using mock authentication for local development');
		}

		if (!userEmail) {
			return new Response('Authentication required', { status: 401 });
		}

		console.log(`Successfull authentication from user: ${userEmail}`);
		env.userId = userEmail;
		return router.fetch(request, env, ctx)
	}

} satisfies ExportedHandler<Env>;

export { default as Counter } from './counter';