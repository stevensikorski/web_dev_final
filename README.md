## Usage

- **Authenticate**: Sign in with Google to authenticate.
- **Create**: Initialize your personal counter.
- **Read**: Read the counter value.
- **Update**: Increment the counter value.
- **Delete**: Remove your counter document.

---

## Data Being Modified

Each user's counter is stored in Firestore under the `counters` collection, with the document ID matching their Firebase UID. Each document contains a single field:

- `value` (number): the current count for that user.

When a user interacts with the app, the following happens:

- **Create**: a new document is created with `value: 0`.
- **Read**: the users document is read to display the counter value.
- **Update**: the existing document's `value` is incremented by 1.
- **Delete**: the user's document is removed from Firestore.
