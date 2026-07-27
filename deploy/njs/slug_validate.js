// njs-валидатор слага для nginx auth_request.
//
// Задача: по неизвестному пути (например /muzhchinam или /some-product-slug)
// определить, существует ли такая категория или товар в бэкенде.
//   • существует  → return 204  (auth_request считает это «ОК» → nginx отдаёт SPA 200)
//   • не существует → return 404 (auth_request → 401/403 → error_page → SPA с 404)
//
// Повторяет логику клиентского CatalogResolver: сначала пробуем категорию,
// затем товар. Ходит через внутренний прокси /__be/ (см. nginx-spa-404.conf).

function ok(status) {
  return status >= 200 && status < 300
}

async function validateSlug(r) {
  // Полный путь запроса, например "/muzhchinam" или "/winter/some-product"
  const path = r.uri
  // Последний сегмент — слаг товара
  const slug = path.replace(/^\/+|\/+$/g, '').split('/').pop() || ''

  if (!slug) {
    r.return(403)
    return
  }

  try {
    // 1) Категория: /catalog/products?category=<полный путь>
    //    (те же параметры, что шлёт фронт в CatalogResolver)
    const catQuery =
      'category=' + encodeURIComponent(path) + '&attributeIds=25&priceTo=10000'
    const cat = await r.subrequest('/__be/catalog/products', {
      method: 'GET',
      args: catQuery,
    })
    if (ok(cat.status)) {
      r.return(204)
      return
    }

    // 2) Товар: /products/slug/<slug>
    const prod = await r.subrequest('/__be/products/slug/' + encodeURIComponent(slug), {
      method: 'GET',
    })
    if (ok(prod.status)) {
      r.return(204)
      return
    }

    // Ни категория, ни товар не найдены → 404
    r.return(403)
  } catch (e) {
    // Бэкенд недоступен: НЕ отдаём ложный 404 (это навредит индексации живых
    // страниц). Считаем путь валидным (SPA 200) — краулер повторит позже.
    r.return(204)
  }
}

export default { validateSlug }
