<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Landing page sections live in `src/components/landing/` and are composed in `src/routes/index.tsx`; keeps the route file small.
- Demo AI lives server-side in `src/lib/ia/*.server.ts`, exposed via `src/lib/ia.functions.ts`; business rules in `src/lib/demo/logica.ts` are re-checked after every AI proposal so the AI can never register an invalid change.
- Inspection output is checked in `src/lib/demo/inspeccion.ts` before display; clarification rounds retain the original evidence, and vehicle status changes require explicit approval to keep uncertain AI output from changing fleet availability.
- Demo vehicle registration uses shared in-memory fleet state and explicit unverified document flags; OCR must read the plate from the file and match it before updating any document, so selected input never substitutes for document evidence.
- Effects must use a block body (`useEffect(() => { ... })`); recent Chromium returns Promises from scroll APIs, which React would call as a cleanup and crash.
