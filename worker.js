import { onRequestPost } from "./functions/api/quote.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.png") {
      const faviconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABcklEQVR42u3dwW3CQBgFYXjKKc1QRmqmjDTD1WkgQiG2ebv2N0ckzO6MVv4thLguy7JcUCMUCCAABBAAAggAAQSYicf9dnncb1MHuM76JPyb+M+vbyegJf/Z6wK8Qf6sEXIk+TNGmOIesEbo6PeFHFn+DKchR5Y/Q4QcXf7oEXIG+SNHyFnkjxohZ5I/YoQhxtCmkPaYmjPLH+Hzc+bNj7COnF1+ez0hv7uukN9dX8jvrvMtY+jMXxvuPaaG/O76Q353HyG/u5+Q391XyO/ub7Mp6Oji95qQQn533yG/u/+Q340Q8rsRQn43QsjvRvjzGEr8PmNqyO+ehpDfjRDyuxGy96M2nnvMmjdj/Y04/7mIKNt5yqsXJ39bT9nyOOF1T34pX0aAMh9HOcqzPlA6AQIIAAEEgAACQAABIIAAEEAACCAABBAAAggAAQSAAAJAAAEggADYkKv/E3YCBIAAAkAAASCAABBAAAggAAQQAAIcnh9V27V/74st9QAAAABJRU5ErkJggg==";
      const faviconBytes = Uint8Array.from(atob(faviconBase64), (char) => char.charCodeAt(0));
      return new Response(faviconBytes, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/api/quote") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed." }), {
          status: 405,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "Allow": "POST"
          }
        });
      }

      return onRequestPost({ request, env, waitUntil: (promise) => ctx.waitUntil(promise) });
    }

    return env.ASSETS.fetch(request);
  }
};
