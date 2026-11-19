/**
 * Contact form: client-side validation, then POST to PUBLIC_FORM_ENDPOINT
 * (Formspree-compatible JSON response) or fall back to a mailto: link.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const msg = form.dataset;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitHTML = submit.innerHTML;

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;

  function setError(input: HTMLInputElement | HTMLTextAreaElement, text: string) {
    const err = document.getElementById(`${input.id}-err`);
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (err) err.textContent = text;
  }

  function check(input: HTMLInputElement | HTMLTextAreaElement): string {
    const v = input.value.trim();
    if (input.required && !v) return msg.msgRequired!;
    if (input.name === 'email' && v && !EMAIL_RE.test(v)) return msg.msgEmail!;
    if (input.name === 'sites' && v && !(Number.isInteger(Number(v)) && Number(v) >= 1)) return msg.msgSites!;
    return '';
  }

  const validated = ['name', 'company', 'email', 'sites'].map(field);
  // Validate a field when the user leaves it, then live once it has shown an error.
  validated.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value.trim()) setError(input, check(input)); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) setError(input, check(input)); });
  });

  function setStatus(text: string, kind: '' | 'ok' | 'error' = '') {
    status.textContent = text;
    status.classList.toggle('is-ok', kind === 'ok');
    status.classList.toggle('is-error', kind === 'error');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid: HTMLInputElement | HTMLTextAreaElement | null = null;
    for (const input of validated) {
      const err = check(input);
      setError(input, err);
      if (err && !firstInvalid) firstInvalid = input;
    }
    if (firstInvalid) {
      setStatus(msg.msgSummary!, 'error');
      firstInvalid.focus();
      return;
    }
    if (field('_gotcha').value) return; // bot

    const data = new FormData(form);
    data.delete('_gotcha');
    const endpoint = msg.endpoint?.trim();

    if (!endpoint) {
      // No endpoint configured yet: open the visitor's email app with the request filled in.
      const lines = [
        `${field('name').labels?.[0]?.textContent?.trim() ?? 'Name'}: ${data.get('name')}`,
        `Company: ${data.get('company')}`,
        `Email: ${data.get('email')}`,
        `Sites: ${data.get('sites') || '-'}`,
        '',
        String(data.get('message') || ''),
      ];
      setStatus(msg.msgMailto!, 'ok');
      window.location.href = `${msg.mailto}&body=${encodeURIComponent(lines.join('\n'))}`;
      return;
    }

    submit.disabled = true;
    submit.textContent = msg.msgSending!;
    setStatus('');
    try {
      const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus(msg.msgSuccess!, 'ok');
    } catch {
      setStatus(msg.msgFailure!, 'error');
    } finally {
      submit.disabled = false;
      submit.innerHTML = submitHTML;
    }
  });
}
