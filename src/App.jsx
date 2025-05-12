import React, { useEffect, useState } from "react";
import { db, auth, signInWithGoogle, logout } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(null);
  const [authError, setAuthError] = useState(null);

  const counterRef = user ? doc(db, "counters", user.uid) : null;

  const fetchCounter = async () => {
    if (!counterRef) return;
    try {
      const snap = await getDoc(counterRef);
      setCount(snap.exists() ? snap.data().value : null);
    } catch (e) {
      console.error("fetchCounter:", e);
    }
  };

  const createCounter = async () => {
    if (!counterRef) return;
    try {
      await setDoc(counterRef, { value: 0 });
      await fetchCounter();
    } catch (e) {
      console.error("createCounter:", e);
    }
  };

  const incrementCounter = async () => {
    if (!counterRef) return;
    try {
      await updateDoc(counterRef, { value: count + 1 });
      await fetchCounter();
    } catch (e) {
      console.error("incrementCounter:", e);
    }
  };

  const deleteCounter = async () => {
    if (!counterRef) return;
    try {
      await deleteDoc(counterRef);
      setCount(null);
    } catch (e) {
      console.error("deleteCounter:", e);
    }
  };

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(err.message);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) fetchCounter();
    else setCount(null);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center space-y-4">
        <h1 className="text-2xl font-bold">Firebase CRUD Counter</h1>

        {user ? (
          <p>
            Signed in as <strong>{user.displayName || user.email}</strong>
          </p>
        ) : (
          <p className="text-red-500">You must sign in to use the counter.</p>
        )}

        {authError && <p className="text-red-500">Error: {authError}</p>}

        {user && (count !== null ? <p className="text-xl">Count: {count}</p> : <p>No counter found.</p>)}

        <div className="space-x-2">
          {!user && (
            <button onClick={handleSignIn} className="bg-blue-600 text-white px-4 py-2 rounded">
              Sign in with Google
            </button>
          )}

          {user && (
            <>
              <button onClick={createCounter} className="bg-blue-500 text-white px-4 py-2 rounded">
                Create
              </button>

              <button onClick={incrementCounter} disabled={count === null} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
                Update
              </button>

              <button onClick={deleteCounter} disabled={count === null} className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50">
                Delete
              </button>

              <button onClick={logout} className="ml-4 bg-gray-700 text-white px-4 py-2 rounded">
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
