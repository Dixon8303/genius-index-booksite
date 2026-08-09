/* Optional cloud layer: Google sign-in + Firestore result history, reusing the
   live Firebase project the original assessment already writes to — the same
   users/{uid}/results/{autoId} path, so old cloud saves appear automatically.

   Local-first by design: the app never needs this. The Firebase SDK is
   dynamically imported on the first explicit user action, so it code-splits
   into a chunk that never loads unless someone signs in. */

import type { GI10Export } from "../engine/export";

/* Web API keys are public identifiers by design for Firebase web apps;
   access control lives in the Firestore security rules. Same config as the
   original assessment (project: the-genius-index). */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCGFsfmUPmLqEapGhlqNmhjvJvtdBbRYDg",
  authDomain: "the-genius-index.firebaseapp.com",
  projectId: "the-genius-index",
  storageBucket: "the-genius-index.firebasestorage.app",
  messagingSenderId: "512062004597",
  appId: "1:512062004597:web:8aa14165fd902cf14bc73c",
};

export interface CloudUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

type FirebaseModules = {
  auth: typeof import("firebase/auth");
  firestore: typeof import("firebase/firestore");
  app: import("firebase/app").FirebaseApp;
};

let modsPromise: Promise<FirebaseModules> | null = null;

async function mods(): Promise<FirebaseModules> {
  if (!modsPromise) {
    modsPromise = (async () => {
      const [{ initializeApp, getApps }, auth, firestore] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
        import("firebase/firestore"),
      ]);
      const app = getApps()[0] ?? initializeApp(FIREBASE_CONFIG);
      return { auth, firestore, app };
    })();
  }
  return modsPromise;
}

function toCloudUser(u: import("firebase/auth").User | null): CloudUser | null {
  return u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null;
}

export async function signIn(): Promise<CloudUser | null> {
  const { auth, app } = await mods();
  const a = auth.getAuth(app);
  const provider = new auth.GoogleAuthProvider();
  const cred = await auth.signInWithPopup(a, provider);
  return toCloudUser(cred.user);
}

export async function signOut(): Promise<void> {
  const { auth, app } = await mods();
  await auth.signOut(auth.getAuth(app));
}

/* Subscribe to auth state. Loads the SDK — call only from screens where the
   user has (or plausibly wants) an account, not on the marketing pages. */
export async function onAuth(
  cb: (user: CloudUser | null) => void,
): Promise<() => void> {
  const { auth, app } = await mods();
  return auth.onAuthStateChanged(auth.getAuth(app), (u) => cb(toCloudUser(u)));
}

export async function currentUser(): Promise<CloudUser | null> {
  const { auth, app } = await mods();
  return toCloudUser(auth.getAuth(app).currentUser);
}

export async function pushResult(exportObj: GI10Export): Promise<string> {
  const { auth, firestore, app } = await mods();
  const u = auth.getAuth(app).currentUser;
  if (!u) throw new Error("Not signed in");
  const db = firestore.getFirestore(app);
  // Same user-doc upsert the original performed on sign-in.
  await firestore.setDoc(
    firestore.doc(db, "users", u.uid),
    {
      email: u.email,
      displayName: u.displayName,
      updatedAt: firestore.serverTimestamp(),
    },
    { merge: true },
  );
  // Document shape must match the original site exactly — it stores the
  // server timestamp in `ts` (with the client's ISO string kept as
  // `clientTs`) and lists results with orderBy("ts"). A different field
  // name would make results invisible across the two sites.
  const ref = await firestore.addDoc(
    firestore.collection(db, "users", u.uid, "results"),
    {
      ...exportObj,
      clientTs: exportObj.ts,
      ts: firestore.serverTimestamp(),
    },
  );
  return ref.id;
}

export async function listResults(): Promise<
  { cloudId: string; export: GI10Export }[]
> {
  const { auth, firestore, app } = await mods();
  const u = auth.getAuth(app).currentUser;
  if (!u) return [];
  const db = firestore.getFirestore(app);
  const q = firestore.query(
    firestore.collection(db, "users", u.uid, "results"),
    firestore.orderBy("ts", "desc"),
    firestore.limit(50),
  );
  const snap = await firestore.getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    // Restore ts to the ISO string the GI-1.0 contract expects: prefer the
    // preserved clientTs, else convert the Firestore server timestamp.
    const rawTs = data.ts as { toDate?: () => Date } | string | undefined;
    const iso =
      typeof data.clientTs === "string"
        ? data.clientTs
        : typeof rawTs === "string"
          ? rawTs
          : rawTs && typeof rawTs.toDate === "function"
            ? rawTs.toDate().toISOString()
            : "";
    delete data.clientTs;
    return {
      cloudId: d.id,
      export: { ...data, ts: iso } as unknown as GI10Export,
    };
  });
}
