import type { Page, Locator } from '@playwright/test';

export class GuestPage {
  readonly page: Page;
  readonly tokenInput: Locator;
  readonly accessButton: Locator;
  readonly scanButton: Locator;
  readonly errorMessage: Locator;
  readonly propertyHeader: Locator;
  readonly wifiCard: Locator;
  readonly houseRules: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly feedbackStars: Locator;
  readonly feedbackComment: Locator;
  readonly feedbackSubmit: Locator;
  readonly exploreLink: Locator;
  readonly categoryFilters: Locator;
  readonly mapView: Locator;
  readonly recommendationCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tokenInput = page.locator('input#token');
    this.accessButton = page.getByRole('button', { name: /access your stay/i });
    this.scanButton = page.getByRole('button', { name: /scan qr code/i });
    this.errorMessage = page.locator('text=Invalid or expired guest token');
    this.propertyHeader = page.locator('h1').first();
    this.wifiCard = page.locator('text=WiFi').first();
    this.houseRules = page.locator('text=House Rules').first();
    this.messageInput = page.locator('input[placeholder="Type a message..."]');
    this.sendButton = page.getByRole('button', { name: /send/i });
    this.feedbackStars = page.locator('form').first().locator('button').filter({ has: page.locator('svg') });
    this.feedbackComment = page.locator('textarea');
    this.feedbackSubmit = page.getByRole('button', { name: /submit feedback/i });
    this.exploreLink = page.getByRole('link', { name: /explore/i });
    this.categoryFilters = page.locator('button').filter({ hasText: /All|Food|Sightseeing|Beach/i });
    this.mapView = page.locator('.leaflet-container').or(page.locator('[data-testid="map-view"]'));
    this.recommendationCards = page.locator('h3').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async enterToken(token: string): Promise<void> {
    await this.tokenInput.fill(token);
    await this.accessButton.click();
  }

  async expectMyFlatLoaded(): Promise<void> {
    await this.wifiCard.waitFor({ state: 'visible' });
    await this.houseRules.waitFor({ state: 'visible' });
  }

  async expectPropertyLoaded(propertyName: string): Promise<void> {
    await this.page.getByText(propertyName).first().waitFor({ state: 'visible' });
  }

  async expectTokenError(): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible' });
  }

  async sendMessage(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  async submitFeedback(rating: number, comment?: string): Promise<void> {
    // Click the star at the given index (1-based)
    const star = this.feedbackStars.nth(rating - 1);
    await star.click();
    if (comment) {
      await this.feedbackComment.fill(comment);
    }
    await this.feedbackSubmit.click();
  }

  async navigateToExplore(): Promise<void> {
    await this.exploreLink.click();
  }

  async filterCategory(category: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(category, 'i') }).click();
  }
}
