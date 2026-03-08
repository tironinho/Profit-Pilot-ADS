/**
 * Fetch paid orders metrics from Shopify Admin GraphQL.
 * Never expose raw tokens; use authenticated admin client.
 */

/**
 * Get revenue, orders count and AOV for paid orders in the last N days.
 * @param {object} admin - Shopify admin API (from authenticate.admin)
 * @param {{ sinceDays: number }} opts
 * @returns {Promise<{ revenue: number, orders: number, aov: number }>}
 */
export async function getPaidOrdersMetrics(admin, { sinceDays = 30 } = {}) {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  const sinceISO = since.toISOString();

  const query = `#graphql
    query getPaidOrders($query: String!, $after: String) {
      orders(first: 250, query: $query, sortKey: CREATED_AT, reverse: true, after: $after) {
        edges {
          node {
            id
            totalPriceSet {
              shopMoney {
                amount
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  let totalRevenue = 0;
  let totalOrders = 0;
  let cursor = null;

  do {
    const response = await admin.graphql(query, {
      variables: {
        query: `financial_status:paid AND created_at:>=${sinceISO}`,
        after: cursor,
      },
    });
    const json = await response.json();
    const orders = json?.data?.orders;
    if (!orders) break;

    for (const edge of orders.edges || []) {
      const node = edge.node;
      const amount = parseFloat(node?.totalPriceSet?.shopMoney?.amount ?? "0");
      totalRevenue += amount;
      totalOrders += 1;
    }

    const pageInfo = orders.pageInfo;
    if (!pageInfo?.hasNextPage) break;
    cursor = pageInfo.endCursor;
  } while (true);

  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  return { revenue: totalRevenue, orders: totalOrders, aov };
}
