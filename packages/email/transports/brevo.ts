import type { SentMessageInfo, Transport } from 'nodemailer';
import type { Address } from 'nodemailer/lib/mailer';
import type MailMessage from 'nodemailer/lib/mailer/mail-message';

import { normalizeMailHeaders } from './normalize-headers';

const VERSION = '1.0.0';

type NodeMailerAddress = string | Address | Array<string | Address> | undefined;

interface BrevoAddress {
  email: string;
  name?: string;
}

interface BrevoAttachment {
  content: string;
  name: string;
}

interface BrevoTransportOptions {
  apiKey: string;
  endpoint: string;
}

/**
 * Transport for sending email through Brevo's transactional email API.
 */
export class BrevoTransport implements Transport<SentMessageInfo> {
  public name = 'BrevoTransport';
  public version = VERSION;

  private _options: BrevoTransportOptions;

  public static makeTransport(options: Partial<BrevoTransportOptions>) {
    return new BrevoTransport(options);
  }

  constructor(options: Partial<BrevoTransportOptions>) {
    const { apiKey = '', endpoint = 'https://api.brevo.com/v3/smtp/email' } = options;

    this._options = {
      apiKey,
      endpoint,
    };
  }

  public send(mail: MailMessage, callback: (_err: Error | null, _info: SentMessageInfo) => void) {
    if (!mail.data.to || !mail.data.from) {
      return callback(new Error('Missing required fields "to" or "from"'), null);
    }

    const to = this.toBrevoAddresses(mail.data.to);
    const cc = this.toBrevoAddresses(mail.data.cc);
    const bcc = this.toBrevoAddresses(mail.data.bcc);
    const [from] = this.toBrevoAddresses(mail.data.from);
    const [replyTo] = this.toBrevoAddresses(mail.data.replyTo);

    if (!from) {
      return callback(new Error('Missing required field "from"'), null);
    }

    const attachments = this.toBrevoAttachments(mail.data.attachments);

    fetch(this._options.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': this._options.apiKey,
      },
      body: JSON.stringify({
        sender: from,
        to,
        ...(cc.length > 0 ? { cc } : {}),
        ...(bcc.length > 0 ? { bcc } : {}),
        ...(replyTo ? { replyTo } : {}),
        subject: mail.data.subject,
        htmlContent: mail.data.html?.toString('utf-8') ?? '',
        textContent: mail.data.text?.toString('utf-8') ?? '',
        headers: normalizeMailHeaders(mail.data.headers),
        ...(attachments && attachments.length > 0 ? { attachment: attachments } : {}),
      }),
    })
      .then(async (res) => {
        if (res.status >= 200 && res.status <= 299) {
          const body = (await res.json().catch(() => ({}))) as { messageId?: string };

          return callback(null, {
            messageId: body.messageId ?? '',
            envelope: {
              from: mail.data.from,
              to: mail.data.to,
            },
            accepted: mail.data.to,
            rejected: [],
            pending: [],
          });
        }

        const body = (await res.json().catch(() => null)) as { message?: string; code?: string } | null;
        const message = body?.message ?? body?.code ?? `Brevo error: ${res.status}`;

        return callback(new Error(message), null);
      })
      .catch((err) => {
        return callback(err, null);
      });
  }

  private toBrevoAddresses(address: NodeMailerAddress): Array<BrevoAddress> {
    if (!address) {
      return [];
    }

    if (typeof address === 'string') {
      return [{ email: address }];
    }

    if (Array.isArray(address)) {
      return address.map((value) => {
        if (typeof value === 'string') {
          return { email: value };
        }

        return {
          email: value.address,
          name: value.name,
        };
      });
    }

    return [
      {
        email: address.address,
        name: address.name,
      },
    ];
  }

  private toBrevoAttachments(attachments: MailMessage['data']['attachments']): Array<BrevoAttachment> | undefined {
    if (!attachments || attachments.length === 0) {
      return undefined;
    }

    return attachments.map((attachment) => {
      if (!attachment.content) {
        throw new Error('Brevo transport only supports attachments with inline content');
      }

      const content = this.toBase64Content(attachment.content);

      return {
        name: typeof attachment.filename === 'string' && attachment.filename ? attachment.filename : 'attachment',
        content,
      };
    });
  }

  private toBase64Content(content: MailMessage['data']['attachments'][number]['content']): string {
    if (typeof content === 'string') {
      return Buffer.from(content).toString('base64');
    }

    if (Buffer.isBuffer(content)) {
      return content.toString('base64');
    }

    if (content instanceof Uint8Array) {
      return Buffer.from(content).toString('base64');
    }

    if (content instanceof ArrayBuffer) {
      return Buffer.from(content).toString('base64');
    }

    throw new Error('Brevo transport only supports string, Buffer, or binary attachment content');
  }
}