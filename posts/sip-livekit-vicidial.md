# When LiveKit Meets VICIDIAL: Bridging Modern Voice AI to Legacy Telephony

Most tutorials on voice AI stop at "connect your agent to Twilio." That works if your client can afford Twilio and their compliance team is fine with cloud routing. Real call centers, especially in India, often run on Asterisk, FreePBX, or VICIDIAL stacks that were configured years ago and cannot be ripped out over a weekend.

I got thrown into this problem early. The goal was simple: production AI voice agents handling inbound qualification and outbound follow-ups, connected to a cheaper local SIP provider instead of Twilio. The path was not simple.

## The mismatch

LiveKit Agents expect a clean WebRTC or SIP path with predictable auth. Legacy VICIDIAL deployments expect user/password SIP registration, static trunk configs, and RTP paths that break the moment NAT gets involved. LiveKit's IPs are dynamic. VICIDIAL's admins do not want dynamic anything.

There was no SDK for this. No "integrate with VICIDIAL" button in the docs.

## What actually worked

The integration that shipped was user/password SIP auth on a bridge layer, not trying to force IP-based trunking where the legacy side could not support it. That meant:

1. **Understanding SIP auth at the packet level**: not just config copy-paste from a forum post.
2. **Routing design**: inbound vs outbound paths, where Asterisk sits as middleware, when to hand off to LiveKit vs stay on PSTN.
3. **Provider quirks**: each local SIP trunk has failure modes that only show up under load.
4. **Compliance**: telephony regulation is not optional; "we'll fix it in prod" is not a plan.

The result: agents handling **500–600 calls per day** for a single client on production SIP infrastructure.

## Lessons I'd repeat

**Diagnose the layer, not the symptom.** "Calls drop" might be RTP, NAT, codec negotiation, or auth expiry, not "the AI is bad."

**Legacy is a feature, not a bug.** If your client's ops team only knows FreePBX, your integration has to speak FreePBX.

**The dirty work is the moat.** Everyone wants to demo voice agents. Almost nobody wants to own SIP packet traces at 2 AM.

If you're building voice AI for markets outside the Twilio bubble, the telephony layer is not a weekend side quest. It's the product.
