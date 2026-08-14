import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class QrCodeService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey =
      process.env.JWT_SECRET ||
      process.env.QR_SECRET ||
      'verzel-secret-anti-fraud-key-2026';
  }

  generateSignature(payload: {
    eventId: string;
    clientId: string;
    seed: string;
  }): string {
    const rawData = `${payload.eventId}:${payload.clientId}:${payload.seed}`;
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(rawData)
      .digest('hex');
  }

  verifySignature(
    payload: {
      eventId: string;
      clientId: string;
      seed: string;
    },
    providedSignature: string,
  ): boolean {
    const expectedSignature = this.generateSignature(payload);
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex'),
      );
    } catch {
      return false;
    }
  }

  generateQrPayload(ticket: {
    id: string;
    eventId: string;
    qrCodeSignature: string;
  }): string {
    return JSON.stringify({
      id: ticket.id,
      eventId: ticket.eventId,
      signature: ticket.qrCodeSignature,
    });
  }
}
