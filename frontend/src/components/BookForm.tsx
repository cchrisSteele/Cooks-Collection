import { useState, type FormEvent } from 'react';
import { LoaderCircle, Plus } from 'lucide-react';
import Modal from './Modal';
import { useRecipes } from '../context/RecipeContext';
import { errorMessage } from '../lib/helpers';
import type { RecipeBook } from '../types/models';

interface BookFormProps { onClose: () => void; onCreated: (book: RecipeBook) => void; }
const emojiOptions = ['📖', '🍝', '🍪', '🥗', '🥘', '🍜', '🍰', '🍳'];
export default function BookForm({ onClose, onCreated }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('📖');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { createBook } = useRecipes();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const book = await createBook({ title, description, emoji });
      onCreated(book);
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  return <Modal title="Create a recipe book" subtitle="Give this collection a name. You can add all your favorite recipes inside." onClose={onClose}>
    <form className="form-stack" onSubmit={submit}>
      <div className="field"><label htmlFor="new-book-title">Book name <span>*</span></label><input id="new-book-title" placeholder="e.g. Grandma's recipes" autoFocus maxLength={80} value={title} onChange={e => setTitle(e.target.value)} required /></div>
      <div className="field"><label htmlFor="new-book-description">Description</label><textarea id="new-book-description" placeholder="What recipes will you save here?" rows={3} maxLength={300} value={description} onChange={e => setDescription(e.target.value)} /></div>
      <div className="field"><label>Choose a book icon</label><div className="emoji-picker">{emojiOptions.map(option => <button key={option} type="button" className={option === emoji ? 'is-selected' : ''} onClick={() => setEmoji(option)} aria-label={`Choose ${option} icon`}>{option}</button>)}</div></div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="button button--primary button--full" disabled={busy}>{busy ? <LoaderCircle className="spin" size={18}/> : <Plus size={18}/>} Create recipe book</button>
    </form>
  </Modal>;
}
