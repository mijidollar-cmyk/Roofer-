const ALLOWED_ROOF_TYPES = new Set([
  "Shingle",
  "Tile",
  "Metal",
  "Flat",
  "Other / Not sure"
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function clean(value, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function onRequestPost({ request, env }) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ error: "Invalid request format." }, 415);
    }

    const body = await request.json();

    // Honeypot: silently accept bot submissions without sending email.
    if (clean(body.website, 200)) {
      return json({ success: true, message: "Request received." });
    }

    const name = clean(body.name, 100);
    const phone = clean(body.phone, 25);
    const zip = clean(body.zip, 5);
    const roofType = clean(body.roofType, 40);
    const message = clean(body.message, 2000);

    if (name.length < 2) {
      return json({ error: "Please enter your full name." }, 400);
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return json({ error: "Please enter a valid phone number." }, 400);
    }

    if (!/^\d{5}$/.test(zip)) {
      return json({ error: "Please enter a valid 5-digit ZIP code." }, 400);
    }

    if (!ALLOWED_ROOF_TYPES.has(roofType)) {
      return json({ error: "Please select a roof type." }, 400);
    }

    if (message.length > 2000) {
      return json({ error: "Your message is too long." }, 400);
    }

    if (!env.RESEND_API_KEY || !env.QUOTE_EMAIL || !env.EMAIL_FROM) {
      console.error("Quote form is missing required email configuration.");
      return json({ error: "The quote form is temporarily unavailable." }, 503);
    }

    const subject = `New Roofing Quote Request — ${name} — ${zip}`;
    const safeMessage = escapeHtml(message || "No additional message provided.").replaceAll("\n", "<br>");

    const html = `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#17283a;line-height:1.5">
<h2 style="color:#062440">New Roofing Quote Request</h2>
<table cellpadding="8" cellspacing="0" border="0">
<tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
<tr><td><strong>Phone</strong></td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
<tr><td><strong>ZIP</strong></td><td>${escapeHtml(zip)}</td></tr>
<tr><td><strong>Roof Type</strong></td><td>${escapeHtml(roofType)}</td></tr>
</table>
<h3>Message</h3>
<p>${safeMessage}</p>
<hr>
<p style="font-size:12px;color:#667085">Submitted through roofer.pennycedis.workers.dev</p>
</body></html>`;

    const text = [
      "NEW ROOFING QUOTE REQUEST",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `ZIP: ${zip}`,
      `Roof Type: ${roofType}`,
      "",
      "Message:",
      message || "No additional message provided."
    ].join("\n");

    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [env.QUOTE_EMAIL],
        subject,
        text,
        html
      })
    });

    if (!resend.ok) {
      const errorBody = await resend.text();
      console.error("Resend API error", resend.status, errorBody);
      return json({ error: "We couldn't send your request right now. Please call us directly." }, 502);
    }

    return json({ success: true, message: "Quote request sent successfully." });
  } catch (error) {
    console.error("Quote form error", error);
    return json({ error: "Something went wrong. Please try again or call us directly." }, 500);
  }
}
