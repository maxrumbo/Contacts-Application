import React from 'react';
import ContactList from './ContactList';
import { getData } from '../utils/data';
import ContactInput from './ContactInput';

const CONTACTS_STORAGE_KEY = 'contacts-app-data';

function loadInitialContacts() {
  try {
    const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);

    if (!storedContacts) {
      return getData();
    }

    const parsedContacts = JSON.parse(storedContacts);
    return Array.isArray(parsedContacts) ? parsedContacts : getData();
  } catch (error) {
    return getData();
  }
}

class ContactApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: loadInitialContacts(),
      viewMode: 'comfortable',
    }

    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onAddContactHandler = this.onAddContactHandler.bind(this);
    this.onViewModeChangeHandler = this.onViewModeChangeHandler.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(this.state.contacts));
    }
  }

  onDeleteHandler(id) {
    const contacts = this.state.contacts.filter(contact => contact.id !== id);
    this.setState({ contacts });
  }

  onAddContactHandler({ name, tag }) {
    const trimmedName = name.trim();
    const trimmedTag = tag.trim();

    if (!trimmedName || !trimmedTag) {
      return;
    }

    this.setState((prevState) => {
      return {
        contacts: [
          ...prevState.contacts,
          {
            id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
            name: trimmedName,
            tag: trimmedTag,
            imageUrl: '/images/default.jpg',
          }
        ]
      }
    });
  }

  onViewModeChangeHandler(viewMode) {
    this.setState({ viewMode });
  }

  render() {
    const totalContacts = this.state.contacts.length;
    const { viewMode } = this.state;

    return (
      <div className="contact-app">
        <header className="contact-app__header">
          <h1>Kontak Anda</h1>
          <span className="contact-app__count" aria-live="polite">
            {totalContacts} kontak
          </span>
        </header>

        <section className="contact-app__section">
          <h2>Tambah Kontak</h2>
          <ContactInput addContact={this.onAddContactHandler} />
        </section>

        <section className="contact-app__section">
          <div className="contact-app__list-header">
            <h2>Daftar Kontak</h2>
            <div className="contact-app__view-mode" role="group" aria-label="Mode tampilan daftar">
              <button
                type="button"
                className={viewMode === 'comfortable' ? 'active' : ''}
                aria-pressed={viewMode === 'comfortable'}
                onClick={() => this.onViewModeChangeHandler('comfortable')}
              >
                Default
              </button>
              <button
                type="button"
                className={viewMode === 'compact' ? 'active' : ''}
                aria-pressed={viewMode === 'compact'}
                onClick={() => this.onViewModeChangeHandler('compact')}
              >
                Detail
              </button>
            </div>
          </div>
          <ContactList contacts={this.state.contacts} onDelete={this.onDeleteHandler} viewMode={viewMode} />
        </section>
      </div>
    );
  }
}

export default ContactApp;