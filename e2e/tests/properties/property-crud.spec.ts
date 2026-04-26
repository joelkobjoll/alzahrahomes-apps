import { test, expect } from '@playwright/test';
import { createProperty, listProperties, getProperty, updateProperty, deleteProperty } from '../../fixtures/api-helpers.js';
import { createPropertyInput } from '../../fixtures/test-data.js';

test.describe('Property CRUD', () => {
  test('should create a property and retrieve it', async ({ request }) => {
    // Arrange
    const input = createPropertyInput();

    // Act
    const property = await createProperty(request, input);

    // Assert
    expect(property.name).toBe(input.name);
    expect(property.slug).toBe(input.slug);
    const fetched = await getProperty(request, property.id);
    expect(fetched.id).toBe(property.id);
  });

  test('should list properties including the created one', async ({ request }) => {
    // Arrange
    const input = createPropertyInput();
    const created = await createProperty(request, input);

    // Act
    const properties = await listProperties(request);

    // Assert
    const found = properties.find((p) => p.id === created.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe(input.name);
  });

  test('should update a property', async ({ request }) => {
    // Arrange
    const input = createPropertyInput();
    const created = await createProperty(request, input);
    const newName = 'Updated Property Name';

    // Act
    const updated = await updateProperty(request, created.id, { name: newName });

    // Assert
    expect(updated.name).toBe(newName);
    const fetched = await getProperty(request, created.id);
    expect(fetched.name).toBe(newName);
  });

  test('should delete a property', async ({ request }) => {
    // Arrange
    const input = createPropertyInput();
    const created = await createProperty(request, input);

    // Act
    await deleteProperty(request, created.id);

    // Assert
    const res = await request.get(`http://localhost:4000/properties/${created.id}`);
    expect(res.status()).toBe(404);
  });
});
