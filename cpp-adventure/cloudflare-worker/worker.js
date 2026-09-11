/* ============ 梓煜学习空间站 · 学习进度云同步 Worker ============
 * 部署在 Cloudflare Workers，配合 KV 存储。
 * 作用：把孩子的学习进度（localStorage 全部学习数据）备份到云端，
 *       换设备 / 清缓存 / 多设备共享都不丢数据。
 *
 * 需要在 Cloudflare Dashboard 绑定一个 KV namespace，绑定名固定为 SYNC_KV：
 *   创建：Workers & Pages → KV → Create a namespace → 命名 sync_studyc
 *   绑定：进入本 Worker → Settings → Variables → KV namespace bindings
 *         → Add binding → Variable name 填 SYNC_KV，选 sync_studyc → Save
 *
 * API 说明（网页前端自动调用，无需手工操作）：
 *   GET  /api/sync?user=xxx&token=yyy
 *        拉取某用户云端存档。云端无数据时返回 { ok:true, exists:false }
 *   POST /api/sync   body: { user, token, data }
 *        保存某用户云端存档。同一个 user+token 才能覆盖过去的数据。
 *   GET  /api/ping   健康检查
 */
export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const cors = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			"Cache-Control": "no-store"
		};
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: cors });
		}
		const json = (obj, status) => new Response(JSON.stringify(obj), {
			status: status || 200,
			headers: { "Content-Type": "application/json; charset=utf-8", ...cors }
		});

		/* 健康检查 */
		if (url.pathname === "/api/ping") {
			return json({ ok: true, name: "studyc-sync", t: Date.now() });
		}

		/* ---- 拉取云端存档 ---- */
		if (url.pathname === "/api/sync" && request.method === "GET") {
			const user = (url.searchParams.get("user") || "").trim();
			const token = (url.searchParams.get("token") || "").trim();
			if (!user || !token) return json({ ok: false, msg: "缺少 user/token" }, 400);
			if (user.length > 60 || token.length > 200) return json({ ok: false, msg: "参数过长" }, 400);

			try {
				const stored = await env.SYNC_KV.get("sync:" + user, "json");
			if (!stored) return json({ ok: true, exists: false });
			if (stored.token !== token) return json({ ok: false, msg: "密码不对" }, 403);
			return json({ ok: true, exists: true, updatedAt: stored.updatedAt, data: stored.data });
			} catch (e) {
				return json({ ok: false, msg: "服务异常" }, 500);
			}
		}

		/* ---- 保存云端存档 ---- */
		if (url.pathname === "/api/sync" && request.method === "POST") {
			let body;
			try { body = await request.json(); } catch (e) { return json({ ok: false, msg: "请求不是合法JSON" }, 400); }
			const user = (body.user || "").trim();
			const token = (body.token || "").trim();
			if (!user || !token) return json({ ok: false, msg: "缺少 user/token" }, 400);
			if (!body.data || typeof body.data !== "object") return json({ ok: false, msg: "缺少 data" }, 400);
			if (user.length > 60 || token.length > 200) return json({ ok: false, msg: "参数过长" }, 400);

			const key = "sync:" + user;
			try {
				const stored = await env.SYNC_KV.get(key, "json");
				if (stored && stored.token !== token) return json({ ok: false, msg: "密码不对" }, 403);
				const now = Date.now();
				await env.SYNC_KV.put(key, JSON.stringify({ token: token, updatedAt: now, data: body.data }));
				return json({ ok: true, updatedAt: now });
			} catch (e) {
				return json({ ok: false, msg: "保存失败" }, 500);
			}
		}

		return json({ ok: false, msg: "404 Not Found" }, 404);
	}
};