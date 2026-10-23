# Event Name Mapping — Unified → Platform

| Unified Name | Meta (browser) | Meta (CAPI) | TikTok (browser) | TikTok (Events API) | GA4 (gtag) | GA4 (MP) |
|---|---|---|---|---|---|---|
| `PageView` | `PageView` | `PageView` | `ttq.page()` | `PageView` | `page_view` | `page_view` |
| `ViewContent` | `ViewContent` | `ViewContent` | `ViewContent` | `ViewContent` | `view_item` | `view_item` |
| `Lead` | `Lead` | `Lead` | `SubmitForm` | `SubmitForm` | `generate_lead` | `generate_lead` |
| `InitiateCheckout` | `InitiateCheckout` | `InitiateCheckout` | `InitiateCheckout` | `InitiateCheckout` | `begin_checkout` | `begin_checkout` |
| `Purchase` | `Purchase` | `Purchase` | `CompletePayment` | `CompletePayment` | `purchase` | `purchase` |

## Custom Data Fields per Event

| Event | Meta custom_data | TikTok properties | GA4 params |
|---|---|---|---|
| ViewContent | `content_name`, `value`, `currency` | `content_name`, `value`, `currency` | `items[]`, `currency`, `value` |
| Lead | — | — | — |
| InitiateCheckout | `value`, `currency`, `num_items` | `value`, `currency` | `value`, `currency` |
| Purchase | `value`, `currency`, `order_id` | `value`, `currency` | `transaction_id`, `value`, `currency` |

## Scroll/Timing — GA4 Only

| Event | GA4 event name | Params |
|---|---|---|
| Scroll depth | `scroll` | `percent_scrolled: 25 \| 50 \| 75 \| 90` |
| Time on page | `timing_complete` | `name: 'time_on_page', value: 60000` |

Meta và TikTok không có standard equivalent → không fire để tránh noise.
