import { Layout, Spin } from 'antd';
import { eventsCartApi } from 'src/transport/events/events.cart.api';
import { useEffect } from 'react';
import { useCurrentUserStore } from '../authorized/authorization.layout';
import { useLocation, useNavigate } from 'react-router-dom';

export const BuyNowPage = () => {
  const { user } = useCurrentUserStore();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeWorkflow = async () => {
      if (!user?.id) return;

      const { data: cart } = await eventsCartApi.createCart(user.id);
      if (!cart) return;

      const itemPriceId = new URLSearchParams(location.search).get(
        'itemPriceId'
      );
      if (!itemPriceId) {
        navigate('/');
        return;
      }

      await eventsCartApi.addItemToCart({
        cartId: cart.cartId,
        itemPriceId,
      });

      const {
        data: { checkoutUrl },
      } = await eventsCartApi.checkout({
        cartId: cart.cartId,
        userId: user.id,
      });

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    };

    initializeWorkflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Processing...</div>
      </div>
    </Layout>
  );
};
