/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { randomBytes } from "node:crypto"

export default {
	async fetch(request: Request) {

		// sample for calling a node library
		randomBytes(256, (err, buffer) => {
			const token = buffer.toString("hex");
			if (err) throw err;
			console.log(token);
		});

		class AttributeRewriter {
			attributeName: string;

			constructor(attributeName: string) {
				this.attributeName = attributeName;
			}
			element(element: HTMLElement) {
				const attribute = element.getAttribute(this.attributeName);
				if (attribute && attribute.startsWith("/")) {
					element.setAttribute(this.attributeName, "/home" + attribute);
				}
			}
		}

		const urlFormatted = `https://web.bankee.online/${request.url.split("/home")[1]}`;

		const response = await fetch(urlFormatted, {
			cf: { cacheTtl: 3600 },
			redirect: "follow", // default behaviour
			method: request.method,
		});

		const rewriter = new HTMLRewriter().on(
			"a",
			new AttributeRewriter("href")
		);

		return rewriter.transform(response);
	},
};

