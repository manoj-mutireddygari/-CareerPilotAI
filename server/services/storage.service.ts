import { firestore } from '../lib/firebaseAdmin';

const memoryStore = new Map<string, unknown[]>();

function removeUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, removeUndefined(entryValue)])
    );
  }

  return value;
}

export async function saveDocument(collection: string, id: string, data: Record<string, unknown>) {
  const cleanData = removeUndefined(data) as Record<string, unknown>;

  if (firestore) {
    await firestore.collection(collection).doc(id).set(cleanData, { merge: true });
    return;
  }

  memoryStore.set(`${collection}:${id}`, [cleanData]);
}

export async function updateDocument(collection: string, id: string, data: Record<string, unknown>) {
  await saveDocument(collection, id, data);
}

export async function deleteDocument(collection: string, id: string) {
  if (firestore) {
    await firestore.collection(collection).doc(id).delete();
    return;
  }

  memoryStore.delete(`${collection}:${id}`);
}

export async function getDocument<T>(collection: string, id: string): Promise<T | null> {
  if (firestore) {
    const snapshot = await firestore.collection(collection).doc(id).get();
    return snapshot.exists ? (snapshot.data() as T) : null;
  }

  const item = memoryStore.get(`${collection}:${id}`)?.[0];
  return item ? (item as T) : null;
}

export async function saveCollectionItem(collection: string, data: object) {
  const cleanData = removeUndefined(data) as Record<string, unknown>;

  if (firestore) {
    const ref = await firestore.collection(collection).add({ ...cleanData, createdAt: new Date().toISOString() });
    return ref.id;
  }

  const items = memoryStore.get(collection) || [];
  const id = `${collection}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const item = { id, ...cleanData, createdAt: new Date().toISOString() };
  items.push(item);
  memoryStore.set(collection, items);
  memoryStore.set(`${collection}:${id}`, [item]);
  return id;
}

export async function listCollection(collection: string, limit = 25) {
  if (firestore) {
    const snapshot = await firestore.collection(collection).orderBy('createdAt', 'desc').limit(limit).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  return (memoryStore.get(collection) || []).slice(-limit).reverse();
}

export async function listCollectionWhere(collection: string, field: string, value: string, limit = 50) {
  if (firestore) {
    const snapshot = await firestore.collection(collection).where(field, '==', value).limit(limit).get();
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => String((b as { createdAt?: string }).createdAt || '').localeCompare(String((a as { createdAt?: string }).createdAt || '')));
  }

  return (memoryStore.get(collection) || [])
    .filter((item) => (item as Record<string, unknown>)[field] === value)
    .slice(-limit)
    .reverse();
}
