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

  const sub = pool.subscribeMany(
    RELAYS,
    [{ kinds: [1059], "#p": [userPubkey], since }],
    {
      onevent(event) {
        const rumor = unwrapGiftWrap(event, userPrivkeyBytes);
        if (!rumor || rumor.kind !== 14) return;
        onMessage(rumor, event);
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

  await pool.publish(RELAYS, eventForRecipient);
  await pool.publish(RELAYS, eventForSender);

  return eventForRecipient;
}