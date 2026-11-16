import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aliasDeletreado, aliasPorSilabas, dineroEnPalabras, nochesHabladas, numeroEnPalabras, rangoHablado } from './spoken-es.ts';

test('numbers read the way a person says them', () => {
  assert.equal(numeroEnPalabras(1104), 'mil ciento cuatro');
  assert.equal(numeroEnPalabras(1_706_271), 'un millón setecientos seis mil doscientos setenta y uno');
  assert.equal(numeroEnPalabras(21, true), 'veintiún');
  assert.equal(numeroEnPalabras(100), 'cien');
});

test('money with apocope and "de" before round millions', () => {
  assert.equal(dineroEnPalabras(552, 'USD'), 'quinientos cincuenta y dos dólares');
  assert.equal(dineroEnPalabras(1, 'USD'), 'un dólar');
  assert.equal(dineroEnPalabras(2_000_000, 'ARS'), 'dos millones de pesos');
  assert.equal(dineroEnPalabras(421_000, 'ARS'), 'cuatrocientos veintiún mil pesos');
});

test('date ranges and nights', () => {
  assert.equal(rangoHablado('2026-12-05', '2026-12-07'), 'del sábado 5 al lunes 7 de diciembre');
  assert.equal(rangoHablado('2026-12-30', '2027-01-03'), 'del miércoles 30 de diciembre al domingo 3 de enero');
  assert.equal(nochesHabladas(1), 'una noche');
  assert.equal(nochesHabladas(4), 'cuatro noches');
});

test('the Ripio alias dictated by syllables and by letters', () => {
  assert.equal(aliasPorSilabas(), 'il-bu-co, punto, ca-ri-lo');
  assert.equal(aliasDeletreado(), 'i, ele, be larga, u, ce, o, punto, ce, a, ere, i, ele, o');
});
