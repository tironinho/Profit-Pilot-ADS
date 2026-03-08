import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import Footer from "../../components/Footer";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Stop burning ad budget in the dark.</h1>
        <p className={styles.text}>
          ProfitPilot Ads connects Meta, Google &amp; TikTok to your Shopify store: run Preflight diagnostics, Budget Shield guardrails, and a profit-first dashboard.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Install on Shopify / Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Preflight</strong>. Run tracking and performance checks before scaling.
          </li>
          <li>
            <strong>Budget Shield</strong>. Guardrails and alerts so you don’t burn budget without sales.
          </li>
          <li>
            <strong>Profit dashboard</strong>. Real revenue from Shopify and spend by channel in one place.
          </li>
        </ul>
      </div>
      <div className={styles.footerWrap}>
        <Footer />
      </div>
    </div>
  );
}
