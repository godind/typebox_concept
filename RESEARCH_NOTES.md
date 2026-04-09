This TS/JS-compatible library is intended for over-the-wire JSON validation.
Both client and server can use it, but for different reasons.

## Server-side validation (always needed)

1. Input cannot be trusted because data comes from the network.
2. It is a security boundary that rejects malformed, malicious, or unexpected payloads.
3. It is non-negotiable regardless of client behavior.

## Client-side validation (different purpose)

1. It is not a security boundary.
2. It improves developer experience and UI safety.
3. It catches server regressions early.
4. It detects schema drift between client and server versions.
5. It surfaces meaningful typed errors instead of silent runtime failures.
6. It increases confidence that the app is operating on expected shapes.

## How this improves development experience

1. Faster integration work because producers, server, and client apps share the same schema contract.
2. Less time spent reverse-engineering payload shapes.
3. Better editor support in TypeScript through type inference and autocomplete.
4. Continued JS compatibility through runtime validation without requiring TypeScript.
5. Earlier and clearer failures because invalid messages fail near where they are produced or consumed.
6. Easier diagnosis than downstream UI or runtime crashes.
7. Safer refactors because contract changes are visible across producer, server, and consumer code paths.
8. Less accidental schema drift during feature updates.
9. More reliable onboarding and handoffs because new developers can rely on a single validation package as the source of truth.
10. Documentation and examples stay aligned with real runtime behavior.

## Why sharing the same library is useful

1. One source of truth for data contracts.
2. Reduced schema drift risk.
3. Compile-time and runtime contract consistency across both sides.

## When it might be overkill

1. Simple pass-through services that do not inspect the payload.
2. Trusted internal links where validation cost clearly outweighs value.
3. Non-JSON flows where schema validation is not relevant.

## Signal K ecosystem use cases

In Signal K, there are usually three data roles:

1. Producers: instruments, sensors, gateways, and device adapters that publish data.
2. Server: the Signal K server that ingests, normalizes, and re-publishes stream data.
3. Consumers: dashboard apps, charting apps, automation UIs, and analytics clients.

The same validation library can serve all three roles:

1. Producer-side use case: validate outgoing messages before sending them to the server.
2. Producer-side use case: catch mapping, unit, and shape errors early at the edge device or adapter layer.
3. Server-side use case: validate inbound producer payloads at the trust boundary.
4. Server-side use case: reject malformed or incompatible updates before they contaminate downstream streams.
5. Consumer-side use case: validate incoming stream frames before UI rendering.
6. Consumer-side use case: protect client apps from server or plugin regressions and schema drift.

This creates a shared contract across producer, server, and consumer code while still allowing each side to enforce policies appropriate to its role.

## What still need refinement
- Handling of malformed payloads: skipping is better because this layer should be resilient, incremental, and fail-open. Throwing would make one malformed fragment capable of invalidating an otherwise useful message, which is the wrong behavior for a streaming transport parser. See if we optionally count or report them through logging, metrics, or a side-channel later so that they can be monitored without disrupting the main processing flow.