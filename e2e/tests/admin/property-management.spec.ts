import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { PropertyPage } from '../../pages/property.page.js';
import { registerStaff, createProperty, deleteProperty } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { setupAdminWebRouting } from '../../fixtures/api-helpers.js';

test.describe('Admin Property Management', () => {
  test('should display properties list', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const property = await createProperty(request, createPropertyInput());
    const loginPage = new LoginPage(page);
    const propertyPage = new PropertyPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await propertyPage.goto();

    // Assert
    await propertyPage.expectLoaded();
    await propertyPage.expectPropertyInList(property.name);
  });

  test('should navigate to add property page', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const propertyPage = new PropertyPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await propertyPage.goto();
    await propertyPage.addPropertyButton.click();

    // Assert
    await expect(page).toHaveURL('/properties/new');
    await expect(propertyPage.nameInput).toBeVisible();
    await expect(propertyPage.slugInput).toBeVisible();
  });

  test('should fill property form', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const propertyPage = new PropertyPage(page);
    const input = createPropertyInput();

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await propertyPage.gotoNew();
    await propertyPage.fillForm({
      name: input.name,
      slug: input.slug,
      description: input.description ?? '',
      city: input.city ?? '',
      country: input.country ?? '',
      price: input.pricePerNight ?? '',
      bedrooms: input.bedrooms?.toString() ?? '',
      bathrooms: input.bathrooms ?? '',
      maxGuests: input.maxGuests?.toString() ?? '',
    });

    // Assert
    await expect(propertyPage.nameInput).toHaveValue(input.name);
    await expect(propertyPage.slugInput).toHaveValue(input.slug);
  });

  test('should create and delete property via API', async ({ request }) => {
    // Arrange
    const input = createPropertyInput();

    // Act
    const created = await createProperty(request, input);
    await deleteProperty(request, created.id);

    // Assert
    const res = await request.get(`http://localhost:4000/properties/${created.id}`);
    expect(res.status()).toBe(404);
  });
});
