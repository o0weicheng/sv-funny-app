export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.MReyPO0P.js",app:"_app/immutable/entry/app.KBmbkTRJ.js",imports:["_app/immutable/entry/start.MReyPO0P.js","_app/immutable/chunks/BHTpMYJM.js","_app/immutable/chunks/CFKaDxmJ.js","_app/immutable/chunks/DfEIorZr.js","_app/immutable/chunks/D9p1muqs.js","_app/immutable/entry/app.KBmbkTRJ.js","_app/immutable/chunks/CFKaDxmJ.js","_app/immutable/chunks/CF3NZL59.js","_app/immutable/chunks/D9p1muqs.js","_app/immutable/chunks/B13rmRP9.js","_app/immutable/chunks/CHSpxC3Z.js","_app/immutable/chunks/DZaH9DIF.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/draggable",
				pattern: /^\/draggable\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/tracingLight",
				pattern: /^\/tracingLight\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
