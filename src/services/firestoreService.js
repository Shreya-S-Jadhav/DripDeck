import { db } from './firebase';
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, where,
} from 'firebase/firestore';

// ─── Helpers ────────────────────────────────────────────────
function userCol(uid, colName) {
  return collection(db, 'users', uid, colName);
}
function userDocRef(uid, colName, docId) {
  return doc(db, 'users', uid, colName, docId);
}

// Timeout wrapper — Firestore writes can hang when security rules block or connection is stuck
function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(
        'Firestore operation timed out. Please check your Firebase security rules in the Console — ' +
        'make sure authenticated users have read/write access to the "users" collection.'
      )), ms)
    ),
  ]);
}

// ─── Clothing CRUD ──────────────────────────────────────────
export async function addClothing(uid, data) {
  console.log('firestoreService: Writing to Firestore for UID', uid);
  const ref = await withTimeout(addDoc(userCol(uid, 'clothes'), {
    ...data,
    wearCount: 0,
    favorite: false,
    createdAt: serverTimestamp(),
  }));
  console.log('firestoreService: Document written with ID', ref.id);
  return { id: ref.id, ...data, wearCount: 0, favorite: false };
}


export async function getClothes(uid) {
  const q = query(userCol(uid, 'clothes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateClothing(uid, docId, data) {
  await updateDoc(userDocRef(uid, 'clothes', docId), data);
}

export async function deleteClothing(uid, docId) {
  await deleteDoc(userDocRef(uid, 'clothes', docId));
}

// ─── Outfits CRUD ───────────────────────────────────────────
export async function addOutfit(uid, data) {
  const ref = await addDoc(userCol(uid, 'outfits'), {
    ...data,
    wearCount: 0,
    favorite: false,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...data, wearCount: 0, favorite: false };
}

export async function getOutfits(uid) {
  const q = query(userCol(uid, 'outfits'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateOutfit(uid, docId, data) {
  await updateDoc(userDocRef(uid, 'outfits', docId), data);
}

export async function deleteOutfit(uid, docId) {
  await deleteDoc(userDocRef(uid, 'outfits', docId));
}

// ─── Calendar CRUD ──────────────────────────────────────────
export async function addCalendarEntry(uid, data) {
  const ref = await addDoc(userCol(uid, 'calendar'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...data };
}

export async function getCalendarEntries(uid) {
  const snap = await getDocs(userCol(uid, 'calendar'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteCalendarEntry(uid, docId) {
  await deleteDoc(userDocRef(uid, 'calendar', docId));
}

// ─── Toggle Favorite (works for clothes or outfits) ─────────
export async function toggleFavorite(uid, colName, docId, currentVal) {
  await updateDoc(userDocRef(uid, colName, docId), { favorite: !currentVal });
}

// ─── Increment wear count ───────────────────────────────────
export async function incrementWearCount(uid, colName, docId, currentCount) {
  await updateDoc(userDocRef(uid, colName, docId), { wearCount: currentCount + 1 });
}
