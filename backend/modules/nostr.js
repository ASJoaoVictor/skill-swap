// backend/modules/nostr.js
import { generateSecretKey, getPublicKey, finalizeEvent, nip44 } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { SimplePool } from "nostr-tools/pool";

const RELAYS = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net"];
const pool = new SimplePool();

export function generateNostrIdentity() {
  const sk = generateSecretKey();
  return { pubkey: getPublicKey(sk), privkeyHex: bytesToHex(sk) };
}

function wrap(rumor, recipientPubkey, senderPrivkeyBytes, senderPubkeyBytes) {
  const sharedKey = nip44.v2.utils.getConversationKey(
    senderPrivkeyBytes,
    recipientPubkey
  );

  const seal = finalizeEvent(
    {
      kind: 13,
      created_at: Math.round(Date.now() / 1000),
      tags: [],
      content: nip44.v2.encrypt(
        JSON.stringify(rumor),
        sharedKey
      ),
    },
    senderPrivkeyBytes
  );

  const randomSk = generateSecretKey();

  const wrapKey = nip44.v2.utils.getConversationKey(
    randomSk,
    recipientPubkey
  );

  return finalizeEvent(
    {
      kind: 1059,
      created_at: Math.round(Date.now() / 1000),
      tags: [["p", recipientPubkey]],
      content: nip44.v2.encrypt(
        JSON.stringify(seal),
        wrapKey
      ),
    },
    randomSk
  );
}

function unwrapGiftWrap(giftWrapEvent, recipientPrivkeyBytes) {
  try {
    const wrapKey = nip44.v2.utils.getConversationKey(
      recipientPrivkeyBytes,
      giftWrapEvent.pubkey
    );
    const seal = JSON.parse(nip44.v2.decrypt(giftWrapEvent.content, wrapKey));

    const sealKey = nip44.v2.utils.getConversationKey(
      recipientPrivkeyBytes,
      seal.pubkey
    );
    const rumor = JSON.parse(nip44.v2.decrypt(seal.content, sealKey));

    return rumor;
  } catch (err) {
    return null;
  }
}

// Assina os relays em tempo real: toda vez que chega um gift wrap
// endereçado a este usuário, decripta e chama onMessage com o rumor.
// Retorna um objeto com .close() pra encerrar a assinatura.
export function subscribeToDirectMessages({ userPrivkeyHex, userPubkey, onMessage }) {
  const userPrivkeyBytes = hexToBytes(userPrivkeyHex);
  const since = Math.floor(Date.now() / 1000) - 2;

  console.log("[nostr] abrindo subscription pra pubkey:", userPubkey, "relays:", RELAYS);

  const sub = pool.subscribeMany(
    RELAYS,
    [{ kinds: [1059], "#p": [userPubkey], since }],
    {
      onevent(event) {
        console.log("[nostr] onevent disparado, event id:", event.id);
        const rumor = unwrapGiftWrap(event, userPrivkeyBytes);
        if (!rumor || rumor.kind !== 14) {
          console.log("[nostr] rumor inválido ou não é kind 14, descartando");
          return;
        }
        onMessage(rumor, event);
      },
      oneose() {
        console.log("[nostr] EOSE recebido (fim do histórico inicial)");
      },
      onclose(reasons) {
        console.log("[nostr] subscription fechada:", reasons);
      }
    }
  );

  return sub;
}

export async function sendDirectMessage({
  senderPrivkeyHex,
  senderPubkey,
  recipientPubkey,
  content
}) {
  const senderPrivkeyBytes = hexToBytes(senderPrivkeyHex);
  const senderPubkeyBytes = hexToBytes(senderPubkey);

  const rumor = {
    pubkey: senderPubkey,
    created_at: Math.round(Date.now() / 1000),
    kind: 14,
    tags: [["p", recipientPubkey]],
    content
  };

  const eventForRecipient = wrap(
    rumor,
    recipientPubkey,
    senderPrivkeyBytes,
    senderPubkeyBytes
  );

  const eventForSender = wrap(
    rumor,
    senderPubkey,
    senderPrivkeyBytes,
    senderPubkeyBytes
  );

  const resultsRecipient = await Promise.allSettled(pool.publish(RELAYS, eventForRecipient));
  console.log("[nostr] publish eventForRecipient:", resultsRecipient.map((r, i) => `${RELAYS[i]}: ${r.status}${r.reason ? " - " + r.reason : ""}`));

  const resultsSender = await Promise.allSettled(pool.publish(RELAYS, eventForSender));
  console.log("[nostr] publish eventForSender:", resultsSender.map((r, i) => `${RELAYS[i]}: ${r.status}${r.reason ? " - " + r.reason : ""}`));

  return eventForRecipient;
}

// Publica uma nota de texto pública (kind 1), equivalente ao
// EventBuilder.text_note(...) + client.send_event_builder(...) do nostr_sdk (Python).
export async function publishTextNote({ privkeyHex, content }) {
  const privkeyBytes = hexToBytes(privkeyHex);

  const event = finalizeEvent(
    {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content,
    },
    privkeyBytes
  );

  const results = await Promise.allSettled(pool.publish(RELAYS, event));
  console.log("[nostr] publish textNote:", results.map((r, i) => `${RELAYS[i]}: ${r.status}${r.reason ? " - " + r.reason : ""}`));

  return event;
}

// backend/modules/nostr.js (adicionar essa função)

// Assina notas de texto públicas (kind 1) de um autor específico.
// Equivalente ao Filter().author(pubkey).limit(5) + client.handle_notifications(...) do nostr_sdk (Python).
export function subscribeToTextNotes({ authorPubkey, limit = 5, onEvent }) {
  console.log("[nostr] abrindo subscription de notas (kind 1) do autor:", authorPubkey);

  const sub = pool.subscribeMany(
    RELAYS,
    [{ kinds: [1], authors: [authorPubkey], limit }],
    {
      onevent(event) {
        console.log("\nNOVO EVENTO!");
        console.log("ID:", event.id);
        console.log("Autor (Hex):", event.pubkey);
        console.log("Conteúdo:", event.content);
        console.log("Timestamp:", event.created_at);

        onEvent?.(event);
      },
      oneose() {
        console.log("[nostr] EOSE recebido (fim do histórico inicial)");
      },
      onclose(reasons) {
        console.log("[nostr] subscription fechada:", reasons);
      }
    }
  );

  return sub;
}