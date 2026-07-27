# Письма о статусе заказа — «Умная Одежда»

Кросс-клиентная (таблицы + инлайн-стили), адаптивная вёрстка. Синтаксис плейсхолдеров — Handlebars (`{{ }}`, `{{#each}}`, `{{#if}}`).

## Файлы

| Файл | Статус | Иллюстрация |
|------|--------|-------------|
| `order-shipped.html` | Заказ отправлен | тележка |
| `order-awaiting.html` | Ожидает получения | коробка |
| `order-out-for-delivery.html` | Выдан на доставку | коробка |
| `order-delivered.html` | Доставлен («Спасибо за заказ!») | коробка |

`assets/` — логотип и иллюстрации (прозрачные PNG @2x): `logo.png`, `icon-shipped.png`, `icon-box.png`.

## ⚠️ Картинки для реальной отправки

Почтовые клиенты (Gmail, Outlook, Яндекс) **не грузят** картинки по относительным путям и `cid:`/`data:`.
Перед отправкой замените `src="assets/..."` на **абсолютные HTTPS-URL** с вашего домена/CDN,
и точно так же отдавайте фото товаров (`{{...image}}`) абсолютными ссылками.
Относительные пути оставлены только для удобного локального превью.

## Токены

**Общие:** `{{orderNumber}}`, `{{orderUrl}}`, `{{privacyUrl}}`, `{{deliveryRulesUrl}}`, `{{returnsUrl}}`

**Товары `{{#each items}}`** (shipped / awaiting / out-for-delivery):
`{{this.image}}`, `{{this.article}}`, `{{this.title}}`, `{{this.price}}`
— в `order-shipped.html` дополнительно `{{this.trackingUrl}}`, `{{this.trackingNumber}}`

**order-awaiting:** `{{amountToPay}}`, `{{pickupPoint}}`
**order-out-for-delivery:** `{{amountToPay}}`, `{{deliveryAddress}}`, `{{deliveryDate}}`
**order-delivered:** циклы `{{#each purchasedItems}}` и `{{#each notPurchasedItems}}`
(`{{this.image}}`, `{{this.title}}`, `{{this.qty}}`, `{{this.unitPrice}}`, `{{this.sum}}`),
`{{bonus}}`, а также промоблок `{{#if firstOrder}}`: `{{promoCode}}`, `{{promoDiscount}}`, `{{promoValidity}}`, `{{promoUrl}}`

## Заметки

- Бренд-красный: `#DC2A1F`. Шрифт: Inter с фолбэком Arial (веб-шрифты в письмах ненадёжны).
- Кнопка «Скопировать промокод»: буфер обмена в письме недоступен (JS отключён), поэтому она ведёт на магазин `{{promoUrl}}`; сам код виден в тексте.
- Управляющие директивы `{{#each}}`/`{{#if}}` обёрнуты в HTML-комментарии (`<!-- {{#each …}} -->`) —
  так они не видны при открытии сырого файла в браузере, но Handlebars их всё равно обрабатывает.
  Видимые `{{…}}` в превью — это обычные плейсхолдеры данных, они заполнятся при компиляции.
