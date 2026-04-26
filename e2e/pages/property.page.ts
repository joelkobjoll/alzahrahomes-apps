import type { Page, Locator } from '@playwright/test';

export class PropertyPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addPropertyButton: Locator;
  readonly propertyTable: Locator;
  readonly nameInput: Locator;
  readonly slugInput: Locator;
  readonly descriptionInput: Locator;
  readonly cityInput: Locator;
  readonly countryInput: Locator;
  readonly priceInput: Locator;
  readonly bedroomsInput: Locator;
  readonly bathroomsInput: Locator;
  readonly maxGuestsInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /properties/i });
    this.addPropertyButton = page.getByRole('link', { name: /add property/i });
    this.propertyTable = page.locator('table');
    this.nameInput = page.locator('input#name');
    this.slugInput = page.locator('input#slug');
    this.descriptionInput = page.locator('input#description');
    this.cityInput = page.locator('input#city');
    this.countryInput = page.locator('input#country');
    this.priceInput = page.locator('input#price');
    this.bedroomsInput = page.locator('input#bedrooms');
    this.bathroomsInput = page.locator('input#bathrooms');
    this.maxGuestsInput = page.locator('input#maxGuests');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/properties');
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/properties/new');
  }

  async fillForm(data: {
    name: string;
    slug: string;
    description?: string;
    city?: string;
    country?: string;
    price?: string;
    bedrooms?: string;
    bathrooms?: string;
    maxGuests?: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.slugInput.fill(data.slug);
    if (data.description) await this.descriptionInput.fill(data.description);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.country) await this.countryInput.fill(data.country);
    if (data.price) await this.priceInput.fill(data.price);
    if (data.bedrooms) await this.bedroomsInput.fill(data.bedrooms);
    if (data.bathrooms) await this.bathroomsInput.fill(data.bathrooms);
    if (data.maxGuests) await this.maxGuestsInput.fill(data.maxGuests);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  async expectPropertyInList(name: string): Promise<void> {
    await this.page.getByText(name).first().waitFor({ state: 'visible' });
  }

  async expectLoaded(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
  }
}
