/**
 * Local Storage Service for Emergency Contacts
 * Stores user-defined trusted contacts locally on the browser client.
 * Does not transmit personal contact records to any external database.
 */

const CONTACTS_STORAGE_KEY = 'saferoute_trusted_contacts';

const DEFAULT_CONTACTS = [
  {
    id: 'contact_sample_1',
    name: 'Family (Primary)',
    phone: '9876543210',
    relationship: 'Parent / Guardian',
    isEmergencyDefault: true
  }
];

export const storage = {
  getContacts: () => {
    try {
      const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(DEFAULT_CONTACTS));
        return DEFAULT_CONTACTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
      return DEFAULT_CONTACTS;
    }
  },

  saveContacts: (contacts) => {
    try {
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
      return true;
    } catch (e) {
      console.error('Failed to save contacts to LocalStorage:', e);
      return false;
    }
  },

  addContact: (contact) => {
    const list = storage.getContacts();
    const newContact = {
      ...contact,
      id: `contact_${Date.now()}`
    };
    list.push(newContact);
    storage.saveContacts(list);
    return newContact;
  },

  updateContact: (id, updatedFields) => {
    const list = storage.getContacts();
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      storage.saveContacts(list);
      return list[index];
    }
    return null;
  },

  deleteContact: (id) => {
    const list = storage.getContacts();
    const filtered = list.filter(c => c.id !== id);
    storage.saveContacts(filtered);
    return filtered;
  },

  /**
   * Generates a standard emergency message with coordinates
   * ONLY when coordinates are provided with user permission.
   */
  generateSosMessage: (coords = null, customNote = '') => {
    let msg = '🚨 URGENT SOS ALERT: I need immediate assistance!';
    
    if (coords && coords.latitude && coords.longitude) {
      const mapsUrl = `https://maps.google.com/?q=${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`;
      msg += `\n📍 My current location: ${mapsUrl}`;
      msg += `\n(Coordinates: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)})`;
      if (coords.accuracy) {
        msg += ` [Accuracy within ~${Math.round(coords.accuracy)}m]`;
      }
    } else {
      msg += '\n📍 Location could not be attached (GPS disabled or permission not granted).';
    }

    if (customNote) {
      msg += `\nNote: ${customNote}`;
    }

    msg += '\n\nSent via SafeRoute AI Women Safety Assistant. Please call me back or notify emergency services (112) immediately!';
    return msg;
  },

  /**
   * Generates a pre-filled WhatsApp click-to-chat URL
   */
  getWhatsAppUrl: (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Generates an SMS URL
   */
  getSmsUrl: (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
  }
};

